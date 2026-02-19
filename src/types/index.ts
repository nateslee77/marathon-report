export type Platform = 'PC' | 'PlayStation' | 'Xbox';
export type MatchResult = 'EXTRACTED' | 'ELIMINATED';
export type GameMode = 'Extraction' | 'Team Deathmatch' | 'Control';
export type StatsFilter = 'overall' | 'last10' | 'last50' | 'thisWeek' | 'thisSeason';
export type RankTier = 'Unranked' | 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond' | 'Pinnacle';
export type MembershipTier = 'free' | 'runner-pass' | 'pinnacle';

// ── Runner system ──

export type RunnerType = 'destroyer' | 'vandal' | 'recon' | 'assassin' | 'triage' | 'thief' | 'rook';

export type FactionType = 'cyberacme' | 'sekiguchi' | 'traxus' | 'arachne' | 'nucaloric' | 'mida';

export interface RunnerVisual {
  name: string;
  role: string;
  accent: string;
  bgGradient: string;
  emblemGradient: string;
  image: string;
}

// ── Emblem system ──

export interface EmblemInfo {
  id: string;
  name: string;
  rarity: 'common' | 'rare' | 'legendary' | 'exotic';
}

// ── Loadout ──

export interface LoadoutItem {
  slot: 'primary' | 'sidearm' | 'weapon3' | 'equipment' | 'core';
  name: string;
  icon: string;
  image?: string;
}

// ── Stats ──

export interface PlayerStats {
  matchesPlayed: number;
  winRate: number;
  kd: number;
  kda: number;
  averageKills: number;
  averageDeaths: number;
  extractionRate: number;
  bestStreak: number;
  currentStreak: number;
  timePlayed: string;
}

// ── Mini match (for card summary) ──

export interface MiniMatch {
  result: MatchResult;
  map: string;
  kills: number;
  deaths: number;
  assists: number;
  runner?: RunnerType;
}

// ── Detailed player (for triple-card view) ──

export interface DetailedPlayer {
  id: string;
  name: string;
  tag: string;
  platform: Platform;
  runner: RunnerType;
  emblem: EmblemInfo;
  rating: number;
  rank: number;
  level: number;
  competitiveRank: RankTier;
  membership: MembershipTier;
  avatar: string;
  lastUpdated: Date;
  themeColor?: string;
  loadout: LoadoutItem[];
  recentMatchSummary: MiniMatch[];
  careerHighlights: { label: string; value: string }[];
  stats: {
    overall: PlayerStats;
    last10: PlayerStats;
    last50: PlayerStats;
    thisWeek: PlayerStats;
    thisSeason: PlayerStats;
  };
}

// ── Legacy types (kept for compatibility) ──

export interface Player {
  id: string;
  name: string;
  tag?: string;
  platform: Platform;
  rank: number;
  level: number;
  lastUpdated: Date;
  stats: {
    overall: PlayerStats;
    last10: PlayerStats;
    last50: PlayerStats;
    thisWeek: PlayerStats;
    thisSeason: PlayerStats;
  };
}

export interface MatchPlayer {
  playerId: string;
  playerName: string;
  kills: number;
  deaths: number;
  assists: number;
  damage: number;
  objectiveScore: number;
  isTopPerformer?: boolean;
}

export interface Match {
  id: string;
  date: Date;
  map: string;
  mode: GameMode;
  result: MatchResult;
  duration: string;
  runner?: RunnerType;
  team1: MatchPlayer[];
  team2: MatchPlayer[];
  personalStats?: {
    kills: number;
    deaths: number;
    assists: number;
    damage: number;
  };
  squadMembers?: string[];
}

export interface RecentlyPlayedWithPlayer {
  playerId: string;
  playerName: string;
  matchesTogether: number;
  winRateTogether: number;
  kdaTogether: number;
}

export interface WeaponStats {
  weaponName: string;
  kills: number;
  killPercentage: number;
  headshotRate?: number;
}

export interface SearchPlayer {
  id: string;
  name: string;
  tag: string;
  platform: Platform;
  rank: number;
  kd: number;
  winRate: number;
  competitiveRank: RankTier;
}

export interface TeammateInfo {
  id: string;
  name: string;
  tag: string;
  platform: Platform;
  rank: number;
  level: number;
  kd: number;
  winRate: number;
  matchesPlayed: number;
  avgKills: number;
  currentStreak: number;
  lastActive: string;
}
