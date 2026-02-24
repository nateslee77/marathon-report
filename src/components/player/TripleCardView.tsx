'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { DetailedPlayer } from '@/types';
import { PlayerCard } from './PlayerCard';
import { MobilePlayerCard } from './MobilePlayerCard';

// Minimum horizontal travel (px) required to commit to the next pane
const SWIPE_THRESHOLD = 72;

interface TripleCardViewProps {
  players: DetailedPlayer[];
}

export function TripleCardView({ players }: TripleCardViewProps) {
  const [primary, teammate1, teammate2] = players;
  const allPlayers = [primary, teammate1, teammate2].filter(Boolean);
  const totalPanes = allPlayers.length + 1; // +1 for the stacked overview pane

  const [activeIndex, setActiveIndex] = useState(0);
  // Live drag offset in px — tracks finger position during a swipe
  const [dragOffset, setDragOffset]   = useState(0);

  const containerRef  = useRef<HTMLDivElement>(null);
  const touchStartX   = useRef(0);
  const touchStartY   = useRef(0);
  const isHorizontal  = useRef(false); // true once we've committed to a horizontal gesture

  // Navigate to a specific pane; resets any live drag offset
  const goTo = useCallback((index: number) => {
    const clamped = Math.max(0, Math.min(index, totalPanes - 1));
    setActiveIndex(clamped);
    setDragOffset(0);
  }, [totalPanes]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onTouchStart = (e: TouchEvent) => {
      touchStartX.current  = e.touches[0].clientX;
      touchStartY.current  = e.touches[0].clientY;
      isHorizontal.current = false;
    };

    const onTouchMove = (e: TouchEvent) => {
      const dx = e.touches[0].clientX - touchStartX.current;
      const dy = e.touches[0].clientY - touchStartY.current;

      // Decide gesture direction once we have enough movement
      if (!isHorizontal.current) {
        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 6) {
          isHorizontal.current = true;
        } else if (Math.abs(dy) > 8) {
          return; // clearly vertical — let page scroll happen
        } else {
          return; // too early to decide
        }
      }

      // Committed horizontal swipe — block page scroll and track offset
      e.preventDefault();
      setDragOffset(dx);
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (!isHorizontal.current) return;

      const dx = e.changedTouches[0].clientX - touchStartX.current;
      const dy = e.changedTouches[0].clientY - touchStartY.current;

      // If mostly vertical, treat as cancelled
      if (Math.abs(dy) > Math.abs(dx)) {
        setDragOffset(0);
        isHorizontal.current = false;
        return;
      }

      if (Math.abs(dx) >= SWIPE_THRESHOLD) {
        // Always advance by exactly one pane — never skip
        goTo(dx < 0 ? activeIndex + 1 : activeIndex - 1);
      } else {
        setDragOffset(0); // not enough travel — snap back
      }

      isHorizontal.current = false;
    };

    el.addEventListener('touchstart', onTouchStart, { passive: true  });
    el.addEventListener('touchmove',  onTouchMove,  { passive: false });
    el.addEventListener('touchend',   onTouchEnd,   { passive: true  });

    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove',  onTouchMove);
      el.removeEventListener('touchend',   onTouchEnd);
    };
  }, [activeIndex, goTo]);

  // During a drag dragOffset grows; while snapping/animating it's 0
  const isDragging = Math.abs(dragOffset) > 1;

  return (
    <>
      {/* Back to home button */}
      <div style={{ width: '95%', margin: '0 auto', paddingTop: 12, paddingBottom: 8 }}>
        <Link
          href="/"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            fontSize: '0.52rem', fontWeight: 700, letterSpacing: '0.1em',
            color: 'rgba(255,255,255,0.35)', textDecoration: 'none',
            textTransform: 'uppercase', fontFamily: 'var(--font-mono)',
            padding: '5px 10px',
            border: '1px solid rgba(255,255,255,0.08)',
            background: 'rgba(255,255,255,0.02)',
            transition: 'color 0.12s, border-color 0.12s, background 0.12s',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLAnchorElement).style.color = '#c2ff0b';
            (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(194,255,11,0.3)';
            (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(194,255,11,0.05)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.35)';
            (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.08)';
            (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.02)';
          }}
        >
          <svg width="9" height="9" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M5 12l7-7M5 12l7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Home
        </Link>
      </div>

      {/* Desktop: 3-column grid */}
      <div
        className="hidden md:grid animate-fade-in"
        style={{
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: 16,
          minHeight: 'calc(100vh - 48px)',
          width: '95%',
          margin: '0 auto',
        }}
      >
        {primary   && <PlayerCard player={primary}   isCenter />}
        {teammate1 && <PlayerCard player={teammate1} />}
        {teammate2 && <PlayerCard player={teammate2} />}
      </div>

      {/* Mobile: transform-based carousel — no native scroll, no momentum overshoot */}
      <div className="md:hidden animate-fade-in">
        <div ref={containerRef} style={{ overflow: 'hidden', width: '100%' }}>
          <div
            style={{
              display: 'flex',
              // Base offset snaps to pane; dragOffset follows the finger in real-time
              transform: `translateX(calc(-${activeIndex * 100}vw + ${dragOffset}px))`,
              // Smooth transition only when not actively dragging (snap-back / goTo)
              transition: isDragging ? 'none' : 'transform 0.3s ease',
              willChange: 'transform',
            }}
          >
            {/* Pane 0: stacked compact cards (overview) */}
            <div
              style={{
                flexShrink: 0,
                width: '100vw',
                padding: '4px 12px 8px',
                boxSizing: 'border-box',
              }}
            >
              <div style={{
                display: 'flex', alignItems: 'center',
                justifyContent: 'flex-end', gap: 6, marginBottom: 8,
              }}>
                <span style={{
                  fontSize: '0.55rem', letterSpacing: '0.12em',
                  textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)',
                }}>
                  Swipe for details
                </span>
                <span style={{ color: '#c2ff0b', fontSize: '0.7rem' }}>&rarr;</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {primary   && <MobilePlayerCard player={primary}   isCenter />}
                {teammate1 && <MobilePlayerCard player={teammate1} />}
                {teammate2 && <MobilePlayerCard player={teammate2} />}
              </div>
            </div>

            {/* Panes 1–N: full PlayerCard per player */}
            {allPlayers.map((player, i) => (
              <div
                key={player.id}
                style={{
                  flexShrink: 0,
                  width: '100vw',
                  padding: '4px 12px 8px',
                  boxSizing: 'border-box',
                }}
              >
                <PlayerCard player={player} isCenter={i === 0} />
              </div>
            ))}
          </div>
        </div>

        {/* Dot indicators (also tappable) */}
        {allPlayers.length > 0 && (
          <div className="flex justify-center gap-1.5 py-3">
            {[...Array(totalPanes)].map((_, i) => (
              <div
                key={i}
                onClick={() => goTo(i)}
                style={{
                  width:        activeIndex === i ? 16 : 6,
                  height:       6,
                  borderRadius: 3,
                  background:   activeIndex === i ? '#c2ff0b' : 'rgba(255,255,255,0.15)',
                  transition:   'all 0.2s ease',
                  cursor:       'pointer',
                }}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
