'use client';

import { useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { DetailedPlayer } from '@/types';
import { RUNNER_VISUALS } from '@/lib/runners';
import { formatKD, formatPercentage } from '@/lib/utils';
import { RankBadge } from '@/components/ui/RankBadge';
import { useApp } from '@/context/AppContext';

interface MobilePlayerCardProps {
  player: DetailedPlayer;
  isCenter?: boolean;
}

export function MobilePlayerCard({ player, isCenter = false }: MobilePlayerCardProps) {
  const { user, cardThemeColor } = useApp();
  const isOwnCard = user?.id === player.id;
  const runner = RUNNER_VISUALS[player.runner];
  const effectiveAccent = isOwnCard && cardThemeColor ? cardThemeColor : runner.accent;
  const stats = player.stats.overall;

  const [expanded, setExpanded] = useState(false);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const isDragging = useRef(false);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    isDragging.current = true;
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!isDragging.current) return;
    isDragging.current = false;

    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = Math.abs(e.changedTouches[0].clientY - touchStartY.current);

    // Only trigger if horizontal swipe is dominant
    if (Math.abs(deltaX) > 50 && deltaY < 80) {
      if (deltaX < -50) {
        setExpanded(true);
      } else if (deltaX > 50) {
        setExpanded(false);
      }
    }
  }, []);

  return (
    <div
      className="relative overflow-hidden"
      style={{
        borderBottom: '1px solid rgba(255,255,255,0.04)',
      }}
    >
      {/* Condensed card */}
      <div
        className="relative flex items-center gap-3 px-4 py-3 transition-transform duration-300 will-change-transform"
        style={{
          transform: expanded ? 'translateX(-100%)' : 'translateX(0)',
          background: isCenter
            ? `linear-gradient(90deg, ${effectiveAccent}08 0%, transparent 100%)`
            : 'transparent',
          borderLeft: isCenter ? `2px solid ${effectiveAccent}44` : '2px solid transparent',
          minHeight: 72,
        }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Emblem */}
        <div
          className="flex-shrink-0 relative overflow-hidden"
          style={{
            width: 56,
            height: 56,
            background: runner.emblemGradient,
          }}
        >
          <Image
            src={player.avatar}
            alt={player.name}
            width={56}
            height={56}
            style={{
              objectFit: 'cover',
              border: `1px solid ${effectiveAccent}33`,
            }}
          />
        </div>

        {/* Name + tag */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-sm text-text-primary truncate">
              {player.name}
            </span>
            <span className="text-xs text-text-tertiary font-mono">
              {player.tag}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span
              className="font-mono text-xs font-semibold uppercase"
              style={{ color: effectiveAccent }}
            >
              {runner.name}
            </span>
            <span className="text-xs text-text-tertiary">{runner.role}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="text-right">
            <div
              className="font-mono text-sm font-bold tabular-nums"
              style={{
                color: stats.kd >= 1.5 ? effectiveAccent : stats.kd >= 1.0 ? '#e5e5e5' : '#ff4444',
              }}
            >
              {formatKD(stats.kd)}
            </div>
            <div className="text-[0.6rem] text-text-tertiary uppercase tracking-wide">K/D</div>
          </div>
          <RankBadge rank={player.competitiveRank} size="sm" />
        </div>

        {/* Swipe hint arrow */}
        <div
          className="flex-shrink-0 transition-opacity duration-200"
          style={{
            color: 'rgba(255,255,255,0.15)',
            opacity: expanded ? 0 : 1,
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </div>
      </div>

      {/* Expanded detail panel */}
      <div
        className="absolute inset-0 transition-transform duration-300 will-change-transform overflow-y-auto"
        style={{
          transform: expanded ? 'translateX(0)' : 'translateX(100%)',
          background: 'linear-gradient(180deg, rgba(16,16,16,0.98) 0%, rgba(10,10,10,0.99) 100%)',
          borderLeft: `2px solid ${effectiveAccent}33`,
        }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Close / back bar */}
        <div
          className="flex items-center gap-2 px-4 py-3"
          style={{ borderBottom: `1px solid ${effectiveAccent}22` }}
        >
          <button
            onClick={() => setExpanded(false)}
            className="flex items-center gap-2 text-xs uppercase tracking-wide"
            style={{
              color: effectiveAccent,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px 0',
              minHeight: 44,
              minWidth: 44,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
            Back
          </button>
          <div className="flex-1" />
          <Link
            href={`/player/${player.id}/details`}
            className="text-xs uppercase tracking-wide font-semibold"
            style={{
              color: effectiveAccent,
              textDecoration: 'none',
              padding: '8px 12px',
              border: `1px solid ${effectiveAccent}33`,
              background: `${effectiveAccent}0a`,
              minHeight: 44,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            Full Report
          </Link>
        </div>

        {/* Player header */}
        <div className="flex items-center gap-3 px-4 py-3">
          <Image
            src={player.avatar}
            alt={player.name}
            width={48}
            height={48}
            style={{
              border: `1px solid ${effectiveAccent}44`,
              objectFit: 'cover',
            }}
          />
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-bold text-lg text-text-primary">{player.name}</span>
              <span className="font-mono text-xs text-text-tertiary">{player.tag}</span>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="font-mono text-xs font-semibold uppercase" style={{ color: effectiveAccent }}>
                {runner.name}
              </span>
              <RankBadge rank={player.competitiveRank} size="sm" />
              <span className="font-mono text-sm font-bold" style={{ color: effectiveAccent }}>
                {player.rating}
              </span>
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div
          className="grid grid-cols-4 gap-0 px-4 py-3"
          style={{ borderTop: '1px solid rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}
        >
          {[
            { label: 'K/D', value: formatKD(stats.kd), color: stats.kd >= 1.5 ? effectiveAccent : stats.kd >= 1.0 ? '#e5e5e5' : '#ff4444' },
            { label: 'EXT%', value: formatPercentage(stats.winRate, 1), color: stats.winRate >= 60 ? effectiveAccent : '#e5e5e5' },
            { label: 'MATCHES', value: String(stats.matchesPlayed), color: '#e5e5e5' },
            { label: 'STREAK', value: String(stats.currentStreak), color: stats.currentStreak >= 3 ? effectiveAccent : '#e5e5e5' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-mono text-base font-bold tabular-nums" style={{ color: stat.color }}>
                {stat.value}
              </div>
              <div className="mt-0.5" style={{ fontSize: '0.55rem', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Recent matches */}
        <div className="px-4 py-3">
          <div className="mb-2" style={{ fontSize: '0.575rem', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase' }}>
            Recent
          </div>
          <div className="space-y-1">
            {player.recentMatchSummary.slice(0, 3).map((match, i) => (
              <div
                key={i}
                className="flex items-center justify-between font-mono text-xs"
                style={{
                  padding: '4px 8px',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.03)',
                }}
              >
                <div className="flex items-center gap-2">
                  <span style={{ color: match.result === 'EXTRACTED' ? '#c2ff0b' : '#ff4444', fontWeight: 700, fontSize: '0.65rem' }}>
                    {match.result === 'EXTRACTED' ? 'E' : 'D'}
                  </span>
                  <span style={{ color: 'rgba(255,255,255,0.5)' }}>{match.map}</span>
                </div>
                <span style={{ color: 'rgba(255,255,255,0.6)' }}>
                  {match.kills}/{match.deaths}/{match.assists}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
