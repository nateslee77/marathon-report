import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { computeEloDeltas, TeamResult, QueueMode } from '@/lib/elo';

// ── Input types (from Bungie / Marathon API) ──────────────────────────────────

interface IngestPlayer {
  playerId:        string;
  displayName:     string;
  tag?:            string;   // numeric portion e.g. "1234"
  kills:           number;
  damage:          number;
  survivalSeconds: number;
}

interface IngestTeam {
  teamId:    string;
  placement: number;   // 1 = best
  extracted: boolean;
  players:   IngestPlayer[];
}

export interface IngestMatch {
  matchId: string;
  mode:    QueueMode;
  teams:   IngestTeam[];
}

// ── Route ─────────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-ingest-secret');
  if (!secret || secret !== process.env.INGEST_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  }

  const body = await req.json();
  const matches: IngestMatch[] = Array.isArray(body) ? body : [body];

  const results = [];

  for (const match of matches) {
    const { matchId, mode, teams } = match;

    // 1. Idempotency — skip already-processed matches
    const { data: existing } = await supabaseAdmin
      .from('processed_matches')
      .select('match_id')
      .eq('match_id', matchId)
      .single();

    if (existing) {
      results.push({ matchId, status: 'skipped' });
      continue;
    }

    // 2. Fetch current ratings for all players in this match
    const allPlayerIds = teams.flatMap(t => t.players.map(p => p.playerId));

    const { data: dbPlayers } = await supabaseAdmin
      .from('players')
      .select('id, solo_elo, solo_matches, trio_elo, trio_matches')
      .in('id', allPlayerIds);

    const dbMap = new Map((dbPlayers ?? []).map(p => [p.id, p]));

    // 3. Build TeamResult[] — fill in currentElo + matchesPlayed from DB
    const teamResults: TeamResult[] = teams.map(team => {
      const playerResults = team.players.map(p => {
        const db           = dbMap.get(p.playerId);
        const currentElo   = mode === 'SOLO' ? (db?.solo_elo    ?? 1000) : (db?.trio_elo    ?? 1000);
        const matchesPlayed = mode === 'SOLO' ? (db?.solo_matches ?? 0)   : (db?.trio_matches ?? 0);
        return { playerId: p.playerId, kills: p.kills, damage: p.damage, survivalSeconds: p.survivalSeconds, matchesPlayed, currentElo };
      });

      const teamElo = playerResults.reduce((s, p) => s + p.currentElo, 0) / playerResults.length;
      return { teamId: team.teamId, placement: team.placement, extracted: team.extracted, teamElo, players: playerResults };
    });

    // 4. Compute ELO deltas
    const updates = computeEloDeltas(teamResults, mode);

    // 5. Upsert each player with their new ELO
    const eloField     = mode === 'SOLO' ? 'solo_elo'     : 'trio_elo';
    const matchesField = mode === 'SOLO' ? 'solo_matches'  : 'trio_matches';

    for (const team of teams) {
      for (const p of team.players) {
        const update  = updates.get(p.playerId);
        const db      = dbMap.get(p.playerId);
        const prevElo = mode === 'SOLO' ? (db?.solo_elo ?? 1000) : (db?.trio_elo ?? 1000);
        const prevMP  = mode === 'SOLO' ? (db?.solo_matches ?? 0) : (db?.trio_matches ?? 0);

        await supabaseAdmin.from('players').upsert({
          id:            p.playerId,
          display_name:  p.displayName,
          tag:           p.tag ?? null,
          [eloField]:    update?.newElo ?? prevElo,
          [matchesField]: prevMP + 1,
          last_match_at: new Date().toISOString(),
          updated_at:    new Date().toISOString(),
        }, { onConflict: 'id' });
      }
    }

    // 6. Mark match as processed
    await supabaseAdmin.from('processed_matches').insert({ match_id: matchId, mode });

    results.push({
      matchId,
      status:  'processed',
      updates: Object.fromEntries(
        [...updates.entries()].map(([id, u]) => [id, { oldElo: u.oldElo, newElo: u.newElo, delta: u.delta }])
      ),
    });
  }

  return NextResponse.json({ ok: true, results });
}
