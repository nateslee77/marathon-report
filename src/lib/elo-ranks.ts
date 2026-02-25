// ── Elo rank tier definitions ─────────────────────────────────────────────────
// Separate from `RankTier` (which drives the competitive badge UI).
// These tiers are purely derived from a player's numeric Elo score.

export type EloRankTier =
  | 'Unranked'
  | 'Bronze'
  | 'Silver'
  | 'Gold'
  | 'Platinum'
  | 'Diamond'
  | 'Master'
  | 'Ultra';

export interface EloRank {
  tier:        EloRankTier;
  label:       string;
  minElo:      number;
  maxElo:      number | null; // null = no upper bound (top tier)
  color:       string;
  image:       string | null;
  description: string;
}

export const ELO_RANKS: EloRank[] = [
  {
    tier:        'Unranked',
    label:       'Unranked',
    minElo:      0,
    maxElo:      799,
    color:       '#888888',
    image:       '/images/elo rank images/unranked elo.png',
    description: 'Complete placement matches to receive your rank.',
  },
  {
    tier:        'Bronze',
    label:       'Bronze',
    minElo:      800,
    maxElo:      1099,
    color:       '#cd7f32',
    image:       '/images/elo rank images/bronze elo.png',
    description: 'Solid foundations. Keep pushing.',
  },
  {
    tier:        'Silver',
    label:       'Silver',
    minElo:      1100,
    maxElo:      1399,
    color:       '#c0c0c0',
    image:       '/images/elo rank images/silver elo.png',
    description: 'Above average. Refine your game.',
  },
  {
    tier:        'Gold',
    label:       'Gold',
    minElo:      1400,
    maxElo:      1699,
    color:       '#ffd700',
    image:       '/images/elo rank images/gold elo.png',
    description: 'Consistent performance across all modes.',
  },
  {
    tier:        'Platinum',
    label:       'Platinum',
    minElo:      1700,
    maxElo:      1999,
    color:       '#4ee2ec',
    image:       '/images/elo rank images/platinum elo.png',
    description: 'Elite play. You outperform most runners.',
  },
  {
    tier:        'Diamond',
    label:       'Diamond',
    minElo:      2000,
    maxElo:      2399,
    color:       '#b9f2ff',
    image:       '/images/elo rank images/diamond elo.png',
    description: 'Top-tier. Very few reach this level.',
  },
  {
    tier:        'Master',
    label:       'Master',
    minElo:      2400,
    maxElo:      2799,
    color:       '#22c55e',
    image:       '/images/elo rank images/master elo.png',
    description: 'Among the very best. Exceptional skill.',
  },
  {
    tier:        'Ultra',
    label:       'Ultra',
    minElo:      2800,
    maxElo:      null,
    color:       '#ff3333',
    image:       '/images/elo rank images/ultra elo.png',
    description: 'Top 500 globally. The best of the best.',
  },
];

/** Return the EloRank for a given numeric Elo score. */
export function getEloRank(elo: number): EloRank {
  for (let i = ELO_RANKS.length - 1; i >= 0; i--) {
    if (elo >= ELO_RANKS[i].minElo) return ELO_RANKS[i];
  }
  return ELO_RANKS[0]; // Unranked
}
