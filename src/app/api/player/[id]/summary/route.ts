import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { triggerPlayerIngest } from '@/lib/ingest';

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Not configured' }, { status: 503 });
  }

  const { id } = params;

  // Fire-and-forget ingest — keeps ELO fresh when Marathon API is live
  triggerPlayerIngest(id).catch(() => {});

  const { data: player, error } = await supabaseAdmin
    .from('players')
    .select('solo_elo, solo_matches, trio_elo, trio_matches, last_match_at')
    .eq('id', id)
    .single();

  if (error && error.code !== 'PGRST116') {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!player) {
    return NextResponse.json({ error: 'Player not found' }, { status: 404 });
  }

  return NextResponse.json({
    solo_elo:           player.solo_elo    ?? null,
    trio_elo:           player.trio_elo    ?? null,
    matches_played:     (player.solo_matches ?? 0) + (player.trio_matches ?? 0),
    last_played:        player.last_match_at ?? null,
    // K/D and extraction % come from Bungie API — see /api/player/[id]/matches
    kd:                 null,
    extraction_percent: null,
  });
}
