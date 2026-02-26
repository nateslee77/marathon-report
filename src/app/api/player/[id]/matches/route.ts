import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Not configured' }, { status: 503 });
  }

  const { id } = params;
  const limitParam = req.nextUrl.searchParams.get('limit');
  const limit = Math.min(Math.max(parseInt(limitParam ?? '10', 10) || 10, 1), 25);

  // ── 1. Get all match IDs + stats for this player ──────────────────────────
  const { data: playerRows, error: rowsErr } = await supabaseAdmin
    .from('match_player_results')
    .select('match_id, kills, deaths, assists, damage, elo_before, elo_after, team_result_id')
    .eq('player_id', id);

  if (rowsErr) {
    return NextResponse.json({ error: rowsErr.message }, { status: 500 });
  }

  if (!playerRows || playerRows.length === 0) {
    return NextResponse.json([]);
  }

  const allMatchIds = [...new Set(playerRows.map((r) => r.match_id))];

  // ── 2. Get matches ordered by date, take the most recent `limit` ──────────
  const { data: matches, error: matchErr } = await supabaseAdmin
    .from('matches')
    .select('id, played_at, mode, map')
    .in('id', allMatchIds)
    .order('played_at', { ascending: false })
    .limit(limit);

  if (matchErr) {
    return NextResponse.json({ error: matchErr.message }, { status: 500 });
  }

  if (!matches || matches.length === 0) {
    return NextResponse.json([]);
  }

  // ── 3. Get team results for just these matches ────────────────────────────
  const recentMatchIdSet = new Set(matches.map((m) => m.id));
  const recentPlayerRows = playerRows.filter((r) => recentMatchIdSet.has(r.match_id));
  const teamResultIds = [...new Set(recentPlayerRows.map((r) => r.team_result_id))];

  const { data: teamResults } = await supabaseAdmin
    .from('match_team_results')
    .select('id, extracted, placement')
    .in('id', teamResultIds);

  // ── 4. Join in memory ─────────────────────────────────────────────────────
  const playerRowMap = new Map(recentPlayerRows.map((r) => [r.match_id, r]));
  const teamMap = new Map((teamResults ?? []).map((t) => [t.id, t]));

  const result = matches.map((match) => {
    const pr = playerRowMap.get(match.id);
    const team = pr ? teamMap.get(pr.team_result_id) : null;
    const eloDelta =
      pr?.elo_after != null && pr?.elo_before != null
        ? pr.elo_after - pr.elo_before
        : null;

    return {
      match_id: match.id,
      mode: match.mode,
      map: match.map,
      played_at: match.played_at,
      extracted: team?.extracted ?? null,
      placement: team?.placement ?? null,
      kills: pr?.kills ?? 0,
      deaths: pr?.deaths ?? 0,
      assists: pr?.assists ?? 0,
      damage: pr?.damage ?? 0,
      elo_delta: eloDelta,
    };
  });

  return NextResponse.json(result);
}
