import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

// Strict patterns — only exact YouTube channel / Twitch profile URLs
const YOUTUBE_RE = /^https:\/\/(www\.)?youtube\.com\/(@[\w.-]{1,100}|channel\/[\w-]{1,64}|c\/[\w.-]{1,100}|user\/[\w.-]{1,100})$/;
const TWITCH_RE = /^https:\/\/(www\.)?twitch\.tv\/[\w-]{1,25}$/;

function validateYouTube(url: string | null | undefined): string | null {
  if (!url) return null;
  return YOUTUBE_RE.test(url.trim()) ? url.trim() : null;
}

function validateTwitch(url: string | null | undefined): string | null {
  if (!url) return null;
  return TWITCH_RE.test(url.trim()) ? url.trim() : null;
}

export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.bungieMembershipId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  }

  // Only pinnacle users can set social links
  const { data: userData } = await supabaseAdmin
    .from('users')
    .select('is_pinnacle')
    .eq('id', session.user.bungieMembershipId)
    .single();

  if (!userData?.is_pinnacle) {
    return NextResponse.json({ error: 'Pinnacle required' }, { status: 403 });
  }

  const body = await request.json();

  // Server-side validation — reject anything that doesn't match exactly
  const youtubeUrl = validateYouTube(body.youtube_url);
  const twitchUrl = validateTwitch(body.twitch_url);

  if (body.youtube_url && youtubeUrl === null) {
    return NextResponse.json({ error: 'Invalid YouTube URL. Must be a youtube.com channel URL.' }, { status: 400 });
  }
  if (body.twitch_url && twitchUrl === null) {
    return NextResponse.json({ error: 'Invalid Twitch URL. Must be a twitch.tv channel URL.' }, { status: 400 });
  }

  const updates: Record<string, string | null> = { updated_at: new Date().toISOString() };

  // Only update fields that were explicitly included in the request
  if ('youtube_url' in body) updates.youtube_url = youtubeUrl;
  if ('twitch_url' in body) updates.twitch_url = twitchUrl;

  const { error } = await supabaseAdmin
    .from('users')
    .update(updates)
    .eq('id', session.user.bungieMembershipId);

  if (error) {
    console.error('[social-links] Supabase error:', error.message);
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
  }

  return NextResponse.json({ ok: true, youtubeUrl, twitchUrl });
}
