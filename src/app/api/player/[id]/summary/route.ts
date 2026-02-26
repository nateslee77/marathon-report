import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Not configured' }, { status: 503 });
  }

  const { id } = params;

  // ── 1. ELO ratings (≤ 2 rows) ────────────────────────────────────────────
  const { data: ratings, error: ratingsErr } = await supabaseAdmin
    .from('player_ratings')
    .select('mode, elo, matches_played, last_match_at')
    .eq('player_id', id);

  if (ratingsErr) {
    return NextResponse.json({ error: ratingsErr.message }, { status: 500 });
  }

  // ── 2. Match results — joins team result + match metadata ─────────────────
  // Fetch all rows for this player (needed for accurate career K/D + extraction %).
  const { data: playerRows, error: rowsErr } = await supabaseAdmin
    .from('match_player_results')
    .select(`
      kills,
      deaths,
      match_team_results!team_result_id ( extracted ),
      matches!match_id ( played_at )
    `)
    .eq('player_id', id);

  if (rowsErr) {
    return NextResponse.json({ error: rowsErr.message }, { status: 500 });
  }

  if (!ratings?.length && !playerRows?.length) {
    return NextResponse.json({ error: 'Player not found' }, { status: 404 });
  }

  // ── 3. Aggregate ──────────────────────────────────────────────────────────
  const soloRating = ratings?.find((r) => r.mode === 'SOLO') ?? null;
  const trioRating = ratings?.find((r) => r.mode === 'TRIO') ?? null;

  let kd: number | null = null;
  let extractionPercent: number | null = null;
  let lastPlayed: string | null = null;

  if (playerRows && playerRows.length > 0) {
    const totalKills = playerRows.reduce((s, r) => s + (r.kills ?? 0), 0);
    const totalDeaths = playerRows.reduce((s, r) => s + (r.deaths ?? 0), 0);
    kd = totalDeaths > 0 ? totalKills / totalDeaths : totalKills > 0 ? totalKills : null;

    const extractedCount = playerRows.filter(
      (r) => (r.match_team_results as unknown as { extracted: boolean } | null)?.extracted === true,
    ).length;
    extractionPercent = (extractedCount / playerRows.length) * 100;

    const dates = playerRows
      .map((r) => (r.matches as unknown as { played_at: string } | null)?.played_at)
      .filter((d): d is string => Boolean(d));
    if (dates.length > 0) {
      lastPlayed = dates.sort().at(-1) ?? null;
    }
  }

  // Fallback: last_match_at from ratings
  if (!lastPlayed) {
    const ratingDates = [soloRating?.last_match_at, trioRating?.last_match_at].filter(
      (d): d is string => Boolean(d),
    );
    lastPlayed = ratingDates.sort().at(-1) ?? null;
  }

  return NextResponse.json({
    solo_elo: soloRating?.elo ?? null,
    trio_elo: trioRating?.elo ?? null,
    kd: kd !== null ? Math.round(kd * 100) / 100 : null,
    extraction_percent:
      extractionPercent !== null ? Math.round(extractionPercent * 10) / 10 : null,
    last_played: lastPlayed,
    matches_played: (soloRating?.matches_played ?? 0) + (trioRating?.matches_played ?? 0),
  });
}
