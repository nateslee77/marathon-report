-- ═══════════════════════════════════════════════════════════════════════════
-- MarathonIntel  ·  Elo rating system schema
-- Supabase Postgres  ·  Run once during initial setup
-- ═══════════════════════════════════════════════════════════════════════════

-- ── players ──────────────────────────────────────────────────────────────────
-- Core identity table. Elo lives in player_ratings (separate per-mode row).
CREATE TABLE IF NOT EXISTS players (
  id              TEXT        PRIMARY KEY, -- Bungie membershipId or internal UUID
  display_name    TEXT        NOT NULL,
  tag             TEXT        NOT NULL DEFAULT '',
  platform        TEXT        NOT NULL DEFAULT 'PC',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── matches ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS matches (
  id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  played_at           TIMESTAMPTZ NOT NULL,
  map                 TEXT,
  mode                TEXT        NOT NULL CHECK (mode IN ('SOLO','TRIO')),
  lobby_size          INT         NOT NULL, -- total number of teams
  -- idempotency guard: set when Elo has been applied, NULL if pending
  ratings_applied_at  TIMESTAMPTZ,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS matches_played_at_idx        ON matches (played_at DESC);
CREATE INDEX IF NOT EXISTS matches_ratings_pending_idx  ON matches (id) WHERE ratings_applied_at IS NULL;

-- ── match_team_results ────────────────────────────────────────────────────────
-- One row per team per match.  For SOLO, team_size=1.
CREATE TABLE IF NOT EXISTS match_team_results (
  id              UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id        UUID    NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  team_id         TEXT    NOT NULL, -- arbitrary team identifier within the match
  placement       INT     NOT NULL, -- 1 = 1st place (best)
  extracted       BOOLEAN NOT NULL DEFAULT FALSE,
  -- aggregate team stats (used for PerfMult at team level for TRIO)
  total_kills     INT     NOT NULL DEFAULT 0,
  total_damage    INT     NOT NULL DEFAULT 0,
  avg_survival_s  NUMERIC NOT NULL DEFAULT 0, -- avg seconds survived per member
  team_size       INT     NOT NULL DEFAULT 1
);
CREATE INDEX IF NOT EXISTS mtr_match_id_idx ON match_team_results (match_id);

-- ── match_player_results ──────────────────────────────────────────────────────
-- One row per player per match.
CREATE TABLE IF NOT EXISTS match_player_results (
  id              UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id        UUID    NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  team_result_id  UUID    NOT NULL REFERENCES match_team_results(id) ON DELETE CASCADE,
  player_id       TEXT    NOT NULL REFERENCES players(id),
  kills           INT     NOT NULL DEFAULT 0,
  deaths          INT     NOT NULL DEFAULT 0,
  assists         INT     NOT NULL DEFAULT 0,
  damage          INT     NOT NULL DEFAULT 0,
  survival_s      INT     NOT NULL DEFAULT 0, -- seconds survived
  credits_earned  INT     NOT NULL DEFAULT 0,
  elo_before      INT,    -- snapshot at time of match for audit
  elo_after       INT
);
CREATE INDEX IF NOT EXISTS mpr_match_id_idx  ON match_player_results (match_id);
CREATE INDEX IF NOT EXISTS mpr_player_id_idx ON match_player_results (player_id);

-- ── player_ratings ────────────────────────────────────────────────────────────
-- One row per player per mode. This is the live rating used for display.
CREATE TABLE IF NOT EXISTS player_ratings (
  player_id       TEXT    NOT NULL REFERENCES players(id),
  mode            TEXT    NOT NULL CHECK (mode IN ('SOLO','TRIO')),
  elo             INT     NOT NULL DEFAULT 1000,
  matches_played  INT     NOT NULL DEFAULT 0,
  last_match_at   TIMESTAMPTZ,
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (player_id, mode)
);
CREATE INDEX IF NOT EXISTS pr_elo_idx ON player_ratings (mode, elo DESC);

-- ── rating_history ────────────────────────────────────────────────────────────
-- Immutable audit trail — one row per player per match per mode.
-- Never updated; only appended.
CREATE TABLE IF NOT EXISTS rating_history (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id       TEXT        NOT NULL REFERENCES players(id),
  match_id        UUID        NOT NULL REFERENCES matches(id),
  mode            TEXT        NOT NULL CHECK (mode IN ('SOLO','TRIO')),
  elo_before      INT         NOT NULL,
  elo_after       INT         NOT NULL,
  delta           INT         NOT NULL, -- elo_after - elo_before
  team_delta      NUMERIC(8,2),         -- raw multi-team delta (pre perf/reliability)
  perf_mult       NUMERIC(5,3),         -- PerfMult applied
  reliability     NUMERIC(5,3),         -- Reliability factor applied
  recorded_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (player_id, match_id, mode)    -- idempotency guard
);
CREATE INDEX IF NOT EXISTS rh_player_id_idx ON rating_history (player_id, recorded_at DESC);
CREATE INDEX IF NOT EXISTS rh_match_id_idx  ON rating_history (match_id);

-- ── leaderboard_snapshots ─────────────────────────────────────────────────────
-- Periodically refreshed (cron or after each batch update).
-- Avoids scanning player_ratings at query time for leaderboard pages.
CREATE TABLE IF NOT EXISTS leaderboard_snapshots (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  mode            TEXT        NOT NULL CHECK (mode IN ('SOLO','TRIO')),
  player_id       TEXT        NOT NULL REFERENCES players(id),
  elo             INT         NOT NULL,
  rank_position   INT         NOT NULL, -- 1 = top of leaderboard
  tier            TEXT        NOT NULL, -- 'Unranked'|'Bronze'|...|'Ultra'
  snapshotted_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS ls_mode_rank_idx ON leaderboard_snapshots (mode, rank_position);

-- ── Helper: upsert_player_rating ──────────────────────────────────────────────
-- Called inside the rating-update transaction.
CREATE OR REPLACE FUNCTION upsert_player_rating(
  p_player_id     TEXT,
  p_mode          TEXT,
  p_new_elo       INT,
  p_match_played_at TIMESTAMPTZ
) RETURNS VOID LANGUAGE plpgsql AS $$
BEGIN
  INSERT INTO player_ratings (player_id, mode, elo, matches_played, last_match_at, updated_at)
  VALUES (p_player_id, p_mode, p_new_elo, 1, p_match_played_at, NOW())
  ON CONFLICT (player_id, mode) DO UPDATE
    SET elo            = p_new_elo,
        matches_played = player_ratings.matches_played + 1,
        last_match_at  = p_match_played_at,
        updated_at     = NOW();
END;
$$;

-- ── Recommended K-factor reference ───────────────────────────────────────────
-- (Implemented in application layer — src/lib/elo.ts — not in DB)
--
--  matches < 10          → K = 64   (placement phase)
--  matches 10–29         → K = 48   (settling)
--  matches ≥ 30, Elo≥2000→ K = 24   (high-rating stability)
--  matches ≥ 30, default → K = 32
