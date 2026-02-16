import { DetailedPlayer, Match, RecentlyPlayedWithPlayer, WeaponStats, SearchPlayer } from '@/types';

// ══════════════════════════════════════
// 7 DETAILED PLAYERS (for triple-card)
// ══════════════════════════════════════

export const detailedPlayers: Record<string, DetailedPlayer> = {
  'player-001': {
    id: 'player-001',
    name: 'Sushi',
    tag: '#7742',
    platform: 'PC',
    runner: 'assassin',
    emblem: { id: 'emblem-shadow', name: 'Shadow Protocol', rarity: 'exotic' },
    rating: 5847,
    rank: 1247,
    level: 42,
    competitiveRank: 'Diamond',
    membership: 'pinnacle',
    avatar: '/images/avatars/avatar6.png',
    lastUpdated: new Date(Date.now() - 1000 * 60 * 8),
    loadout: [
      { slot: 'primary', name: 'Overrun AR', icon: 'R', image: '/images/weapons/overrun-ar-180x135.png' },
      { slot: 'sidearm', name: 'CE Tactical Sidearm', icon: 'S', image: '/images/weapons/ce-tactical-sidearm-180x135.png' },
      { slot: 'equipment', name: 'Frag Grenade', icon: 'G' },
      { slot: 'core', name: 'Guerrilla', icon: 'C' },
    ],
    recentMatchSummary: [
      { result: 'EXTRACTED', map: 'Dire Marsh', kills: 18, deaths: 6, assists: 4, runner: 'assassin' },
      { result: 'EXTRACTED', map: 'Perimeter', kills: 15, deaths: 7, assists: 3, runner: 'assassin' },
      { result: 'ELIMINATED', map: 'Dire Marsh', kills: 13, deaths: 11, assists: 5, runner: 'thief' },
    ],
    careerHighlights: [
      { label: 'Highest Kill Game', value: '67 kills' },
      { label: 'Longest Extract Streak', value: '12 matches' },
      { label: 'Fastest Extraction', value: '4:12' },
      { label: 'Most Damage (single)', value: '5,840' },
    ],
    stats: {
      overall: { matchesPlayed: 342, winRate: 68.4, kd: 10.87, kda: 12.34, averageKills: 14.2, averageDeaths: 7.6, extractionRate: 42.1, bestStreak: 12, currentStreak: 3, timePlayed: '127h 43m' },
      last10: { matchesPlayed: 10, winRate: 70.0, kd: 10.87, kda: 12.41, averageKills: 15.1, averageDeaths: 7.9, extractionRate: 40.0, bestStreak: 5, currentStreak: 3, timePlayed: '3h 47m' },
      last50: { matchesPlayed: 50, winRate: 66.0, kd: 10.87, kda: 12.29, averageKills: 14.5, averageDeaths: 7.9, extractionRate: 38.0, bestStreak: 8, currentStreak: 3, timePlayed: '18h 52m' },
      thisWeek: { matchesPlayed: 23, winRate: 73.9, kd: 10.87, kda: 12.52, averageKills: 15.8, averageDeaths: 7.9, extractionRate: 43.5, bestStreak: 7, currentStreak: 3, timePlayed: '8h 34m' },
      thisSeason: { matchesPlayed: 89, winRate: 70.8, kd: 10.87, kda: 12.39, averageKills: 14.9, averageDeaths: 7.7, extractionRate: 44.9, bestStreak: 12, currentStreak: 3, timePlayed: '33h 21m' },
    },
  },
  'player-002': {
    id: 'player-002',
    name: 'NovaBlade',
    tag: '#1234',
    platform: 'PC',
    runner: 'triage',
    emblem: { id: 'emblem-emerald', name: 'Emerald Vanguard', rarity: 'legendary' },
    rating: 1623,
    rank: 892,
    level: 38,
    competitiveRank: 'Platinum',
    membership: 'runner-pass',
    avatar: '/images/avatars/avatar2.png',
    lastUpdated: new Date(Date.now() - 1000 * 60 * 12),
    loadout: [
      { slot: 'primary', name: 'Bully SMG', icon: 'S', image: '/images/weapons/bully-smg-180x135.png' },
      { slot: 'sidearm', name: 'Magnum MC', icon: 'M', image: '/images/weapons/magnum-mc-180x135.png' },
      { slot: 'equipment', name: 'Heat Grenade', icon: 'G' },
      { slot: 'core', name: 'No Good Deed', icon: 'C' },
    ],
    recentMatchSummary: [
      { result: 'EXTRACTED', map: 'Dire Marsh', kills: 12, deaths: 8, assists: 7, runner: 'triage' },
      { result: 'EXTRACTED', map: 'Perimeter', kills: 14, deaths: 6, assists: 5, runner: 'triage' },
      { result: 'ELIMINATED', map: 'Dire Marsh', kills: 9, deaths: 10, assists: 4, runner: 'recon' },
    ],
    careerHighlights: [
      { label: 'Highest Kill Game', value: '27 kills' },
      { label: 'Longest Extract Streak', value: '9 matches' },
      { label: 'Fastest Extraction', value: '5:01' },
      { label: 'Most Assists (single)', value: '18' },
    ],
    stats: {
      overall: { matchesPlayed: 247, winRate: 62.1, kd: 1.65, kda: 2.18, averageKills: 12.4, averageDeaths: 7.5, extractionRate: 38.2, bestStreak: 9, currentStreak: 1, timePlayed: '94h 12m' },
      last10: { matchesPlayed: 10, winRate: 60.0, kd: 1.71, kda: 2.24, averageKills: 12.8, averageDeaths: 7.5, extractionRate: 40.0, bestStreak: 4, currentStreak: 1, timePlayed: '3h 22m' },
      last50: { matchesPlayed: 50, winRate: 64.0, kd: 1.68, kda: 2.21, averageKills: 12.6, averageDeaths: 7.5, extractionRate: 36.0, bestStreak: 6, currentStreak: 1, timePlayed: '17h 05m' },
      thisWeek: { matchesPlayed: 18, winRate: 66.7, kd: 1.74, kda: 2.30, averageKills: 13.1, averageDeaths: 7.5, extractionRate: 38.9, bestStreak: 5, currentStreak: 1, timePlayed: '6h 48m' },
      thisSeason: { matchesPlayed: 72, winRate: 63.9, kd: 1.69, kda: 2.22, averageKills: 12.7, averageDeaths: 7.5, extractionRate: 40.3, bestStreak: 9, currentStreak: 1, timePlayed: '27h 33m' },
    },
  },
  'player-003': {
    id: 'player-003',
    name: 'IronSight',
    tag: '#5678',
    platform: 'Xbox',
    runner: 'rook',
    emblem: { id: 'emblem-iron', name: 'Iron Bulwark', rarity: 'legendary' },
    rating: 1712,
    rank: 1103,
    level: 35,
    competitiveRank: 'Gold',
    membership: 'free',
    avatar: '/images/avatars/avatar3.png',
    lastUpdated: new Date(Date.now() - 1000 * 60 * 27),
    loadout: [
      { slot: 'primary', name: 'WSTR Combat Shotgun', icon: 'S', image: '/images/weapons/wstr-combat-shotgun-180x135.png' },
      { slot: 'sidearm', name: 'Hardline PR', icon: 'P', image: '/images/weapons/hardline-pr-180x135.png' },
      { slot: 'equipment', name: 'Bubble Shield', icon: 'B' },
      { slot: 'core', name: 'Protector V2', icon: 'C' },
    ],
    recentMatchSummary: [
      { result: 'EXTRACTED', map: 'Dire Marsh', kills: 9, deaths: 9, assists: 5, runner: 'rook' },
      { result: 'EXTRACTED', map: 'Perimeter', kills: 10, deaths: 7, assists: 7, runner: 'rook' },
      { result: 'ELIMINATED', map: 'Dire Marsh', kills: 8, deaths: 12, assists: 3, runner: 'destroyer' },
    ],
    careerHighlights: [
      { label: 'Highest Kill Game', value: '24 kills' },
      { label: 'Most Objective Score', value: '2,840' },
      { label: 'Damage Absorbed', value: '12,400' },
      { label: 'Longest Extract Streak', value: '7 matches' },
    ],
    stats: {
      overall: { matchesPlayed: 189, winRate: 65.3, kd: 1.72, kda: 2.28, averageKills: 11.8, averageDeaths: 6.9, extractionRate: 40.7, bestStreak: 7, currentStreak: 0, timePlayed: '78h 19m' },
      last10: { matchesPlayed: 10, winRate: 70.0, kd: 1.80, kda: 2.35, averageKills: 12.2, averageDeaths: 6.8, extractionRate: 50.0, bestStreak: 4, currentStreak: 0, timePlayed: '3h 54m' },
      last50: { matchesPlayed: 50, winRate: 62.0, kd: 1.69, kda: 2.24, averageKills: 11.5, averageDeaths: 6.8, extractionRate: 38.0, bestStreak: 5, currentStreak: 0, timePlayed: '19h 11m' },
      thisWeek: { matchesPlayed: 14, winRate: 71.4, kd: 1.85, kda: 2.40, averageKills: 12.4, averageDeaths: 6.7, extractionRate: 42.9, bestStreak: 5, currentStreak: 0, timePlayed: '5h 22m' },
      thisSeason: { matchesPlayed: 61, winRate: 67.2, kd: 1.76, kda: 2.32, averageKills: 12.0, averageDeaths: 6.8, extractionRate: 42.6, bestStreak: 7, currentStreak: 0, timePlayed: '24h 07m' },
    },
  },
  'player-004': {
    id: 'player-004',
    name: 'ShadowReaper',
    tag: '#9012',
    platform: 'PlayStation',
    runner: 'destroyer',
    emblem: { id: 'emblem-inferno', name: 'Inferno Core', rarity: 'legendary' },
    rating: 1523,
    rank: 2341,
    level: 41,
    competitiveRank: 'Gold',
    membership: 'runner-pass',
    avatar: '/images/avatars/avatar4.png',
    lastUpdated: new Date(Date.now() - 1000 * 60 * 15),
    loadout: [
      { slot: 'primary', name: 'Demolition HMG', icon: 'H', image: '/images/weapons/demolition-hmg-180x135.png' },
      { slot: 'sidearm', name: 'CE Tactical Sidearm', icon: 'S', image: '/images/weapons/ce-tactical-sidearm-180x135.png' },
      { slot: 'equipment', name: 'Claymore Mine', icon: 'M' },
      { slot: 'core', name: 'Bullrush', icon: 'C' },
    ],
    recentMatchSummary: [
      { result: 'EXTRACTED', map: 'Dire Marsh', kills: 11, deaths: 13, assists: 6, runner: 'destroyer' },
      { result: 'ELIMINATED', map: 'Perimeter', kills: 14, deaths: 10, assists: 4, runner: 'destroyer' },
      { result: 'EXTRACTED', map: 'Perimeter', kills: 16, deaths: 8, assists: 5, runner: 'vandal' },
    ],
    careerHighlights: [
      { label: 'Highest Kill Game', value: '28 kills' },
      { label: 'Damage Dealt', value: '8,240' },
      { label: 'Longest Extract Streak', value: '8 matches' },
    ],
    stats: {
      overall: { matchesPlayed: 412, winRate: 54.2, kd: 1.34, kda: 1.89, averageKills: 12.1, averageDeaths: 9.0, extractionRate: 35.2, bestStreak: 8, currentStreak: 1, timePlayed: '156h 22m' },
      last10: { matchesPlayed: 10, winRate: 50.0, kd: 1.41, kda: 1.95, averageKills: 12.8, averageDeaths: 9.1, extractionRate: 30.0, bestStreak: 3, currentStreak: 1, timePlayed: '3h 52m' },
      last50: { matchesPlayed: 50, winRate: 56.0, kd: 1.38, kda: 1.92, averageKills: 12.4, averageDeaths: 9.0, extractionRate: 36.0, bestStreak: 6, currentStreak: 1, timePlayed: '19h 04m' },
      thisWeek: { matchesPlayed: 22, winRate: 54.5, kd: 1.35, kda: 1.90, averageKills: 12.2, averageDeaths: 9.0, extractionRate: 36.4, bestStreak: 4, currentStreak: 1, timePlayed: '8h 18m' },
      thisSeason: { matchesPlayed: 95, winRate: 55.8, kd: 1.37, kda: 1.91, averageKills: 12.5, averageDeaths: 9.1, extractionRate: 37.9, bestStreak: 8, currentStreak: 1, timePlayed: '36h 12m' },
    },
  },
  'player-005': {
    id: 'player-005',
    name: 'VoidWalker',
    tag: '#3456',
    platform: 'PC',
    runner: 'vandal',
    emblem: { id: 'emblem-void', name: 'Void Walker', rarity: 'rare' },
    rating: 1389,
    rank: 3102,
    level: 33,
    competitiveRank: 'Silver',
    membership: 'free',
    avatar: '/images/avatars/avatar5.png',
    lastUpdated: new Date(Date.now() - 1000 * 60 * 42),
    loadout: [
      { slot: 'primary', name: 'V22 Volt Thrower', icon: 'V', image: '/images/weapons/v22-volt-thrower-180x135.png' },
      { slot: 'sidearm', name: 'V11 Punch', icon: 'P', image: '/images/weapons/v11-punch-180x135.png' },
      { slot: 'equipment', name: 'EMP Grenade', icon: 'E' },
      { slot: 'core', name: 'Adrenal Core', icon: 'C' },
    ],
    recentMatchSummary: [
      { result: 'ELIMINATED', map: 'Dire Marsh', kills: 8, deaths: 12, assists: 4, runner: 'vandal' },
      { result: 'EXTRACTED', map: 'Dire Marsh', kills: 10, deaths: 9, assists: 6, runner: 'vandal' },
      { result: 'ELIMINATED', map: 'Perimeter', kills: 9, deaths: 11, assists: 3, runner: 'recon' },
    ],
    careerHighlights: [
      { label: 'Highest Kill Game', value: '22 kills' },
      { label: 'Longest Extract Streak', value: '5 matches' },
    ],
    stats: {
      overall: { matchesPlayed: 289, winRate: 49.8, kd: 1.21, kda: 1.65, averageKills: 10.4, averageDeaths: 8.6, extractionRate: 31.2, bestStreak: 5, currentStreak: 0, timePlayed: '108h 45m' },
      last10: { matchesPlayed: 10, winRate: 40.0, kd: 1.18, kda: 1.62, averageKills: 10.1, averageDeaths: 8.6, extractionRate: 30.0, bestStreak: 2, currentStreak: 0, timePlayed: '3h 38m' },
      last50: { matchesPlayed: 50, winRate: 52.0, kd: 1.24, kda: 1.68, averageKills: 10.6, averageDeaths: 8.5, extractionRate: 32.0, bestStreak: 4, currentStreak: 0, timePlayed: '18h 52m' },
      thisWeek: { matchesPlayed: 19, winRate: 47.4, kd: 1.19, kda: 1.64, averageKills: 10.3, averageDeaths: 8.6, extractionRate: 31.6, bestStreak: 3, currentStreak: 0, timePlayed: '7h 14m' },
      thisSeason: { matchesPlayed: 78, winRate: 50.0, kd: 1.22, kda: 1.66, averageKills: 10.5, averageDeaths: 8.6, extractionRate: 32.1, bestStreak: 5, currentStreak: 0, timePlayed: '29h 38m' },
    },
  },
  'player-006': {
    id: 'player-006',
    name: 'PhantomEdge',
    tag: '#7788',
    platform: 'Xbox',
    runner: 'recon',
    emblem: { id: 'emblem-phantom', name: 'Phantom Scope', rarity: 'legendary' },
    rating: 1687,
    rank: 2045,
    level: 39,
    competitiveRank: 'Platinum',
    membership: 'pinnacle',
    avatar: '/images/avatars/avatar6.png',
    lastUpdated: new Date(Date.now() - 1000 * 60 * 5),
    loadout: [
      { slot: 'primary', name: 'Longshot', icon: 'L', image: '/images/weapons/longshot-180x135.png' },
      { slot: 'sidearm', name: 'Hardline PR', icon: 'P', image: '/images/weapons/hardline-pr-180x135.png' },
      { slot: 'equipment', name: 'Proximity Sensor', icon: 'S' },
      { slot: 'core', name: 'Cluster Payload', icon: 'C' },
    ],
    recentMatchSummary: [
      { result: 'EXTRACTED', map: 'Dire Marsh', kills: 15, deaths: 7, assists: 8, runner: 'recon' },
      { result: 'EXTRACTED', map: 'Perimeter', kills: 12, deaths: 6, assists: 10, runner: 'recon' },
      { result: 'ELIMINATED', map: 'Dire Marsh', kills: 11, deaths: 10, assists: 6, runner: 'assassin' },
    ],
    careerHighlights: [
      { label: 'Highest Kill Game', value: '26 kills' },
      { label: 'Headshot Rate', value: '68%' },
      { label: 'Longest Extract Streak', value: '10 matches' },
    ],
    stats: {
      overall: { matchesPlayed: 312, winRate: 55.6, kd: 1.38, kda: 2.12, averageKills: 11.2, averageDeaths: 8.1, extractionRate: 36.8, bestStreak: 10, currentStreak: 2, timePlayed: '118h 33m' },
      last10: { matchesPlayed: 10, winRate: 60.0, kd: 1.45, kda: 2.18, averageKills: 11.8, averageDeaths: 8.1, extractionRate: 40.0, bestStreak: 4, currentStreak: 2, timePlayed: '3h 48m' },
      last50: { matchesPlayed: 50, winRate: 54.0, kd: 1.40, kda: 2.14, averageKills: 11.4, averageDeaths: 8.1, extractionRate: 36.0, bestStreak: 6, currentStreak: 2, timePlayed: '19h 02m' },
      thisWeek: { matchesPlayed: 21, winRate: 57.1, kd: 1.42, kda: 2.16, averageKills: 11.5, averageDeaths: 8.1, extractionRate: 38.1, bestStreak: 5, currentStreak: 2, timePlayed: '8h 01m' },
      thisSeason: { matchesPlayed: 84, winRate: 56.0, kd: 1.39, kda: 2.13, averageKills: 11.3, averageDeaths: 8.1, extractionRate: 37.5, bestStreak: 10, currentStreak: 2, timePlayed: '31h 54m' },
    },
  },
  'player-007': {
    id: 'player-007',
    name: 'QuantumFist',
    tag: '#2244',
    platform: 'PC',
    runner: 'thief',
    emblem: { id: 'emblem-quantum', name: 'Quantum Rush', rarity: 'exotic' },
    rating: 1756,
    rank: 756,
    level: 44,
    competitiveRank: 'Pinnacle',
    membership: 'pinnacle',
    avatar: '/images/avatars/avatar7.png',
    lastUpdated: new Date(Date.now() - 1000 * 60 * 2),
    loadout: [
      { slot: 'primary', name: 'BRRT Smg', icon: 'B', image: '/images/weapons/brrt-smg-180x135.png' },
      { slot: 'sidearm', name: 'CE Tactical Sidearm', icon: 'S', image: '/images/weapons/ce-tactical-sidearm-180x135.png' },
      { slot: 'equipment', name: 'Smoke Grenade', icon: 'G' },
      { slot: 'core', name: 'Case the Joint', icon: 'C' },
    ],
    recentMatchSummary: [
      { result: 'EXTRACTED', map: 'Dire Marsh', kills: 14, deaths: 6, assists: 5, runner: 'thief' },
      { result: 'EXTRACTED', map: 'Perimeter', kills: 16, deaths: 7, assists: 4, runner: 'thief' },
      { result: 'EXTRACTED', map: 'Perimeter', kills: 13, deaths: 8, assists: 7, runner: 'assassin' },
    ],
    careerHighlights: [
      { label: 'Highest Kill Game', value: '29 kills' },
      { label: 'Fastest Extraction', value: '3:48' },
      { label: 'Longest Extract Streak', value: '11 matches' },
    ],
    stats: {
      overall: { matchesPlayed: 398, winRate: 66.9, kd: 1.78, kda: 2.35, averageKills: 14.1, averageDeaths: 7.9, extractionRate: 44.2, bestStreak: 11, currentStreak: 5, timePlayed: '151h 08m' },
      last10: { matchesPlayed: 10, winRate: 70.0, kd: 1.85, kda: 2.42, averageKills: 14.6, averageDeaths: 7.9, extractionRate: 50.0, bestStreak: 5, currentStreak: 5, timePlayed: '3h 46m' },
      last50: { matchesPlayed: 50, winRate: 66.0, kd: 1.80, kda: 2.37, averageKills: 14.3, averageDeaths: 7.9, extractionRate: 42.0, bestStreak: 8, currentStreak: 5, timePlayed: '19h 02m' },
      thisWeek: { matchesPlayed: 24, winRate: 70.8, kd: 1.82, kda: 2.40, averageKills: 14.5, averageDeaths: 8.0, extractionRate: 45.8, bestStreak: 6, currentStreak: 5, timePlayed: '9h 08m' },
      thisSeason: { matchesPlayed: 92, winRate: 67.4, kd: 1.79, kda: 2.36, averageKills: 14.2, averageDeaths: 7.9, extractionRate: 45.7, bestStreak: 11, currentStreak: 5, timePlayed: '35h 02m' },
    },
  },
};

