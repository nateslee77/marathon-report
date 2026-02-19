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
    if (!el || el.clientWidth === 0) return;
    const index = Math.round(el.scrollLeft / el.clientWidth);
    setActiveIndex(Math.min(index, allPlayers.length));
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

      {/* Mobile: CSS scroll-snap carousel */}
      <div className="md:hidden animate-fade-in">
        <div
          ref={scrollRef}
          className="hide-scrollbar"
          style={{
            display: 'flex',
            overflowX: 'scroll',
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {/* First pane: stacked compact cards */}
          <div
            style={{
              flexShrink: 0,
              width: '100vw',
              scrollSnapAlign: 'start',
              padding: '4px 12px 8px',
              boxSizing: 'border-box',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: 6,
                marginBottom: 8,
              }}
            >
              <span style={{ fontSize: '0.55rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)' }}>
                Swipe for details
              </span>
              <span style={{ color: '#c2ff0b', fontSize: '0.7rem' }}>&rarr;</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {primary && <MobilePlayerCard player={primary} isCenter />}
              {teammate1 && <MobilePlayerCard player={teammate1} />}
              {teammate2 && <MobilePlayerCard player={teammate2} />}
            </div>
          </div>

          {/* Individual full player cards */}
          {allPlayers.map((player, i) => (
            <div
              key={player.id}
              style={{
                flexShrink: 0,
                width: '100vw',
                scrollSnapAlign: 'start',
                padding: '4px 12px 8px',
                boxSizing: 'border-box',
                overflowY: 'auto',
              }}
            >
              <PlayerCard player={player} isCenter={i === 0} />
            </div>
          ))}
        </div>

        {/* Dot indicators */}
        {allPlayers.length > 0 && (
          <div className="flex justify-center gap-1.5 py-3">
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
