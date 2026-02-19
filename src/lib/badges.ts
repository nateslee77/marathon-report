export type BadgeCategory = 'pinnacle' | 'free';

export interface Badge {
  id: string;
  name: string;
  icon: string;
  logoSrc?: string;
  badgeBg?: string;
  color: string;
  category: BadgeCategory;
  description: string;
  animation?: 'glow' | 'shimmer' | 'ice' | 'fire';
  pinnacleExclusive?: boolean;
}

export const AVAILABLE_BADGES: Badge[] = [
  // Free badges (earned through gameplay)
  { id: 'pathfinder', name: 'Pathfinder', icon: '~', color: '#00ccff', category: 'free', description: 'Awarded for completing 100 extractions' },
  { id: 'trailblazer', name: 'Trailblazer', icon: '^', color: '#00cc00', category: 'free', description: 'Extract 50 times as any runner' },
  { id: 'marathon-veteran', name: 'Marathon Veteran', icon: '*', color: '#8800ff', category: 'free', description: 'Play 500+ matches across all runners' },
  { id: 'speed-demon', name: 'Speed Demon', icon: '>', color: '#ff6600', category: 'free', description: 'Achieve fastest extraction time in a match 25 times' },
  { id: 'team-player', name: 'Team Player', icon: '+', color: '#ffcc00', category: 'free', description: '1000+ assists across all matches' },
  { id: 'recruit', name: 'Recruit', icon: 'I', color: '#888', category: 'free', description: 'Create your Marathon Intel account' },
  { id: 'first-blood', name: 'First Blood', icon: '!', color: '#ff0000', category: 'free', description: 'Get your first kill in a match' },
  { id: 'donator', name: 'Donator', icon: '★', color: '#ffcc00', category: 'free', description: 'Support the page via Buy Me a Coffee' },
  // Pinnacle badges
  { id: 'runner-pass', name: 'Runner Pass', icon: 'R', color: '#c2ff0b', category: 'pinnacle', description: 'Exclusive Runner Pass holder badge', animation: 'glow', pinnacleExclusive: true },
  { id: 'neon-edge', name: 'Neon Edge', icon: 'N', color: '#ff0088', category: 'pinnacle', description: 'Animated neon-glow badge for Pinnacle members', animation: 'glow', pinnacleExclusive: true },
  { id: 'frostbite', name: 'Frostbite', icon: '❄', color: '#00ccff', category: 'pinnacle', description: 'Animated ice-crystal badge with frozen aura', animation: 'ice', pinnacleExclusive: true },
  { id: 'inferno', name: 'Inferno', icon: '🔥', color: '#ff0000', category: 'pinnacle', description: 'Animated blazing fire badge with ember glow', animation: 'fire', pinnacleExclusive: true },
  { id: 'holographic', name: 'Holographic', icon: 'H', color: '#8800ff', category: 'pinnacle', description: 'Animated holographic shimmer badge', animation: 'shimmer', pinnacleExclusive: true },
  { id: 'vanguard', name: 'Vanguard', icon: 'V', color: '#0066ff', category: 'pinnacle', description: 'Animated vanguard emblem badge', animation: 'glow', pinnacleExclusive: true },
];

// Faction badges — free for all users, use faction logo as icon
export const FACTION_BADGES: Badge[] = [
  { id: 'faction-cyberacme', name: 'CYBERACME', icon: '', logoSrc: '/images/faction logo/cyberacme.png', color: '#00ff00', category: 'free', description: 'Represent the CYBERACME faction' },
  { id: 'faction-sekiguchi', name: 'SEKIGUCHI', icon: '', logoSrc: '/images/faction logo/sekiguchi.png', badgeBg: '#ffffff', color: '#43e9a0', category: 'free', description: 'Represent the SEKIGUCHI faction' },
  { id: 'faction-traxus', name: 'TRAXUS', icon: '', logoSrc: '/images/faction logo/traxus.png', color: '#ff4b00', category: 'free', description: 'Represent the TRAXUS faction' },
  { id: 'faction-arachne', name: 'ARACHNE', icon: '', logoSrc: '/images/faction logo/arachne.png', color: '#df0008', category: 'free', description: 'Represent the ARACHNE faction' },
  { id: 'faction-nucaloric', name: 'NUCALORIC', icon: '', logoSrc: '/images/faction logo/nucaloric.png', badgeBg: '#ffffff', color: '#ff0961', category: 'free', description: 'Represent the NUCALORIC faction' },
  { id: 'faction-mida', name: 'MIDA', icon: '', logoSrc: '/images/faction logo/mida.png', color: '#665ead', category: 'free', description: 'Represent the MIDA faction' },
];

// The Pinnacle badge — auto-displayed for Pinnacle tier members, not equippable
export const PINNACLE_BADGE: Badge = {
  id: 'pinnacle', name: 'Pinnacle', icon: 'P', color: '#ffcc00', category: 'pinnacle',
  description: 'Pinnacle tier member', animation: 'shimmer', pinnacleExclusive: true,
};

export function getBadgeById(id: string): Badge | undefined {
  return [...AVAILABLE_BADGES, ...FACTION_BADGES].find((b) => b.id === id);
}

