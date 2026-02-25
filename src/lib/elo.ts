// ── MarathonIntel Elo computation engine ──────────────────────────────────────
//
// Algorithm:
//   Expected score  : E(A,B) = 1 / (1 + 10^((RB-RA)/400))
//   Placement result: S(A,B) = 1 if A placed higher, 0.5 if tie, 0 if lower
//   Multi-team delta: ΔR_A  = (K/(M-1)) * Σ_{B≠A}(S(A,B) - E(A,B))
//   Perf score      : 0.40*(kills/avgKills) + 0.40*(dmg/avgDmg) + 0.20*(surv/avgSurv)
//   Perf multiplier : clamp(0.85, 1.15, PerfScore)
//   Reliability     : 1 - exp(-n/30)   where n = matches played in this mode
//   Final delta     : ΔR_final = ΔR_A * PerfMult * Reliability

export type QueueMode = 'SOLO' | 'TRIO';

export interface PlayerResult {
  playerId:         string;
  kills:            number;
  damage:           number;
  survivalSeconds:  number;
  /** Total matches played in this mode — drives the Reliability factor. */
  matchesPlayed:    number;
  currentElo:       number;
}

export interface TeamResult {
  teamId:    string;
  /** 1 = first place (extracted first / fewest deaths), higher numbers = worse. */
  placement: number;
  extracted: boolean;
  /** For TRIO: average of member Elos. For SOLO: same as the single player's Elo. */
  teamElo:   number;
  players:   PlayerResult[];
}

export interface EloUpdate {
  playerId:    string;
  oldElo:      number;
  newElo:      number;
  delta:       number;
  teamDelta:   number;   // raw team-level delta before perf/reliability
  perfMult:    number;
  reliability: number;
}

// ── K factor ─────────────────────────────────────────────────────────────────
// Higher K during calibration (fast movement), lower K for established ratings.
// Recommended schedule:
//   < 10 matches  : K=64  (placement phase)
//   10–29 matches : K=48  (settling)
//   Elo ≥ 2000    : K=24  (protect high-rating stability)
//   default       : K=32

export function getK(matchesPlayed: number, currentElo: number): number {
  if (matchesPlayed < 10)    return 64;
  if (matchesPlayed < 30)    return 48;
  if (currentElo >= 2000)    return 24;
  return 32;
}

// ── Core formulas ─────────────────────────────────────────────────────────────

function expectedScore(ratingA: number, ratingB: number): number {
  return 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400));
}

function placementResult(placementA: number, placementB: number): number {
  if (placementA < placementB) return 1;   // A placed higher (better)
  if (placementA > placementB) return 0;   // A placed lower
  return 0.5;                               // tie
}

/** Reliability factor — ramps from 0 → 1 as match count grows.
 *  At n=30 ≈ 0.63, at n=60 ≈ 0.86, at n=90 ≈ 0.95. */
function reliabilityFactor(matchesPlayed: number): number {
  return 1 - Math.exp(-matchesPlayed / 30);
}

/** Performance multiplier — bounded so farming can't dominate. */
function perfMultiplier(
  kills:    number, avgKills:    number,
  damage:   number, avgDamage:   number,
  survival: number, avgSurvival: number,
): number {
  const killRatio     = avgKills    > 0 ? kills    / avgKills    : 1;
  const damageRatio   = avgDamage   > 0 ? damage   / avgDamage   : 1;
  const survivalRatio = avgSurvival > 0 ? survival / avgSurvival : 1;
  const perfScore = 0.40 * killRatio + 0.40 * damageRatio + 0.20 * survivalRatio;
  return Math.min(1.15, Math.max(0.85, perfScore));
}

// ── Main export ───────────────────────────────────────────────────────────────

/**
 * Compute per-player Elo deltas for a single match.
 *
 * Performance is computed at the *team* level for TRIO (avg of members),
 * and at the *player* level for SOLO. This prevents a dominant carry from
 * inflating their teammates' gains while still rewarding coordinated play.
 *
 * @param teams  All teams that participated in the lobby (sorted by placement).
 * @param mode   'SOLO' | 'TRIO'
 * @returns      Map<playerId, EloUpdate>
 */
