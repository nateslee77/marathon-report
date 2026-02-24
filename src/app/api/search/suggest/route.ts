import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import {
  bungieSearchCache,
  bungieRateLimiter,
  BungieSuggestResult,
} from '@/lib/search-cache';
import { Platform, SuggestResult } from '@/types';

const BUNGIE_API_ROOT = 'https://www.bungie.net/Platform';

/**
 * Parse the raw search input into a name prefix and optional code prefix.
 *
 * Examples:
 *   "s"        → { prefix: "s",     codePrefix: null,  canCallBungie: false }
 *   "su"       → { prefix: "su",    codePrefix: null,  canCallBungie: true  }
 *   "sushi#"   → { prefix: "sushi", codePrefix: "",    canCallBungie: true  }
 *   "sushi#1"  → { prefix: "sushi", codePrefix: "1",   canCallBungie: true  }
 *   "#12"      → { prefix: "",      codePrefix: "12",  canCallBungie: false }
 */
function parseInput(raw: string): {
  prefix: string;
  codePrefix: string | null;
  canCallBungie: boolean;
} {
  const trimmed = raw.trim();
  const hashIdx = trimmed.lastIndexOf('#');

  if (hashIdx < 0) {
    return { prefix: trimmed, codePrefix: null, canCallBungie: trimmed.length >= 2 };
  }
  if (hashIdx === 0) {
    // Starts with '#' — no valid name prefix
    return { prefix: '', codePrefix: trimmed.slice(1), canCallBungie: false };
  }

  const prefix = trimmed.slice(0, hashIdx);
  const codeStr = trimmed.slice(hashIdx + 1);
  return { prefix, codePrefix: codeStr, canCallBungie: prefix.length >= 2 };
}

function bungieTypeToPlat(type: number): Platform {
  if (type === 1) return 'Xbox';
  if (type === 2) return 'PlayStation';
  return 'PC';
}

async function fetchBungieGlobalName(
  prefix: string
): Promise<{ results: BungieSuggestResult[]; cached: boolean }> {
  const key = prefix.toLowerCase();
  const hit = bungieSearchCache.get(key);
  if (hit) return { results: hit, cached: true };

  const resp = await fetch(`${BUNGIE_API_ROOT}/User/Search/GlobalName/0/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': process.env.BUNGIE_API_KEY!,
    },
    body: JSON.stringify({ displayNamePrefix: prefix }),
    signal: AbortSignal.timeout(4000),
  });

  if (!resp.ok) return { results: [], cached: false };

  const json = await resp.json();
  const raw: BungieSuggestResult[] = [];

  for (const r of json?.Response?.searchResults ?? []) {
    const membership = r.destinyMemberships?.[0];
    if (!membership) continue;
    raw.push({
      displayName: r.bungieGlobalDisplayName,
      displayNameCode: r.bungieGlobalDisplayNameCode,
      membershipId: membership.membershipId,
      membershipType: membership.membershipType,
    });
  }

  bungieSearchCache.set(key, raw);
  return { results: raw, cached: false };
}

export async function GET(request: NextRequest) {
  const raw = request.nextUrl.searchParams.get('q')?.trim() ?? '';
  // Strip PostgREST-special and shell-injection characters; enforce max length
  const sanitized = raw.replace(/[^a-zA-Z0-9 _.#\-]/g, '').slice(0, 64);

  if (!sanitized) {
    return NextResponse.json({ results: [], meta: { cached: false, rate_limited: false } });
  }

  const { prefix, codePrefix, canCallBungie } = parseInput(sanitized);
  const searchTerm = prefix || sanitized;

  // Registered user avatars keyed by membershipId — used to enrich Bungie results
  const registeredAvatars = new Map<string, string | null>();
  const supabaseResults: SuggestResult[] = [];

  // ── Tier 1: Supabase registered users (always runs, min 1 char) ──────────
  if (supabaseAdmin && searchTerm.length >= 1) {
    const [byDisplay, byBungieName] = await Promise.all([
      supabaseAdmin
        .from('users')
        .select('bungie_membership_id, display_name, bungie_name, selected_avatar')
        .ilike('display_name', `${searchTerm}%`)
        .limit(8),
      supabaseAdmin
        .from('users')
        .select('bungie_membership_id, display_name, bungie_name, selected_avatar')
        .ilike('bungie_name', `${searchTerm}%`)
        .limit(8),
    ]);

    const seen = new Set<string>();
    const rows = [...(byDisplay.data ?? []), ...(byBungieName.data ?? [])];

    for (const row of rows) {
      const mid = row.bungie_membership_id;
      if (!mid || seen.has(mid)) continue;
      seen.add(mid);

      const rawName = row.bungie_name ?? row.display_name ?? '';
      const hashIdx = rawName.lastIndexOf('#');
      const dName = hashIdx > 0 ? rawName.slice(0, hashIdx) : rawName;
      const codeStr = hashIdx > 0 ? rawName.slice(hashIdx + 1) : '0';
      const dCode = parseInt(codeStr, 10) || 0;

      // When user typed "name#digits", filter by code prefix
      if (codePrefix !== null && codePrefix !== '' && !String(dCode).startsWith(codePrefix)) {
        continue;
      }

      const fullName = dCode
        ? `${dName}#${String(dCode).padStart(4, '0')}`
        : dName;

      registeredAvatars.set(mid, row.selected_avatar || null);

      supabaseResults.push({
        membershipId: mid,
        membershipType: 3,
        displayName: dName,
        displayNameCode: dCode,
        fullName,
        platform: 'PC',
        avatar: row.selected_avatar || undefined,
        isRegistered: true,
      });
    }
  }

  const seenIds = new Set(supabaseResults.map((r) => r.membershipId));
  const merged: SuggestResult[] = [...supabaseResults];
  let wasCached = false;
  let rateLimited = false;

  // ── Tier 2: Bungie global name search (≥2 chars, not "#"-prefixed) ────────
  if (canCallBungie && process.env.BUNGIE_API_KEY) {
    const cacheKey = prefix.toLowerCase();
    const existsInCache = bungieSearchCache.get(cacheKey) !== null;
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';

    // Short-circuit: if cached, skip rate limit consumption
    if (existsInCache || bungieRateLimiter.isAllowed(ip)) {
      try {
        const { results: bungieResults, cached } = await fetchBungieGlobalName(prefix);
        wasCached = cached;

        for (const r of bungieResults) {
          if (merged.length >= 8) break;
          if (seenIds.has(r.membershipId)) continue;

          if (codePrefix !== null && codePrefix !== '' && !String(r.displayNameCode).startsWith(codePrefix)) {
            continue;
          }

          const fullName = `${r.displayName}#${String(r.displayNameCode).padStart(4, '0')}`;
          const registeredAvatar = registeredAvatars.get(r.membershipId);

          merged.push({
            membershipId: r.membershipId,
            membershipType: r.membershipType,
            displayName: r.displayName,
            displayNameCode: r.displayNameCode,
            fullName,
            platform: bungieTypeToPlat(r.membershipType),
            avatar: registeredAvatar ?? undefined,
            isRegistered: registeredAvatars.has(r.membershipId),
          });
          seenIds.add(r.membershipId);
        }
      } catch {
        // Bungie failure is non-fatal — return Supabase results
      }
    } else {
      rateLimited = true;
    }
  }

  return NextResponse.json({
    results: merged.slice(0, 8),
    meta: { cached: wasCached, rate_limited: rateLimited },
  });
}
