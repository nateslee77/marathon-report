import { DetailedPlayer, PlayerStats } from '@/types';

const ZERO_STATS: PlayerStats = {
  matchesPlayed: 0,
  winRate: 0,
  kd: 0,
  kda: 0,
  averageKills: 0,
  averageDeaths: 0,
  extractionRate: 0,
  bestStreak: 0,
  currentStreak: 0,
  timePlayed: '0h 0m',
};

export function buildDefaultPlayer(
  user: { id: string; name: string; tag: string },
  avatar: string,
  social?: { youtubeUrl?: string; twitchUrl?: string },
): DetailedPlayer {
  return {
    id: user.id,
    name: user.name || 'Guardian',
    tag: user.tag || `#${user.id.slice(-4)}`,
    platform: 'PC',
    runner: 'recon',
    emblem: { id: 'emblem-default', name: 'Default', rarity: 'common' },
    rating: 0,
    rank: 0,
    level: 1,
    competitiveRank: 'Unranked',
    membership: 'free',
    avatar,
    youtubeUrl: social?.youtubeUrl || undefined,
    twitchUrl: social?.twitchUrl || undefined,
    lastUpdated: new Date(),
    loadout: [],
    recentMatchSummary: [],
    careerHighlights: [],
    stats: {
      overall: { ...ZERO_STATS },
      last10: { ...ZERO_STATS },
      last50: { ...ZERO_STATS },
      thisWeek: { ...ZERO_STATS },
      thisSeason: { ...ZERO_STATS },
    },
  };
}
