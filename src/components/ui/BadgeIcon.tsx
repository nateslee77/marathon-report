'use client';

import { useState, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Badge } from '@/lib/badges';

interface BadgeIconProps {
  badge:         Badge;
  size?:         'sm' | 'md' | 'lg';
  variant?:      'icon' | 'tag';
  showNumber?:   number;
  tooltipAlign?: 'left' | 'right'; // kept for API compat; portal auto-positions
}

const SIZES = {
  sm: { box: 20, font: '0.55rem', iconImg: 16, numSize: 10, numFont: '0.4rem', tagFont: '0.5rem', tagIcon: 11, tagPad: '1px 5px' },
  md: { box: 28, font: '0.75rem', iconImg: 22, numSize: 13, numFont: '0.5rem', tagFont: '0.55rem', tagIcon: 14, tagPad: '2px 7px' },
  lg: { box: 36, font: '1rem',    iconImg: 28, numSize: 16, numFont: '0.55rem', tagFont: '0.6rem', tagIcon: 17, tagPad: '2px 8px' },
};

/** Portal tooltip — renders to document.body so it's never clipped by overflow:hidden. */
function Tooltip({ badge, children }: { badge: Badge; children: React.ReactNode }) {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const wrapRef       = useRef<HTMLDivElement>(null);

  const handleMouseEnter = useCallback(() => {
    const el = wrapRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    // Position below the badge by default; if too close to bottom, flip above
    const spaceBelow = window.innerHeight - rect.bottom;
    const y = spaceBelow > 80 ? rect.bottom : rect.top;
    setPos({ x: rect.left + rect.width / 2, y, above: spaceBelow <= 80 } as typeof pos & { above: boolean });
  }, []);

  const handleMouseLeave = useCallback(() => setPos(null), []);

  const p = pos as (typeof pos & { above?: boolean }) | null;

  return (
    <>
      <div
        ref={wrapRef}
        style={{ display: 'inline-flex' }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </div>

      {p && createPortal(
        <div
          style={{
            position:      'fixed',
            ...(p.above
              ? { bottom: `calc(100vh - ${p.y}px + 8px)` }
              : { top: p.y + 8 }),
            left:          p.x,
            transform:     'translateX(-50%)',
            minWidth:      160,
            maxWidth:      220,
            background:    'rgba(10,10,10,0.97)',
            border:        `1px solid ${badge.color}55`,
            padding:       '8px 10px',
            boxShadow:     '0 8px 24px rgba(0,0,0,0.6)',
            zIndex:        9999,
            pointerEvents: 'none',
          }}
        >
          <div style={{ fontWeight: 700, fontSize: '0.68rem', marginBottom: 3, color: badge.color }}>{badge.name}</div>
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.6rem', lineHeight: 1.4 }}>{badge.description}</div>
          {badge.category === 'pinnacle' && (
            <div style={{ marginTop: 5, fontSize: '0.52rem', letterSpacing: '0.06em', textTransform: 'uppercase', color: '#ffcc00' }}>
              Pinnacle Member
            </div>
          )}
        </div>,
        document.body
      )}
    </>
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
            background: badge.badgeBg ?? 'rgba(0,0,0,0.85)',
            border: `1px solid ${badge.color}88`,
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
              style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}
            />
          )}
          {badge.logoSrc ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={badge.logoSrc} alt={badge.name} style={{ width: s.tagIcon, height: s.tagIcon, objectFit: 'contain', display: 'block', flexShrink: 0 }} />
          ) : (
            <span style={{ fontSize: s.tagIcon, lineHeight: 1 }}>{badge.icon}</span>
          )}
          {badge.name}
          {showNumber !== undefined && (
            <span style={{
              width: s.numSize, height: s.numSize,
              background: badge.color, color: '#000',
              fontSize: s.numFont, fontWeight: 800,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              borderRadius: '50%', lineHeight: 1, marginLeft: 1,
            }}>
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
          width: s.box, height: s.box,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          fontSize: s.font, fontWeight: 700, fontFamily: 'monospace',
          color: badge.color,
          border: `1.5px solid ${badge.color}88`,
          background: badge.badgeBg ?? 'rgba(0,0,0,0.85)',
          position: 'relative', flexShrink: 0,
        }}
      >
        {(anim === 'shimmer' || anim === 'ice') && (
          <div className="badge-shimmer" style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }} />
        )}
        {badge.logoSrc ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={badge.logoSrc} alt={badge.name} style={{ width: s.iconImg, height: s.iconImg, objectFit: 'contain', display: 'block' }} />
        ) : badge.icon}
        {showNumber !== undefined && (
          <div style={{
            position: 'absolute', top: -4, right: -4,
            width: s.numSize, height: s.numSize,
            background: badge.color, color: '#000',
            fontSize: s.numFont, fontWeight: 800,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            borderRadius: '50%', lineHeight: 1,
          }}>
            {showNumber}
          </div>
        )}
      </div>
    </Tooltip>
  );
}
