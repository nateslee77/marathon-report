import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Not configured' }, { status: 503 });
  }

  const { data, error } = await supabaseAdmin
    .from('users')
    .select('bungie_membership_id, display_name, bungie_name, selected_avatar, is_pinnacle')
    .eq('bungie_membership_id', id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: 'Player not found' }, { status: 404 });
  }

  const rawName = data.bungie_name ?? data.display_name ?? '';
  const hashIdx = rawName.lastIndexOf('#');
  const name = hashIdx > 0 ? rawName.slice(0, hashIdx) : rawName;
  const tag = hashIdx > 0 ? `#${rawName.slice(hashIdx + 1)}` : `#${id.slice(-4)}`;

  return NextResponse.json({
    id: data.bungie_membership_id,
    name,
    tag,
    avatar: data.selected_avatar ?? '',
    isPinnacle: data.is_pinnacle ?? false,
  });
}
