import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { triggerPlayerIngest } from '@/lib/ingest';

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Not configured' }, { status: 503 });
  }

  // Fire-and-forget — keeps data fresh when Marathon API is live
  triggerPlayerIngest(id).catch(() => {});

  // 1. Check users table first (registered users have avatar, pinnacle, etc.)
  const { data: user } = await supabaseAdmin
    .from('users')
    .select('bungie_membership_id, display_name, bungie_name, selected_avatar, is_pinnacle, youtube_url, twitch_url')
    .eq('bungie_membership_id', id)
    .single();

  if (user) {
    const rawName = user.bungie_name ?? user.display_name ?? '';
    const hashIdx = rawName.lastIndexOf('#');
    const name = hashIdx > 0 ? rawName.slice(0, hashIdx) : rawName;
    const tag  = hashIdx > 0 ? `#${rawName.slice(hashIdx + 1)}` : `#${id.slice(-4)}`;

    return NextResponse.json({
      id:          user.bungie_membership_id,
      name,
      tag,
      avatar:      user.selected_avatar ?? '',
      isPinnacle:  user.is_pinnacle ?? false,
      youtubeUrl:  user.youtube_url ?? null,
      twitchUrl:   user.twitch_url ?? null,
    });
  }

  // 2. Fall back to players table (anyone who has appeared in match data)
  const { data: player } = await supabaseAdmin
    .from('players')
    .select('id, display_name, tag')
    .eq('id', id)
    .single();

  if (player) {
    const tag = player.tag ? `#${player.tag}` : `#${id.slice(-4)}`;
    return NextResponse.json({
      id:         player.id,
      name:       player.display_name,
      tag,
      avatar:     '',
      isPinnacle: false,
      youtubeUrl: null,
      twitchUrl:  null,
    });
  }

  return NextResponse.json({ error: 'Player not found' }, { status: 404 });
}
