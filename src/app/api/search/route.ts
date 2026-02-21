import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { SearchPlayer, Platform } from '@/types';

const BUNGIE_API_ROOT = 'https://www.bungie.net/Platform';

interface BungieSearchResult {
  bungieGlobalDisplayName: string;
  bungieGlobalDisplayNameCode: number;
  destinyMemberships?: { membershipType: number; membershipId: string }[];
}

function bungieTypeToPlat(type: number): Platform {
  if (type === 1) return 'Xbox';
  if (type === 2) return 'PlayStation';
  return 'PC';
}

export async function GET(request: NextRequest) {
  const raw = request.nextUrl.searchParams.get('q')?.trim() ?? '';

  // Strip characters that have special meaning in PostgREST filter strings,
  // then enforce length bounds before touching Supabase or Bungie.
  const query = raw.replace(/[^a-zA-Z0-9 _.#\-]/g, '').slice(0, 64);

  if (query.length < 2) {
    return NextResponse.json([]);
  }

  const results: SearchPlayer[] = [];

  // Tier 1: registered users in Supabase (trigram indexed — fast)
  // Use separate .ilike() calls instead of .or() to avoid PostgREST wildcard encoding issues.
  if (supabaseAdmin) {
    const [byDisplay, byBungieName] = await Promise.all([
      supabaseAdmin
        .from('users')
        .select('bungie_membership_id, display_name, bungie_name, is_pinnacle')
        .ilike('display_name', `%${query}%`)
        .limit(6),
      supabaseAdmin
        .from('users')
        .select('bungie_membership_id, display_name, bungie_name, is_pinnacle')
        .ilike('bungie_name', `%${query}%`)
        .limit(6),
    ]);

    const seen = new Set<string>();
    const rows = [...(byDisplay.data ?? []), ...(byBungieName.data ?? [])];
    const data = rows.filter((r) => {
      if (seen.has(r.bungie_membership_id)) return false;
      seen.add(r.bungie_membership_id);
      return true;
    });

    for (const row of data) {
        const rawName = row.bungie_name ?? row.display_name ?? '';
        const hashIdx = rawName.lastIndexOf('#');
        const name = hashIdx > 0 ? rawName.slice(0, hashIdx) : rawName;
        const tag = hashIdx > 0 ? `#${rawName.slice(hashIdx + 1)}` : '';

        results.push({
          id: row.bungie_membership_id,
          name,
          tag,
          platform: 'PC',
          rank: 0,
          kd: 0,
          winRate: 0,
          competitiveRank: 'Unranked',
        });
    }
  }

  // Tier 2: Bungie API for players not yet registered on site
  if (results.length < 3 && process.env.BUNGIE_API_KEY) {
    try {
      const resp = await fetch(`${BUNGIE_API_ROOT}/User/Search/GlobalName/0/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': process.env.BUNGIE_API_KEY,
        },
        body: JSON.stringify({ displayNamePrefix: query }),
        signal: AbortSignal.timeout(4000),
      });

      if (resp.ok) {
        const json = await resp.json();
        const searchResults: BungieSearchResult[] = json?.Response?.searchResults ?? [];
        const existingIds = new Set(results.map((r) => r.id));

        for (const result of searchResults) {
          if (results.length >= 6) break;
          const membership = result.destinyMemberships?.[0];
          if (!membership || existingIds.has(membership.membershipId)) continue;

          results.push({
            id: membership.membershipId,
            name: result.bungieGlobalDisplayName,
            tag: `#${String(result.bungieGlobalDisplayNameCode).padStart(4, '0')}`,
            platform: bungieTypeToPlat(membership.membershipType),
            rank: 0,
            kd: 0,
            winRate: 0,
            competitiveRank: 'Unranked',
          });
        }
      }
    } catch {
      // Bungie API failure is non-fatal — return what we have from Supabase
    }
  }

  return NextResponse.json(results);
}
