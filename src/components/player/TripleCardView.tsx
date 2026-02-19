'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { DetailedPlayer } from '@/types';
import { PlayerCard } from './PlayerCard';
import { MobilePlayerCard } from './MobilePlayerCard';

interface TripleCardViewProps {
  players: DetailedPlayer[];
}

export function TripleCardView({ players }: TripleCardViewProps) {
  const [primary, teammate1, teammate2] = players;
  const allPlayers = [primary, teammate1, teammate2].filter(Boolean);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const container = el.firstElementChild as HTMLElement | null;
    if (!container) return;
    const children = Array.from(container.children) as HTMLElement[];
    const scrollLeft = el.scrollLeft;

    // Find which child is closest to the scroll position
    let cumulative = 0;
    let closest = 0;
    for (let i = 0; i < children.length; i++) {
      const childWidth = children[i].offsetWidth;
      if (scrollLeft >= cumulative + childWidth / 2) {
        closest = i + 1;
      }
      cumulative += childWidth;
    }
    setActiveIndex(Math.min(closest, allPlayers.length));
  }, [allPlayers.length]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <>
      {/* Desktop: 3-column grid */}
      <div
        className="hidden md:grid animate-fade-in"
        style={{
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: 16,
          minHeight: 'calc(100vh - 48px)',
        }}
      >
        {primary && <PlayerCard player={primary} isCenter />}
        {teammate1 && <PlayerCard player={teammate1} />}
        {teammate2 && <PlayerCard player={teammate2} />}
      </div>

      {/* Mobile: stacked cards (left) + swipe carousel peeking (right) */}
      <div
        className="md:hidden animate-fade-in overflow-x-auto hide-scrollbar"
        ref={scrollRef}
        style={{
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        <div className="flex" style={{ minWidth: 'min-content' }}>
          {/* First snap stop: stacked compact cards */}
          <div
            className="flex-shrink-0 px-2 py-3 space-y-3"
            style={{
              width: 'calc(100vw - 40px)',
              scrollSnapAlign: 'start',
            }}
          >
            {primary && <MobilePlayerCard player={primary} isCenter />}
            {teammate1 && <MobilePlayerCard player={teammate1} />}
            {teammate2 && <MobilePlayerCard player={teammate2} />}

            {/* Swipe hint */}
            <div
              className="flex items-center justify-end gap-1.5 pt-1 pr-1"
              style={{
                fontSize: '0.55rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.25)',
              }}
            >
              <span>Swipe</span>
              <span style={{ color: '#c2ff0b', fontSize: '0.7rem' }}>&rarr;</span>
            </div>
          </div>

          {/* Full detail cards in carousel — centered via padding */}
          {allPlayers.map((player, i) => (
            <div
              key={player.id}
              className="flex-shrink-0 py-3"
              style={{
                width: '94vw',
                paddingLeft: 'calc((100vw - 94vw) / 2)',
                paddingRight: 'calc((100vw - 94vw) / 2)',
                scrollSnapAlign: 'center',
              }}
            >
              <PlayerCard player={player} isCenter={i === 0} />
            </div>
          ))}
        </div>

        {/* Dot indicators */}
        {allPlayers.length > 0 && (
          <div className="flex justify-center gap-1.5 pb-3 sticky left-0" style={{ width: '100vw' }}>
            {/* Index 0 = stacked view, 1-3 = individual cards */}
            {[...Array(allPlayers.length + 1)].map((_, i) => (
              <div
                key={i}
                style={{
                  width: activeIndex === i ? 16 : 6,
                  height: 6,
                  borderRadius: 3,
                  background: activeIndex === i ? '#c2ff0b' : 'rgba(255,255,255,0.15)',
                  transition: 'all 0.2s ease',
                }}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
