'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { detailedPlayers, mockMatches, mockRecentlyPlayedWith, mockWeaponStats } from '@/lib/mock-data';
import { RUNNER_VISUALS } from '@/lib/runners';
import { StatsGrid } from '@/components/player/StatsGrid';
import { RecentMatches } from '@/components/player/RecentMatches';
import { WeaponUsage } from '@/components/player/WeaponUsage';
import { RecentlyPlayedWith } from '@/components/player/RecentlyPlayedWith';
import { formatKD, formatPercentage, cn } from '@/lib/utils';
import { RankBadge } from '@/components/ui/RankBadge';
import { BadgeIcon } from '@/components/ui/BadgeIcon';
import { StatsFilter } from '@/types';
import { useApp } from '@/context/AppContext';
import { getBadgeById, PINNACLE_BADGE } from '@/lib/badges';

interface DetailsPageProps {
  params: {
    id: string;
  };
}

export default function DetailsPage({ params }: DetailsPageProps) {
  const player = detailedPlayers[params.id] || detailedPlayers['player-001'];
  const runner = RUNNER_VISUALS[player.runner];
  const stats = player.stats.overall;
  const { user, equippedBadges, cardThemeColor, avatarBorderStyle } = useApp();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  const isOwnProfile = mounted && user?.id === player.id;
  const effectiveAccent = isOwnProfile && cardThemeColor ? cardThemeColor : runner.accent;

  function hexToRgb(hex: string) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
  }
  const emblemGradient = isOwnProfile && cardThemeColor
    ? (() => {
        const { r, g, b } = hexToRgb(cardThemeColor);
        const dark = `rgb(${Math.round(r * 0.3)},${Math.round(g * 0.3)},${Math.round(b * 0.3)})`;
        const mid = `rgb(${r},${g},${b})`;
        const light = `rgb(${Math.min(255, Math.round(r * 1.3))},${Math.min(255, Math.round(g * 1.3))},${Math.min(255, Math.round(b * 1.3))})`;
        return `linear-gradient(135deg, ${dark} 0%, ${mid} 45%, ${light} 55%, ${dark} 100%)`;
      })()
    : runner.emblemGradient;

  const borderClass = isOwnProfile && avatarBorderStyle !== 'none'
    ? `avatar-border-${avatarBorderStyle}`
    : '';
  const borderVars = {
    '--border-color': effectiveAccent,
    '--border-color-dim': effectiveAccent + '88',
    '--border-color-dim2': effectiveAccent + '44',
    '--border-color-light': effectiveAccent + 'cc',
  } as React.CSSProperties;

  const displayBadges = isOwnProfile
    ? equippedBadges.map(getBadgeById).filter(Boolean)
    : [];

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in max-w-[1400px] mx-auto px-4 md:px-0 py-4 md:py-0">
      {/* ── Back link ── */}
      <Link
        href={`/player/${player.id}`}
        className="inline-flex items-center gap-2 text-sm transition-colors duration-150 hover:opacity-80"
        style={{ color: '#c2ff0b', minHeight: 44, display: 'inline-flex', alignItems: 'center' }}
      >
        <span style={{ fontSize: '0.75rem' }}>&larr;</span>
        Back to Fireteam
      </Link>

      {/* ── Runner Hero Banner ── */}
      <div
        className="relative overflow-hidden"
        style={{
          background: emblemGradient,
          minHeight: 160,
          border: `1px solid ${effectiveAccent}22`,
        }}
      >
        {/* Runner bg gradient */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: runner.bgGradient,
          }}
        />
        {/* Shell at top-right of emblem, reflected */}
        <div
          className="absolute top-0 right-0 bottom-0"
          style={{
            width: 200,
            opacity: 0.5,
            transform: 'scaleX(-1)',
          }}
        >
          <Image
            src={runner.image}
            alt={runner.name}
            fill
            style={{ objectFit: 'contain', objectPosition: 'left top' }}
          />
        </div>
        {/* Dark vignette */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(10,10,10,0.3) 0%, rgba(10,10,10,0.85) 100%)',
          }}
        />

        {/* Hero content */}
        <div className="relative px-4 py-5 md:px-8 md:py-8 flex flex-col justify-end" style={{ minHeight: 160 }}>
          {/* Equipped badges */}
          {displayBadges.length > 0 && (
            <div className="flex items-center flex-wrap gap-2 mb-3">
              {displayBadges.map((badge) => badge && (
                <BadgeIcon key={badge.id} badge={badge} size="md" variant="tag" />
              ))}
            </div>
          )}

          {/* Name and tag */}
          <div className="flex items-center gap-3 mb-1">
            <Image
              src={player.avatar}
              alt={player.name}
              width={72}
              height={72}
              className={`md:w-[96px] md:h-[96px] ${borderClass}`}
              style={{
                flexShrink: 0,
                width: 72,
                height: 72,
                border: `2px solid ${effectiveAccent}55`,
                borderRadius: 0,
                objectFit: 'cover',
                ...borderVars,
              }}
            />
            <div className="min-w-0">
              <div className="flex items-baseline gap-2 md:gap-3">
                <h1 className="text-xl md:text-3xl font-bold tracking-tight truncate" style={{ color: '#fff' }}>
                  {player.name}
                </h1>
                <span className="font-mono text-sm md:text-lg flex-shrink-0" style={{ color: 'rgba(255,255,255,0.35)' }}>
                  {player.tag}
                </span>
              </div>
            </div>
          </div>

          {/* Runner + Platform + Rating row — wraps on mobile */}
          <div className="flex flex-wrap items-center gap-2 md:gap-4 mt-1">
            <span className="font-mono text-xs md:text-sm font-bold" style={{ color: effectiveAccent }}>
              {runner.name}
            </span>
            <span className="hidden md:inline" style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.7rem' }}>
              {runner.role}
            </span>
            {player.membership === 'pinnacle' && (
              <BadgeIcon badge={PINNACLE_BADGE} size="sm" variant="tag" />
            )}
            <span className="hidden md:inline-block" style={{ width: 1, height: 14, background: 'rgba(255,255,255,0.1)' }} />
            <span className="font-mono text-xs md:text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
              {player.platform}
            </span>
            <span className="font-mono text-xs md:text-sm" style={{ color: 'rgba(255,255,255,0.3)' }}>
              Lvl {player.level}
            </span>
            <span className="font-mono text-xs md:text-sm font-bold" style={{ color: effectiveAccent }}>
              {player.rating} SR
            </span>
            <span className="hidden md:inline-block" style={{ width: 1, height: 14, background: 'rgba(255,255,255,0.1)' }} />
            <RankBadge rank={player.competitiveRank} size="sm" />
          </div>

          {/* Quick stats — grid on mobile, flex on desktop */}
          <div className="grid grid-cols-3 md:flex md:gap-6 gap-y-3 mt-4">
            {[
              { label: 'K/D', value: formatKD(stats.kd) },
              { label: 'Extract Rate', value: formatPercentage(stats.winRate) },
              { label: 'KDA', value: formatKD(stats.kda) },
              { label: 'Matches', value: String(stats.matchesPlayed) },
              { label: 'Extraction', value: formatPercentage(stats.extractionRate) },
            ].map((s) => (
              <div key={s.label}>
                <div className="font-mono text-base md:text-xl font-bold tabular-nums" style={{ color: '#fff' }}>
                  {s.value}
                </div>
                <div
                  style={{
                    fontSize: '0.525rem',
                    letterSpacing: '0.1em',
                    color: 'rgba(255,255,255,0.3)',
                    textTransform: 'uppercase',
                    marginTop: 2,
                  }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Loadout + Career Highlights ── */}
      <div className="grid md:grid-cols-2 gap-4 md:gap-6">
        {/* Loadout */}
        <div
          style={{
            background: 'linear-gradient(180deg, rgba(20,20,20,0.9) 0%, rgba(12,12,12,0.95) 100%)',
            border: '1px solid rgba(255,255,255,0.06)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.03), 0 4px 12px rgba(0,0,0,0.4)',
          }}
        >
          <div
            className="px-4 md:px-5 py-3 md:py-3.5"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
          >
            <h2 className="text-base md:text-lg font-semibold" style={{ color: '#e5e5e5' }}>
              Loadout
            </h2>
          </div>
          <div className="p-3 md:p-5 grid grid-cols-4 gap-2 md:gap-3">
            {player.loadout.map((item) => (
              <div
                key={item.slot}
                className="text-center"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: `1px solid ${effectiveAccent}11`,
                  padding: '8px 4px',
                }}
              >
                {item.image ? (
                  <div className="flex justify-center items-center h-8 md:h-12 mb-1 md:mb-1">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={180}
                      height={135}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        filter: 'brightness(0.9)',
                      }}
                    />
                  </div>
                ) : (
                  <div
                    className="font-mono text-xl md:text-2xl font-bold mb-1 md:mb-2 h-8 md:h-12 flex items-center justify-center"
                    style={{ color: effectiveAccent + '88' }}
                  >
                    {item.icon}
                  </div>
                )}
                <div className="text-xs md:text-sm font-medium truncate" style={{ color: '#e5e5e5' }}>
                  {item.name}
                </div>
                <div
                  className="mt-0.5 md:mt-1"
                  style={{
                    fontSize: '0.5rem',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.25)',
                  }}
                >
                  {item.slot}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Career Highlights */}
        <div
          style={{
            background: 'linear-gradient(180deg, rgba(20,20,20,0.9) 0%, rgba(12,12,12,0.95) 100%)',
            border: '1px solid rgba(255,255,255,0.06)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.03), 0 4px 12px rgba(0,0,0,0.4)',
          }}
        >
          <div
            className="px-4 md:px-5 py-3 md:py-3.5"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
          >
            <h2 className="text-base md:text-lg font-semibold" style={{ color: '#e5e5e5' }}>
              Career Highlights
            </h2>
          </div>
          <div className="p-3 md:p-5 space-y-2 md:space-y-4">
            {player.careerHighlights.map((highlight) => (
              <div
                key={highlight.label}
                className="flex items-center justify-between"
                style={{
                  padding: '6px 10px',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.04)',
                }}
              >
                <span
                  style={{
                    fontSize: '0.7rem',
                    color: 'rgba(255,255,255,0.5)',
                  }}
                >
                  {highlight.label}
                </span>
                <span
                  className="font-mono font-bold tabular-nums text-sm"
                  style={{ color: effectiveAccent }}
                >
                  {highlight.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Stats Grid with Filters ── */}
      <StatsGrid stats={player.stats} />

      {/* ── Recent Matches ── */}
      <RecentMatches matches={mockMatches} />

      {/* ── Weapons + Recently Played With ── */}
      <div className="grid md:grid-cols-2 gap-4 md:gap-6">
        <WeaponUsage weapons={mockWeaponStats} />
        <RecentlyPlayedWith players={mockRecentlyPlayedWith} />
      </div>
    </div>
  );
}
