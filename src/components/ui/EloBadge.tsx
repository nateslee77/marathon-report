'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { getEloRank, EloRank } from '@/lib/elo-ranks';

interface EloBadgeProps {
  elo:  number;
  /** Pixel size of the badge image/placeholder. Default 18. */
  size?: number;
}

/** Colored placeholder shown when the rank image hasn't been added yet. */
function PlaceholderBadge({ rank, size }: { rank: EloRank; size: number }) {
  const inner = Math.round(size * 0.42);
  return (
    <div
      style={{
        width:          size,
        height:         size,
        flexShrink:     0,
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        background:     `${rank.color}18`,
        border:         `1px solid ${rank.color}55`,
      }}
    >
      <div
        style={{
          width:     inner,
          height:    inner,
          background: rank.color,
          opacity:   0.75,
          transform: 'rotate(45deg)',
        }}
      />
    </div>
  );
}

/**
 * Small Elo rank badge shown next to a numeric Elo value.
 * Hovering reveals a portal tooltip (not clipped by card overflow).
 */
export function EloBadge({ elo, size = 18 }: EloBadgeProps) {
  const [pos, setPos]       = useState<{ x: number; y: number } | null>(null);
  const wrapRef             = useRef<HTMLDivElement>(null);
  const rank                = getEloRank(elo);

  const show = useCallback(() => {
    const el = wrapRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setPos({ x: rect.left + rect.width / 2, y: rect.top });
  }, []);

  const hide = useCallback(() => setPos(null), []);

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (pos) { hide(); } else { show(); }
  }, [pos, show, hide]);

  // Stop touch events from reaching the parent <Link> and triggering navigation
  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    e.preventDefault();   // prevents the ghost click and link navigation
    e.stopPropagation();
    if (pos) { hide(); } else { show(); }
  }, [pos, show, hide]);

  // Dismiss when user taps anywhere outside the badge
  useEffect(() => {
    if (!pos) return;
    const dismiss = () => setPos(null);
    const timer = setTimeout(() => {
      document.addEventListener('click', dismiss, { once: true });
      document.addEventListener('touchstart', dismiss as EventListener, { once: true });
    }, 50);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('click', dismiss);
      document.removeEventListener('touchstart', dismiss as EventListener);
    };
  }, [pos]);

  return (
    <>
      <div
        ref={wrapRef}
        style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', flexShrink: 0, cursor: 'pointer' }}
        onMouseEnter={show}
        onMouseLeave={hide}
        onClick={handleClick}
        onTouchEnd={handleTouchEnd}
      >
        {rank.image ? (
          <div style={{ width: size, height: size, position: 'relative', flexShrink: 0 }}>
            <Image
              src={rank.image}
              alt={rank.label}
              fill
              unoptimized
              sizes={`${size}px`}
              style={{ objectFit: 'contain' }}
            />
          </div>
        ) : (
          <PlaceholderBadge rank={rank} size={size} />
        )}
      </div>

      {/* Portal tooltip — escapes overflow:hidden parents */}
      {pos && createPortal(
        <div
          style={{
            position:      'fixed',
            bottom:        `calc(100vh - ${pos.y}px + 8px)`,
            left:          pos.x,
            transform:     'translateX(-50%)',
            background:    'rgba(6,6,6,0.97)',
            border:        `1px solid ${rank.color}55`,
            padding:       '6px 10px',
            whiteSpace:    'nowrap',
            zIndex:        9999,
            pointerEvents: 'none',
          }}
        >
          <div style={{
            fontSize:      '0.6rem',
            fontWeight:    700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color:         rank.color,
            fontFamily:    'var(--font-mono)',
          }}>
            Season 1 · {rank.label}
          </div>
          <div style={{
            fontSize:   '0.52rem',
            color:      'rgba(255,255,255,0.4)',
            fontFamily: 'var(--font-mono)',
            marginTop:  2,
          }}>
            {rank.minElo}–{rank.maxElo ?? '∞'} pts · {rank.description}
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
