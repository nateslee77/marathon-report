import { RankTier } from '@/types';

export interface RankVisual {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

export const RANK_VISUALS: Record<RankTier, RankVisual> = {
  Unranked: {
    label: 'Unranked',
    color: '#666666',
    bgColor: 'rgba(102,102,102,0.1)',
    borderColor: 'rgba(102,102,102,0.3)',
  },
  Bronze: {
    label: 'Bronze',
    color: '#cd7f32',
    bgColor: 'rgba(205,127,50,0.1)',
    borderColor: 'rgba(205,127,50,0.3)',
  },
  Silver: {
    label: 'Silver',
    color: '#c0c0c0',
    bgColor: 'rgba(192,192,192,0.1)',
    borderColor: 'rgba(192,192,192,0.3)',
  },
  Gold: {
    label: 'Gold',
    color: '#ffd700',
    bgColor: 'rgba(255,215,0,0.1)',
    borderColor: 'rgba(255,215,0,0.3)',
  },
  Platinum: {
    label: 'Platinum',
    color: '#4ee2ec',
    bgColor: 'rgba(78,226,236,0.1)',
    borderColor: 'rgba(78,226,236,0.3)',
  },
  Diamond: {
    label: 'Diamond',
    color: '#b9f2ff',
    bgColor: 'rgba(185,242,255,0.1)',
    borderColor: 'rgba(185,242,255,0.3)',
  },
  Pinnacle: {
    label: 'Pinnacle',
    color: '#c2ff0b',
    bgColor: 'rgba(194,255,11,0.1)',
    borderColor: 'rgba(194,255,11,0.3)',
  },
};
