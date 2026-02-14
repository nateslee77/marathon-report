export type BadgeCategory = 'runner' | 'premium' | 'free';

export interface Badge {
  id: string;
  name: string;
  icon: string;
  color: string;
  category: BadgeCategory;
  description: string;
  animation?: 'glow' | 'shimmer' | 'ice' | 'fire';
}

export const AVAILABLE_BADGES: Badge[] = [
  // Runner badges
  { id: 'pathfinder', name: 'Pathfinder', icon: '~', color: '#00ccff', category: 'runner', description: 'Awarded for completing 100 extractions' },
  { id: 'trailblazer', name: 'Trailblazer', icon: '^', color: '#00cc00', category: 'runner', description: 'Extract 50 times as any runner' },
  { id: 'marathon-veteran', name: 'Marathon Veteran', icon: '*', color: '#8800ff', category: 'runner', description: 'Play 500+ matches across all runners' },
  { id: 'speed-demon', name: 'Speed Demon', icon: '>', color: '#ff6600', category: 'runner', description: 'Achieve fastest extraction time in a match 25 times' },
  { id: 'team-player', name: 'Team Player', icon: '+', color: '#ffcc00', category: 'runner', description: '1000+ assists across all matches' },
  // Premium badges
  { id: 'runner-pass', name: 'Runner Pass', icon: 'R', color: '#c2ff0b', category: 'premium', description: 'Exclusive Runner Pass holder badge', animation: 'glow' },
  { id: 'pinnacle-elite', name: 'Pinnacle Elite', icon: 'P', color: '#ffcc00', category: 'premium', description: 'Pinnacle tier supporter badge', animation: 'shimmer' },
  { id: 'neon-edge', name: 'Neon Edge', icon: 'N', color: '#ff0088', category: 'premium', description: 'Animated neon-glow badge for premium members', animation: 'glow' },
  { id: 'frostbite', name: 'Frostbite', icon: '❄', color: '#00ccff', category: 'premium', description: 'Animated ice-crystal badge with frozen aura', animation: 'ice' },
  { id: 'inferno', name: 'Inferno', icon: '🔥', color: '#ff0000', category: 'premium', description: 'Animated blazing fire badge with ember glow', animation: 'fire' },
  { id: 'holographic', name: 'Holographic', icon: 'H', color: '#8800ff', category: 'premium', description: 'Animated holographic shimmer badge', animation: 'shimmer' },
  { id: 'vanguard', name: 'Vanguard', icon: 'V', color: '#0066ff', category: 'premium', description: 'Animated vanguard emblem badge', animation: 'glow' },
  // Free badges
  { id: 'recruit', name: 'Recruit', icon: 'I', color: '#888', category: 'free', description: 'Create your Marathon Report account' },
  { id: 'first-blood', name: 'First Blood', icon: '!', color: '#ff0000', category: 'free', description: 'Get your first kill in a match' },
  { id: 'donator', name: 'Donator', icon: '★', color: '#ffcc00', category: 'free', description: 'Support the page via Buy Me a Coffee' },
];

export function getBadgeById(id: string): Badge | undefined {
  return AVAILABLE_BADGES.find((b) => b.id === id);
}

// Default equipped badges for Sushi
export const SUSHI_DEFAULT_BADGES = ['frostbite', 'inferno', 'pinnacle-elite', 'neon-edge', 'holographic'];
