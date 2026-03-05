import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Not configured' }, { status: 503 });
  }

  const rawMode = req.nextUrl.searchParams.get('mode')?.toUpperCase();
  const limitParam = req.nextUrl.searchParams.get('limit');
  const limit = Math.min(Math.max(parseInt(limitParam ?? '10', 10) || 10, 1), 25);

  if (rawMode !== 'SOLO' && rawMode !== 'TRIO') {
    return NextResponse.json(
      { error: 'mode must be "solo" or "trio"' },
      { status: 400 },
    );
  }

  const mode = rawMode as 'SOLO' | 'TRIO';

  // ── Try pre-computed snapshots first (fastest) ────────────────────────────
  const { data: snapshots } = await supabaseAdmin
    .from('leaderboard_snapshots')
    .select('rank_position, player_id, elo, tier')
    .eq('mode', mode)
    .order('rank_position', { ascending: true })
    .limit(limit);

  if (snapshots && snapshots.length > 0) {
    return NextResponse.json(await enrichWithPlayerNames(snapshots, 'rank_position'));
  }

  // ── Fallback: live query from players ────────────────────────────────────
  const eloCol = mode === 'SOLO' ? 'solo_elo' : 'trio_elo';

  const { data: players, error } = await supabaseAdmin
    .from('players')
    .select(`id, display_name, tag, ${eloCol}`)
    .order(eloCol, { ascending: false })
    .limit(limit);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!players || players.length === 0) {
    return NextResponse.json([]);
  }

  return NextResponse.json(players.map((p, i) => {
    const tag = p.tag ? `#${p.tag}` : '';
    return {
      rank: i + 1,
      display_name: `${p.display_name}${tag}`,
      elo: p[eloCol] as number,
      tier: null,
    };
  }));
}

// ── Helper ────────────────────────────────────────────────────────────────────

async function enrichWithPlayerNames(
  rows: { rank_position: number; player_id: string; elo: number; tier?: string | null }[],
  rankField: 'rank_position',
) {
  if (!supabaseAdmin || rows.length === 0) return [];

  const playerIds = rows.map((r) => r.player_id);

  const { data: players } = await supabaseAdmin
    .from('players')
    .select('id, display_name, tag')
    .in('id', playerIds);

  const playerMap = new Map((players ?? []).map((p) => [p.id, p]));

  return rows.map((row) => {
    const p = playerMap.get(row.player_id);
    const tag = p?.tag ? `#${p.tag}` : '';
    return {
      rank: row[rankField],
      display_name: p ? `${p.display_name}${tag}` : row.player_id,
      elo: row.elo,
      tier: row.tier ?? null,
    };
  });
}
