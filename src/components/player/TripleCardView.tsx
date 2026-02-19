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

  const touchStartX = useRef<number>(0);
  const scrollStartLeft = useRef<number>(0);
  const isDragging = useRef<boolean>(false);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const container = el.firstElementChild as HTMLElement | null;
    if (!container) return;
    const children = Array.from(container.children) as HTMLElement[];
    const scrollLeft = el.scrollLeft;

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

  const getSnapPoints = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return [];
    const container = el.firstElementChild as HTMLElement | null;
    if (!container) return [];
    const children = Array.from(container.children) as HTMLElement[];
    const points: number[] = [];
    let cumulative = 0;
    for (const child of children) {
      points.push(cumulative);
      cumulative += child.offsetWidth;
    }
    return points;
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
      scrollStartLeft.current = el.scrollLeft;
      isDragging.current = true;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging.current) return;
      e.preventDefault();
      const delta = touchStartX.current - e.touches[0].clientX;
      el.scrollLeft = scrollStartLeft.current + delta;
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (!isDragging.current) return;
      isDragging.current = false;

      const delta = touchStartX.current - e.changedTouches[0].clientX;
      const threshold = 40;
      const snapPoints = getSnapPoints();
      if (!snapPoints.length) return;

      let currentIndex = 0;
      for (let i = 0; i < snapPoints.length; i++) {
        if (scrollStartLeft.current >= snapPoints[i] - 1) currentIndex = i;
      }

      let targetIndex = currentIndex;
      if (delta > threshold) {
        targetIndex = Math.min(currentIndex + 1, snapPoints.length - 1);
      } else if (delta < -threshold) {
        targetIndex = Math.max(currentIndex - 1, 0);
      }

      el.scrollTo({ left: snapPoints[targetIndex], behavior: 'smooth' });
    };

    el.addEventListener('scroll', handleScroll, { passive: true });
    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchmove', onTouchMove, { passive: false });
    el.addEventListener('touchend', onTouchEnd, { passive: true });

    return () => {
      el.removeEventListener('scroll', handleScroll);
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', onTouchEnd);
    };
  }, [handleScroll, getSnapPoints]);

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
            {/* Swipe hint — top */}
            <div
              className="flex items-center justify-end gap-1.5 pb-1 pr-1"
              style={{
                fontSize: '0.55rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.25)',
              }}
            >
              <span>Swipe for details</span>
              <span style={{ color: '#c2ff0b', fontSize: '0.7rem' }}>&rarr;</span>
            </div>

            {primary && <MobilePlayerCard player={primary} isCenter />}
            {teammate1 && <MobilePlayerCard player={teammate1} />}
            {teammate2 && <MobilePlayerCard player={teammate2} />}
          </div>

          {/* Full detail cards in carousel */}
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
