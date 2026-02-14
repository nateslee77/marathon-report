import { RankTier } from '@/types';
import { RANK_VISUALS } from '@/lib/ranks';

interface RankBadgeProps {
  rank: RankTier;
  size?: 'sm' | 'md' | 'lg';
}

function RankIcon({ rank, size }: { rank: RankTier; size: number }) {
  const color = RANK_VISUALS[rank].color;

  switch (rank) {
    case 'Unranked':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="8" stroke={color} strokeWidth="1.5" strokeDasharray="3 3" />
          <line x1="9" y1="12" x2="15" y2="12" stroke={color} strokeWidth="1.5" />
        </svg>
      );
    case 'Bronze':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <polygon points="12,4 16,10 20,10 17,14 18,20 12,17 6,20 7,14 4,10 8,10" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="1.2" />
        </svg>
      );
    case 'Silver':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <polygon points="12,3 15,9 21,9 16.5,13.5 18,20 12,16.5 6,20 7.5,13.5 3,9 9,9" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="1.2" />
        </svg>
      );
    case 'Gold':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <polygon points="12,2 15,8 22,9 17,14 18,21 12,17.5 6,21 7,14 2,9 9,8" fill={color} fillOpacity="0.25" stroke={color} strokeWidth="1.2" />
          <circle cx="12" cy="11" r="2" fill={color} fillOpacity="0.4" />
        </svg>
      );
    case 'Platinum':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <path d="M12 2L16 8L22 9L18 14L19 21L12 17L5 21L6 14L2 9L8 8Z" fill={color} fillOpacity="0.15" stroke={color} strokeWidth="1.2" />
          <path d="M12 6L14 10L18 10.5L15 13.5L16 17.5L12 15L8 17.5L9 13.5L6 10.5L10 10Z" fill={color} fillOpacity="0.3" />
        </svg>
      );
    case 'Diamond':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <polygon points="12,2 20,9 12,22 4,9" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="1.2" />
          <polygon points="12,6 16,9 12,18 8,9" fill={color} fillOpacity="0.2" />
          <line x1="4" y1="9" x2="20" y2="9" stroke={color} strokeWidth="1" strokeOpacity="0.5" />
        </svg>
      );
    case 'Pinnacle':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <polygon points="12,1 15,7 22,8 17,13 18,20 12,16.5 6,20 7,13 2,8 9,7" fill={color} fillOpacity="0.25" stroke={color} strokeWidth="1.2" />
          <polygon points="12,5 14,9 18,9.5 15.5,12.5 16,16.5 12,14 8,16.5 8.5,12.5 6,9.5 10,9" fill={color} fillOpacity="0.35" />
          <circle cx="12" cy="10.5" r="1.5" fill={color} fillOpacity="0.6" />
        </svg>
      );
  }
}

const sizeMap = { sm: 14, md: 18, lg: 24 };

export function RankBadge({ rank, size = 'md' }: RankBadgeProps) {
  const visual = RANK_VISUALS[rank];
  const iconSize = sizeMap[size];
  const fontSize = size === 'sm' ? '0.55rem' : size === 'md' ? '0.625rem' : '0.75rem';
  const padding = size === 'sm' ? '1px 6px' : size === 'md' ? '2px 8px' : '3px 10px';

  return (
    <div
      className="inline-flex items-center gap-1"
      style={{
        color: visual.color,
        background: visual.bgColor,
        border: `1px solid ${visual.borderColor}`,
        padding,
        fontSize,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        fontWeight: 600,
      }}
    >
      <RankIcon rank={rank} size={iconSize} />
      {visual.label}
    </div>
  );
}