// Helper to get a player's fireteam
export function getFireteam(playerId: string): DetailedPlayer[] {
  const primary = detailedPlayers[playerId] || detailedPlayers['player-001'];
  const teammates = Object.values(detailedPlayers).filter((p) => p.id !== primary.id);
  return [primary, ...teammates.slice(0, 2)];
}

// ══════════════════════════════════════
// SEARCH PLAYERS
// ══════════════════════════════════════

export const mockSearchPlayers: SearchPlayer[] = [
  { id: 'player-001', name: 'Sushi', tag: '#7742', platform: 'PC', rank: 1247, kd: 10.87, winRate: 68.4, competitiveRank: 'Diamond' },
  { id: 'player-002', name: 'NovaBlade', tag: '#1234', platform: 'PC', rank: 892, kd: 1.65, winRate: 62.1, competitiveRank: 'Platinum' },
  { id: 'player-003', name: 'IronSight', tag: '#5678', platform: 'Xbox', rank: 1103, kd: 1.72, winRate: 65.3, competitiveRank: 'Gold' },
  { id: 'player-004', name: 'ShadowReaper', tag: '#9012', platform: 'PlayStation', rank: 2341, kd: 1.34, winRate: 54.2, competitiveRank: 'Gold' },
  { id: 'player-005', name: 'VoidWalker', tag: '#3456', platform: 'PC', rank: 3102, kd: 1.21, winRate: 49.8, competitiveRank: 'Silver' },
  { id: 'player-007', name: 'QuantumFist', tag: '#2244', platform: 'PC', rank: 756, kd: 1.78, winRate: 66.9, competitiveRank: 'Pinnacle' },
  { id: 'player-008', name: 'CrimsonWolf', tag: '#6677', platform: 'Xbox', rank: 1890, kd: 1.44, winRate: 57.3, competitiveRank: 'Silver' },
  { id: 'player-011', name: 'TitanFury', tag: '#8899', platform: 'PC', rank: 1567, kd: 1.52, winRate: 59.1, competitiveRank: 'Gold' },
  { id: 'player-013', name: 'ApexPredator', tag: '#1100', platform: 'PlayStation', rank: 412, kd: 2.11, winRate: 74.2, competitiveRank: 'Pinnacle' },
  { id: 'player-021', name: 'InfernoX', tag: '#4455', platform: 'PC', rank: 623, kd: 1.91, winRate: 69.7, competitiveRank: 'Diamond' },
  { id: 'player-006', name: 'PhantomEdge', tag: '#7788', platform: 'Xbox', rank: 2045, kd: 1.38, winRate: 55.6, competitiveRank: 'Platinum' },
  { id: 'player-012', name: 'LunarStrike', tag: '#3344', platform: 'PC', rank: 1789, kd: 1.47, winRate: 58.0, competitiveRank: 'Gold' },
];

