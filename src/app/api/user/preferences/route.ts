import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

const PREFERENCE_COLUMNS = [
  'selected_avatar',
  'card_theme_color',
  'avatar_border_style',
  'equipped_badges',
  'is_pinnacle',
  'youtube_url',
  'twitch_url',
] as const;

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.bungieMembershipId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  }

  const { data, error } = await supabaseAdmin
    .from('users')
    .select(PREFERENCE_COLUMNS.join(','))
    .eq('id', session.user.bungieMembershipId)
    .single();

  if (error) {
    console.error('Failed to fetch preferences:', error);
    return NextResponse.json({ error: 'Failed to fetch preferences' }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.bungieMembershipId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  }

  const body = await request.json();

  // Only allow updating known preference fields
  const allowed = new Set<string>(PREFERENCE_COLUMNS);
  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  for (const key of Object.keys(body)) {
    if (allowed.has(key)) {
      updates[key] = body[key];
    }
  }

  const { error } = await supabaseAdmin
    .from('users')
    .update(updates)
    .eq('id', session.user.bungieMembershipId);

  if (error) {
    console.error('Failed to update preferences:', error);
    return NextResponse.json({ error: 'Failed to update preferences' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
