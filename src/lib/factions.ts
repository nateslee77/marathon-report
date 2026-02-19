export type FactionId = 'cyberacme' | 'sekiguchi' | 'traxus' | 'arachne' | 'nucaloric' | 'mida';

export interface Faction {
  id: FactionId;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  logoSrc: string;
  badgeId: string;
  avatarSrc: string;
}

export const FACTIONS: Faction[] = [
  {
    id: 'cyberacme',
    name: 'CYBERACME',
    primaryColor: '#00ff00',
    secondaryColor: '#000000',
    logoSrc: '/images/faction logo/cyberacme.png',
    badgeId: 'faction-cyberacme',
    avatarSrc: '/images/faction logo/cyberacme.png',
  },
  {
    id: 'sekiguchi',
    name: 'SEKIGUCHI',
    primaryColor: '#43e9a0',
    secondaryColor: '#ffffff',
    logoSrc: '/images/faction logo/sekiguchi.png',
    badgeId: 'faction-sekiguchi',
    avatarSrc: '/images/faction logo/sekiguchi.png',
  },
  {
    id: 'traxus',
    name: 'TRAXUS',
    primaryColor: '#ff4b00',
    secondaryColor: '#000000',
    logoSrc: '/images/faction logo/traxus.png',
    badgeId: 'faction-traxus',
    avatarSrc: '/images/faction logo/traxus.png',
  },
  {
    id: 'arachne',
    name: 'ARACHNE',
    primaryColor: '#df0008',
    secondaryColor: '#000000',
    logoSrc: '/images/faction logo/arachne.png',
    badgeId: 'faction-arachne',
    avatarSrc: '/images/faction logo/arachne.png',
  },
  {
    id: 'nucaloric',
    name: 'NUCALORIC',
    primaryColor: '#ff0961',
    secondaryColor: '#ffffff',
    logoSrc: '/images/faction logo/nucaloric.png',
    badgeId: 'faction-nucaloric',
    avatarSrc: '/images/faction logo/nucaloric.png',
  },
  {
    id: 'mida',
    name: 'MIDA',
    primaryColor: '#665ead',
    secondaryColor: '#000000',
    logoSrc: '/images/faction logo/mida.png',
    badgeId: 'faction-mida',
    avatarSrc: '/images/faction logo/mida.png',
  },
];

export function getFactionById(id: FactionId): Faction | undefined {
  return FACTIONS.find((f) => f.id === id);
}