// ══════════════════════════════════════
// MATCH HISTORY (for detail page)
// ══════════════════════════════════════

export const mockMatches: Match[] = [
  {
    id: 'match-001', date: new Date(Date.now() - 1000 * 60 * 45), map: 'Dire Marsh', mode: 'Extraction', result: 'EXTRACTED', duration: '12:34', runner: 'assassin',
    team1: [
      { playerId: 'player-001', playerName: 'Sushi', kills: 18, deaths: 6, assists: 4, damage: 3240, objectiveScore: 1200, isTopPerformer: true },
      { playerId: 'player-002', playerName: 'NovaBlade', kills: 12, deaths: 8, assists: 7, damage: 2180, objectiveScore: 890 },
      { playerId: 'player-003', playerName: 'IronSight', kills: 9, deaths: 9, assists: 5, damage: 1940, objectiveScore: 760 },
    ],
    team2: [
      { playerId: 'player-004', playerName: 'ShadowReaper', kills: 11, deaths: 13, assists: 6, damage: 2450, objectiveScore: 680 },
      { playerId: 'player-005', playerName: 'VoidWalker', kills: 8, deaths: 12, assists: 4, damage: 1820, objectiveScore: 540 },
      { playerId: 'player-006', playerName: 'PhantomEdge', kills: 10, deaths: 13, assists: 3, damage: 2100, objectiveScore: 620 },
    ],
    personalStats: { kills: 18, deaths: 6, assists: 4, damage: 3240 }, squadMembers: ['NovaBlade', 'IronSight'],
  },
  {
    id: 'match-002', date: new Date(Date.now() - 1000 * 60 * 90), map: 'Perimeter', mode: 'Extraction', result: 'EXTRACTED', duration: '9:18', runner: 'assassin',
    team1: [
      { playerId: 'player-001', playerName: 'Sushi', kills: 15, deaths: 7, assists: 3, damage: 2890, objectiveScore: 0 },
      { playerId: 'player-002', playerName: 'NovaBlade', kills: 14, deaths: 6, assists: 5, damage: 2640, objectiveScore: 0, isTopPerformer: true },
      { playerId: 'player-007', playerName: 'QuantumFist', kills: 11, deaths: 8, assists: 4, damage: 2230, objectiveScore: 0 },
    ],
    team2: [
      { playerId: 'player-008', playerName: 'CrimsonWolf', kills: 10, deaths: 13, assists: 5, damage: 2180, objectiveScore: 0 },
      { playerId: 'player-009', playerName: 'SteelViper', kills: 9, deaths: 14, assists: 6, damage: 1990, objectiveScore: 0 },
      { playerId: 'player-010', playerName: 'EclipseGhost', kills: 7, deaths: 13, assists: 3, damage: 1540, objectiveScore: 0 },
    ],
    personalStats: { kills: 15, deaths: 7, assists: 3, damage: 2890 }, squadMembers: ['NovaBlade', 'QuantumFist'],
  },
  {
    id: 'match-003', date: new Date(Date.now() - 1000 * 60 * 150), map: 'Dire Marsh', mode: 'Extraction', result: 'ELIMINATED', duration: '14:52', runner: 'thief',
    team1: [
      { playerId: 'player-001', playerName: 'Sushi', kills: 13, deaths: 11, assists: 5, damage: 2760, objectiveScore: 980 },
      { playerId: 'player-011', playerName: 'TitanFury', kills: 9, deaths: 10, assists: 4, damage: 1880, objectiveScore: 720 },
      { playerId: 'player-012', playerName: 'LunarStrike', kills: 8, deaths: 12, assists: 3, damage: 1620, objectiveScore: 650 },
    ],
    team2: [
      { playerId: 'player-013', playerName: 'ApexPredator', kills: 16, deaths: 9, assists: 7, damage: 3120, objectiveScore: 1340, isTopPerformer: true },
      { playerId: 'player-014', playerName: 'NeonReaper', kills: 12, deaths: 10, assists: 8, damage: 2540, objectiveScore: 1100 },
      { playerId: 'player-015', playerName: 'VortexKnight', kills: 11, deaths: 11, assists: 6, damage: 2340, objectiveScore: 980 },
    ],
    personalStats: { kills: 13, deaths: 11, assists: 5, damage: 2760 }, squadMembers: ['TitanFury', 'LunarStrike'],
  },
  {
    id: 'match-004', date: new Date(Date.now() - 1000 * 60 * 240), map: 'Perimeter', mode: 'Extraction', result: 'EXTRACTED', duration: '11:23', runner: 'assassin',
    team1: [
      { playerId: 'player-001', playerName: 'Sushi', kills: 17, deaths: 8, assists: 6, damage: 3080, objectiveScore: 1580, isTopPerformer: true },
      { playerId: 'player-002', playerName: 'NovaBlade', kills: 13, deaths: 9, assists: 9, damage: 2470, objectiveScore: 1420 },
      { playerId: 'player-003', playerName: 'IronSight', kills: 10, deaths: 7, assists: 7, damage: 2140, objectiveScore: 1290 },
    ],
    team2: [
      { playerId: 'player-016', playerName: 'StormBreaker', kills: 12, deaths: 13, assists: 5, damage: 2380, objectiveScore: 1120 },
      { playerId: 'player-017', playerName: 'BlazeFury', kills: 9, deaths: 14, assists: 4, damage: 1890, objectiveScore: 890 },
      { playerId: 'player-018', playerName: 'FrostBite', kills: 8, deaths: 13, assists: 6, damage: 1740, objectiveScore: 980 },
    ],
    personalStats: { kills: 17, deaths: 8, assists: 6, damage: 3080 }, squadMembers: ['NovaBlade', 'IronSight'],
  },
  {
    id: 'match-005', date: new Date(Date.now() - 1000 * 60 * 320), map: 'Dire Marsh', mode: 'Extraction', result: 'ELIMINATED', duration: '8:47', runner: 'vandal',
    team1: [
      { playerId: 'player-001', playerName: 'Sushi', kills: 11, deaths: 9, assists: 2, damage: 2240, objectiveScore: 0 },
      { playerId: 'player-019', playerName: 'CyberHawk', kills: 8, deaths: 11, assists: 3, damage: 1780, objectiveScore: 0 },
      { playerId: 'player-020', playerName: 'RiftGuardian', kills: 7, deaths: 10, assists: 4, damage: 1560, objectiveScore: 0 },
    ],
    team2: [
      { playerId: 'player-021', playerName: 'InfernoX', kills: 14, deaths: 8, assists: 4, damage: 2890, objectiveScore: 0, isTopPerformer: true },
      { playerId: 'player-022', playerName: 'ThunderStrike', kills: 12, deaths: 9, assists: 5, damage: 2540, objectiveScore: 0 },
      { playerId: 'player-023', playerName: 'SilentBlade', kills: 9, deaths: 9, assists: 6, damage: 2120, objectiveScore: 0 },
    ],
    personalStats: { kills: 11, deaths: 9, assists: 2, damage: 2240 }, squadMembers: ['CyberHawk', 'RiftGuardian'],
  },
];

