'use client';

import { Badge } from '@/lib/badges';

interface BadgeIconProps {
  badge: Badge;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'icon' | 'tag';
  showNumber?: number;
}

const SIZES = {
  sm: { box: 20, font: '0.55rem', numSize: 10, numFont: '0.4rem', tagFont: '0.5rem', tagIcon: 7, tagPad: '1px 5px' },
  md: { box: 28, font: '0.75rem', numSize: 13, numFont: '0.5rem', tagFont: '0.55rem', tagIcon: 8, tagPad: '2px 7px' },
  lg: { box: 36, font: '1rem', numSize: 16, numFont: '0.55rem', tagFont: '0.6rem', tagIcon: 10, tagPad: '2px 8px' },
};

function Tooltip({ badge, children }: { badge: Badge; children: React.ReactNode }) {
  return (
    <div className="badge-tooltip-wrap" style={{ position: 'relative', display: 'inline-flex' }}>
      {children}
      <div className="badge-tooltip" style={{ color: badge.color }}>
        <div style={{ fontWeight: 700, fontSize: '0.65rem', marginBottom: 2 }}>{badge.name}</div>
        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.6rem', lineHeight: 1.35, fontWeight: 400 }}>{badge.description}</div>
        {badge.category !== 'free' && (
          <div style={{
            marginTop: 4,
            fontSize: '0.5rem',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: badge.category === 'premium' ? '#c2ff0b' : '#00ccff',
          }}>
            {badge.category === 'premium' ? 'Premium Pass' : 'Runner'}
          </div>
        )}
      </div>
    </div>
  );
}

export function BadgeIcon({ badge, size = 'md', variant = 'icon', showNumber }: BadgeIconProps) {
  const s = SIZES[size];
  const anim = badge.animation;
  const animClass = anim === 'ice' ? 'badge-ice' : anim === 'fire' ? 'badge-fire' : anim ? 'badge-animated' : '';

  if (variant === 'tag') {
    return (
      <Tooltip badge={badge}>
        <span
          className={animClass}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 3,
            fontSize: s.tagFont,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            fontWeight: 600,
            color: badge.color,
            background: `${badge.color}18`,
            border: `1px solid ${badge.color}44`,
            padding: s.tagPad,
            position: 'relative',
            overflow: 'hidden',
            flexShrink: 0,
            whiteSpace: 'nowrap',
          }}
        >
          {(anim === 'shimmer' || anim === 'ice') && (
            <span
              className="badge-shimmer"
              style={{
                position: 'absolute',
                inset: 0,
                overflow: 'hidden',
                pointerEvents: 'none',
              }}
            />
          )}
          <span style={{ fontSize: s.tagIcon, lineHeight: 1 }}>{badge.icon}</span>
          {badge.name}
          {showNumber !== undefined && (
            <span
              style={{
                width: s.numSize,
                height: s.numSize,
                background: badge.color,
                color: '#000',
                fontSize: s.numFont,
                fontWeight: 800,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                lineHeight: 1,
                marginLeft: 1,
              }}
            >
              {showNumber}
            </span>
          )}
        </span>
      </Tooltip>
    );
  }

  return (
    <Tooltip badge={badge}>
      <div
        className={animClass}
        style={{
          width: s.box,
          height: s.box,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: s.font,
          fontWeight: 700,
          fontFamily: 'monospace',
          color: badge.color,
          border: `1.5px solid ${badge.color}55`,
          background: `${badge.color}15`,
          position: 'relative',
          flexShrink: 0,
        }}
      >
        {(anim === 'shimmer' || anim === 'ice') && (
          <div
            className="badge-shimmer"
            style={{
              position: 'absolute',
              inset: 0,
              overflow: 'hidden',
              pointerEvents: 'none',
            }}
          />
        )}
        {badge.icon}
        {showNumber !== undefined && (
          <div
            style={{
              position: 'absolute',
              top: -4,
              right: -4,
              width: s.numSize,
              height: s.numSize,
              background: badge.color,
              color: '#000',
              fontSize: s.numFont,
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              lineHeight: 1,
            }}
          >
            {showNumber}
          </div>
        )}
      </div>
    </Tooltip>
  );
}
