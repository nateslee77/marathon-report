import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// Local image paths — Supabase has no image column.
// Paths use %20 for spaces so Next.js image optimiser doesn't choke on the URL.
const IMAGE_MAP: Record<string, string> = {
  'OVERRUN AR':           '/images/Weapons%20no%20bg/OVERRUN%20AR-Picsart-BackgroundRemover.png',
  'TWIN TAP HBR':         '/images/Weapons%20no%20bg/TWIN%20TAP%20HBR-Picsart-BackgroundRemover.png',
  'V75 SCAR':             '/images/Weapons%20no%20bg/V75%20SCAR-Picsart-BackgroundRemover.png',
  'M77 ASSAULT RIFLE':    '/images/Weapons%20no%20bg/M77%20ASSAULT%20RIFLE-Picsart-BackgroundRemover.png',
  'CONQUEST LMG':         '/images/Weapons%20no%20bg/CONQUEST%20LMG-Picsart-BackgroundRemover.png',
  'WSTR COMBAT SHOTGUN':  '/images/Weapons%20no%20bg/WSTR%20COMBAT%20SHOTGUN-Picsart-BackgroundRemover.png',
  'COPPERHEAD RF':        '/images/Weapons%20no%20bg/COPPERHEAD%20RF-Picsart-BackgroundRemover.png',
  'BRRT SMG':             '/images/Weapons%20no%20bg/BRRT%20SMG-Picsart-BackgroundRemover.png',
  'IMPACT H-AR':          '/images/Weapons%20no%20bg/IMPACT%20HAR-Picsart-BackgroundRemover.png',
  'BULLY SMG':            '/images/Weapons%20no%20bg/BULLY%20SMG-Picsart-BackgroundRemover.png',
  'LONGSHOT':             '/images/Weapons%20no%20bg/LONGSHOT-Picsart-BackgroundRemover.png',
  'MAGNUM MC':            '/images/Weapons%20no%20bg/MAGNUM%20HC-Picsart-BackgroundRemover.png',
  'REPEATER HPR':         '/images/Weapons%20no%20bg/REPEATER%20HPR-Picsart-BackgroundRemover.png',
  'V22 VOLT THROWER':     '/images/Weapons%20no%20bg/V22%20VOLT%20THROWER-Picsart-BackgroundRemover.png',
  'RETALIATOR LMG':       '/images/Weapons%20no%20bg/RETALIATOR%20LMG-Picsart-BackgroundRemover.png',
  'DEMOLITION HMG':       '/images/Weapons%20no%20bg/DEMOLITION%20HMG-Picsart-BackgroundRemover.png',
  'HARDLINE PR':          '/images/Weapons%20no%20bg/HARDLINE%20PR-Picsart-BackgroundRemover.png',
  'ARES RG':              '/images/Weapons%20no%20bg/ARES%20RG-Picsart-BackgroundRemover.png',
  'CE TACTICAL SIDEARM':  '/images/Weapons%20no%20bg/CE%20TACTICAL%20SIDEARM-Picsart-BackgroundRemover.png',
  'STRYDER M1T':          '/images/Weapons%20no%20bg/STRYDER%20MIT-Picsart-BackgroundRemover.png',
  'V99 CHANNEL RIFLE':    '/images/Weapons%20no%20bg/V99%20CHANNEL%20RIFLE-Picsart-BackgroundRemover.png',
  'V85 CIRCUIT BREAKER':  '/images/Weapons%20no%20bg/V85%20CIRCUIT%20BREAKER-Picsart-BackgroundRemover.png',
  'V66 LOOKOUT':          '/images/Weapons%20no%20bg/V66%20LOOKOUT-Picsart-BackgroundRemover.png',
  'V11 PUNCH':            '/images/Weapons%20no%20bg/V11%20PUNCH-Picsart-BackgroundRemover.png',
  'BR33 VOLLEY RIFLE':    '/images/Weapons%20no%20bg/B33_VOLLEY_RIFLE-removebg-preview.png',
  'OUTLAND':              '/images/Weapons%20no%20bg/OUTLAND-Picsart-BackgroundRemover.png',
  'MISRIAH 2442':         '/images/Weapons%20no%20bg/MISRIAH%202442-Picsart-BackgroundRemover.png',
  'V00 ZEUS RG':          '/images/Weapons%20no%20bg/VOO%20ZEUS%20RG-Picsart-BackgroundRemover.png',
};

// Usage rates keyed by normalized uppercase name
const USAGE_MAP: Record<string, number> = {
  'OVERRUN AR': 18.4, 'TWIN TAP HBR': 14.7, 'V75 SCAR': 12.1,
  'M77 ASSAULT RIFLE': 9.8, 'CONQUEST LMG': 8.3, 'WSTR COMBAT SHOTGUN': 7.1,
  'COPPERHEAD RF': 5.9, 'BRRT SMG': 4.6, 'IMPACT H-AR': 3.8, 'BULLY SMG': 3.2,
  'LONGSHOT': 2.7, 'MAGNUM MC': 2.1, 'REPEATER HPR': 1.8, 'V22 VOLT THROWER': 1.4,
  'RETALIATOR LMG': 1.1, 'DEMOLITION HMG': 0.9, 'HARDLINE PR': 0.7, 'ARES RG': 0.6,
  'CE TACTICAL SIDEARM': 0.5, 'STRYDER M1T': 0.4, 'V99 CHANNEL RIFLE': 0.35,
  'V85 CIRCUIT BREAKER': 0.3, 'V66 LOOKOUT': 0.25, 'V11 PUNCH': 0.2,
  'BR33 VOLLEY RIFLE': 0.15, 'OUTLAND': 0.12, 'MISRIAH 2442': 0.1, 'V00 ZEUS RG': 0.08,
};

// Normalize: trim + collapse whitespace + uppercase
function norm(s: string) {
  return s.trim().replace(/\s+/g, ' ').toUpperCase();
}

// Pre-build normalised lookups
const normalizedImageMap = Object.fromEntries(
  Object.entries(IMAGE_MAP).map(([k, v]) => [norm(k), v])
);
const normalizedUsageMap = Object.fromEntries(
  Object.entries(USAGE_MAP).map(([k, v]) => [norm(k), v])
);

export async function GET() {
  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: 'Supabase not configured' },
      { status: 503 }
    );
  }

  const { data, error } = await supabaseAdmin
    .from('weapons')
    .select('weapon, type, firepower, accuracy, handling, range, mag, zoom, dps, description, ammo_type, mod_slots');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data || data.length === 0) {
    return NextResponse.json([]);
  }

  const weapons = data
    .map((row) => {
      const rawName = String(row.weapon ?? '').trim();
      const key     = norm(rawName);
      return {
        rank:        0,
        name:        rawName,
        image:       normalizedImageMap[key] ?? null,
        usage:       normalizedUsageMap[key] ?? 0,
        type:        row.type        ?? null,
        firepower:   row.firepower   ?? null,
        accuracy:    row.accuracy    ?? null,
        handling:    row.handling    ?? null,
        range:       row.range       ?? null,
        mag:         row.mag         ?? null,
        zoom:        row.zoom        ?? null,
        dps:         row.dps         ?? null,
        description: row.description ?? null,
        ammo_type:   row.ammo_type   ?? null,
        mod_slots:   row.mod_slots   ?? null,
      };
    })
    .sort((a, b) => b.usage - a.usage)
    .map((w, i) => ({ ...w, rank: i + 1 }));

  return NextResponse.json(weapons, {
    headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' },
  });
}
