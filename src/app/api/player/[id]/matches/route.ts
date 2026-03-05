import { NextRequest, NextResponse } from 'next/server';

// Match history is served directly from the Bungie / Marathon API.
// Match data is NOT stored in Supabase — Bungie is the source of truth.
//
// TODO when Marathon API is live:
//   1. Call Bungie PGCR endpoint for this player's recent matches
//   2. Map results to the shape below and return them
//   3. Optionally: call triggerPlayerIngest() here to compute ELO from new matches
//
// Expected response shape per match:
// {
//   match_id:   string
//   mode:       'SOLO' | 'TRIO'
//   map:        string
//   played_at:  string (ISO)
//   extracted:  boolean | null
//   placement:  number | null
//   kills:      number
//   deaths:     number
//   assists:    number
//   damage:     number
//   elo_delta:  number | null
// }

export async function GET(
  _req: NextRequest,
  _ctx: { params: { id: string } },
) {
  return NextResponse.json([]);
}