export const mockRecentlyPlayedWith: RecentlyPlayedWithPlayer[] = [
  { playerId: 'player-002', playerName: 'NovaBlade', matchesTogether: 87, winRateTogether: 71.3, kdaTogether: 2.42 },
  { playerId: 'player-003', playerName: 'IronSight', matchesTogether: 62, winRateTogether: 67.7, kdaTogether: 2.28 },
  { playerId: 'player-007', playerName: 'QuantumFist', matchesTogether: 34, winRateTogether: 73.5, kdaTogether: 2.51 },
  { playerId: 'player-011', playerName: 'TitanFury', matchesTogether: 28, winRateTogether: 64.3, kdaTogether: 2.19 },
  { playerId: 'player-012', playerName: 'LunarStrike', matchesTogether: 23, winRateTogether: 60.9, kdaTogether: 2.06 },
  { playerId: 'player-019', playerName: 'CyberHawk', matchesTogether: 19, winRateTogether: 68.4, kdaTogether: 2.33 },
];

export const mockWeaponStats: WeaponStats[] = [
  { weaponName: 'Overrun AR', kills: 1247, killPercentage: 28.4, headshotRate: 42.3 },
  { weaponName: 'WSTR Combat Shotgun', kills: 892, killPercentage: 20.3, headshotRate: 12.1 },
  { weaponName: 'Bully SMG', kills: 734, killPercentage: 16.7, headshotRate: 38.9 },
  { weaponName: 'Longshot', kills: 521, killPercentage: 11.9, headshotRate: 67.2 },
  { weaponName: 'CE Tactical Sidearm', kills: 412, killPercentage: 9.4, headshotRate: 31.4 },
  { weaponName: 'Frag Grenade', kills: 298, killPercentage: 6.8 },
  { weaponName: 'Melee', kills: 273, killPercentage: 6.2 },
];