export function computeEloDeltas(
  teams: TeamResult[],
  mode:  QueueMode,
): Map<string, EloUpdate> {
  const M = teams.length;
  if (M < 2) return new Map();

  // ── Lobby-wide averages (for PerfMult baseline) ──
  const allPlayers  = teams.flatMap(t => t.players);
  const total       = allPlayers.length;
  const avgKills    = allPlayers.reduce((s, p) => s + p.kills,           0) / total;
  const avgDamage   = allPlayers.reduce((s, p) => s + p.damage,          0) / total;
  const avgSurvival = allPlayers.reduce((s, p) => s + p.survivalSeconds, 0) / total;

  // ── Per-team performance multiplier ──
  const teamPerfMult = new Map<string, number>();
  for (const team of teams) {
    if (mode === 'SOLO') {
      const p = team.players[0];
      teamPerfMult.set(team.teamId, perfMultiplier(
        p.kills, avgKills, p.damage, avgDamage, p.survivalSeconds, avgSurvival,
      ));
    } else {
      const n    = team.players.length;
      const tK   = team.players.reduce((s, p) => s + p.kills,           0) / n;
      const tD   = team.players.reduce((s, p) => s + p.damage,          0) / n;
      const tS   = team.players.reduce((s, p) => s + p.survivalSeconds, 0) / n;
      teamPerfMult.set(team.teamId, perfMultiplier(tK, avgKills, tD, avgDamage, tS, avgSurvival));
    }
  }

  // ── Per-team Elo delta (multi-team pairwise) ──
  const result = new Map<string, EloUpdate>();

  for (const teamA of teams) {
    let rawDelta = 0;
    for (const teamB of teams) {
      if (teamA.teamId === teamB.teamId) continue;
      const s = placementResult(teamA.placement, teamB.placement);
      const e = expectedScore(teamA.teamElo, teamB.teamElo);
      rawDelta += (s - e);
    }

    const avgMP  = teamA.players.reduce((s, p) => s + p.matchesPlayed, 0) / teamA.players.length;
    const K      = getK(Math.round(avgMP), Math.round(teamA.teamElo));
    const scaled = (K / (M - 1)) * rawDelta;
    const perf   = teamPerfMult.get(teamA.teamId) ?? 1;

    for (const player of teamA.players) {
      const rel        = reliabilityFactor(player.matchesPlayed);
      const finalDelta = scaled * perf * rel;
      const newElo     = Math.max(0, Math.round(player.currentElo + finalDelta));

      result.set(player.playerId, {
        playerId:    player.playerId,
        oldElo:      player.currentElo,
        newElo,
        delta:       newElo - player.currentElo,
        teamDelta:   Math.round(scaled   * 100) / 100,
        perfMult:    Math.round(perf     * 100) / 100,
        reliability: Math.round(rel      * 100) / 100,
      });
    }
  }

  return result;
}

// ── Safe update workflow (reference — actual SQL lives in schema file) ─────────
//
// 1. MATCH INGESTED → insert into `matches` + `match_team_results`
// 2. CHECK idempotency → SELECT ratings_applied_at FROM matches WHERE id = $match_id
//    → if not null, skip (already processed)
// 3. FETCH current ratings → SELECT * FROM player_ratings WHERE player_id = ANY($ids)
// 4. RUN computeEloDeltas() in application layer
// 5. BEGIN TRANSACTION
//    a. INSERT INTO rating_history (player_id, match_id, mode, old_elo, new_elo, delta, ...)
//    b. UPDATE player_ratings SET elo = $newElo, matches_played = matches_played + 1
//    c. UPDATE matches SET ratings_applied_at = NOW() WHERE id = $match_id
// 6. COMMIT
// 7. REFRESH leaderboard_snapshots (can be deferred / async)
