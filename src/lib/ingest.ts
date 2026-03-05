// ── On-search ingest trigger ───────────────────────────────────────────────────
//
// Called whenever a player profile is viewed. Fetches their recent match history
// from the Bungie / Marathon API, filters out already-processed matches, and
// posts the remainder to /api/admin/ingest for ELO computation.
//
// STATUS: Stub — waiting for Marathon API to go public.
//
// TODO when Marathon API is live:
//   1. Call Bungie API: GET /Platform/Destiny2/{membershipType}/Account/{membershipId}/Stats/Activities/
//   2. Filter mode to Marathon activity type hashes
//   3. For each unprocessed match: fetch full PGCR (post-game carnage report)
//   4. Map PGCR → IngestMatch format (see /api/admin/ingest/route.ts for types)
//   5. POST to /api/admin/ingest with x-ingest-secret header
//   6. Fire-and-forget — don't block the player page response

export async function triggerPlayerIngest(playerId: string): Promise<void> {
  // No-op until Marathon API is available.
  void playerId;
}
