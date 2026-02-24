import { NextRequest, NextResponse } from 'next/server';

const BUNGIE_API_ROOT = 'https://www.bungie.net/Platform';

/**
 * POST /api/search/resolve
 *
 * Resolves a Bungie global name to a stable membershipId.
 *
 * Body (one of):
 *   { full_name: "sushi#1234" }
 *   { display_name: "sushi", display_name_code: 1234 }
 *
 * Returns:
 *   { player_id: string, membership_type: number }
 */
export async function POST(request: NextRequest) {
  let body: {
    full_name?: string;
    display_name?: string;
    display_name_code?: string | number;
  } | null = null;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  let displayName: string;
  let displayNameCode: number;

  if (body?.full_name) {
    const hashIdx = body.full_name.lastIndexOf('#');
    if (hashIdx <= 0) {
      return NextResponse.json({ error: 'Invalid full_name format. Expected "name#0000".' }, { status: 400 });
    }
    displayName = body.full_name.slice(0, hashIdx);
    displayNameCode = parseInt(body.full_name.slice(hashIdx + 1), 10);
  } else if (body?.display_name && body?.display_name_code !== undefined) {
    displayName = body.display_name;
    displayNameCode = parseInt(String(body.display_name_code), 10);
  } else {
    return NextResponse.json(
      { error: 'Provide full_name or display_name + display_name_code' },
      { status: 400 }
    );
  }

  if (!displayName || isNaN(displayNameCode)) {
    return NextResponse.json({ error: 'Invalid name or code' }, { status: 400 });
  }

  if (!process.env.BUNGIE_API_KEY) {
    return NextResponse.json({ error: 'API not configured' }, { status: 503 });
  }

  // membershipType -1 = All platforms
  const resp = await fetch(`${BUNGIE_API_ROOT}/Destiny2/SearchDestinyPlayerByBungieName/-1/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': process.env.BUNGIE_API_KEY,
    },
    body: JSON.stringify({ displayName, displayNameCode }),
    signal: AbortSignal.timeout(5000),
  }).catch(() => null);

  if (!resp?.ok) {
    return NextResponse.json({ error: 'Bungie API error' }, { status: 502 });
  }

  const json = await resp.json();
  const memberships: Array<{ membershipId: string; membershipType: number }> =
    json?.Response ?? [];

  const primary = memberships[0];
  if (!primary) {
    return NextResponse.json({ error: 'Player not found' }, { status: 404 });
  }

  return NextResponse.json({
    player_id: primary.membershipId,
    membership_type: primary.membershipType,
  });
}
