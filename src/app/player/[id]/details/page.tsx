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
import { PlayerAvatar } from '@/components/ui/PlayerAvatar';
import { StatsFilter, DetailedPlayer } from '@/types';
import { ShellLoadout } from '@/components/player/ShellLoadout';
import { useApp } from '@/context/AppContext';
import { getBadgeById, PINNACLE_BADGE } from '@/lib/badges';
import { playerBadges } from '@/lib/mock-data';
import { buildDefaultPlayer } from '@/lib/default-player';

interface DetailsPageProps {
  params: {
    id: string;
  };
}

export default function DetailsPage({ params }: DetailsPageProps) {
  const { user, equippedBadges, cardThemeColor, avatarBorderStyle, selectedAvatar, isPinnacle } = useApp();
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Resolve the player: mock player > own profile > not found
  const mockPlayer = detailedPlayers[params.id];
  const isOwnProfile = mounted && !mockPlayer && !!user && user.id === params.id;
  const player: DetailedPlayer | null = mockPlayer
    ?? (isOwnProfile ? buildDefaultPlayer(user, selectedAvatar) : null);

  if (!player) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] animate-fade-in">
        <div className="text-center space-y-3">
          <div className="text-2xl font-bold" style={{ color: '#e5e5e5' }}>Player not found</div>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
            No player exists with this ID.
          </p>
          <Link
            href="/"
            className="inline-block mt-4 text-sm font-mono"
            style={{ color: '#c2ff0b' }}
          >
            &larr; Back to Search
          </Link>
        </div>
      </div>
    );
  }

  const runner = RUNNER_VISUALS[player.runner];
  const stats = player.stats.overall;
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
    : (playerBadges[player.id] || []).map(getBadgeById).filter(Boolean);

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
            <PlayerAvatar
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
            {(player.membership === 'pinnacle' || (isOwnProfile && isPinnacle)) && (
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

      {/* ── Shell Loadout (left) + Loadout / Career Highlights (right, stacked) ── */}
      <div
        className="grid grid-cols-1 md:grid-cols-[1.35fr_1fr] gap-4 md:gap-6"
        style={{ alignItems: 'stretch' }}
      >
        {/* Shell Loadout — col 1, spans both rows on desktop */}
        <div
          className="md:[grid-row:1/3]"
          style={{
            background: 'linear-gradient(180deg, rgba(20,20,20,0.9) 0%, rgba(12,12,12,0.95) 100%)',
            border: '1px solid rgba(255,255,255,0.06)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.03), 0 4px 12px rgba(0,0,0,0.4)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div
            className="px-4 md:px-5 py-3 md:py-3.5"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
          >
            <h2 className="text-base md:text-lg font-semibold" style={{ color: '#e5e5e5' }}>Shell Loadout</h2>
          </div>
          <div className="flex-1 flex items-center justify-center p-4 md:p-6 overflow-hidden">
            <ShellLoadout
              runner={player.runner}
              effectiveAccent={effectiveAccent}
              slotSize={isMobile ? 64 : 98}
              shellSize={isMobile ? 190 : 300}
            />
          </div>
        </div>

        {/* Loadout — col 2, row 1 on desktop */}
        <div
          className="md:[grid-column:2] md:[grid-row:1]"
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
            <h2 className="text-base md:text-lg font-semibold" style={{ color: '#e5e5e5' }}>Loadout</h2>
          </div>
          <div className="p-3 md:p-4">
            {player.loadout.length === 0 ? (
              <div className="flex items-center justify-center py-8" style={{ color: 'rgba(255,255,255,0.25)' }}>
                <span className="font-mono text-sm">No loadout configured</span>
              </div>
            ) : (() => {
              const WEAPON_SLOTS = ['primary', 'sidearm', 'weapon3'] as const;
              const weapons = player.loadout.filter(i => (WEAPON_SLOTS as readonly string[]).includes(i.slot));
              const gadgets = player.loadout.filter(i => !(WEAPON_SLOTS as readonly string[]).includes(i.slot));
              const weaponLabel = (slot: string) => {
                const idx = WEAPON_SLOTS.indexOf(slot as typeof WEAPON_SLOTS[number]);
                return `WPN ${idx + 1}`;
              };
              return (
                <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                  {/* Weapons — 1×3 left column */}
                  {weapons.length > 0 && (
                    <div style={{ flex: '1 1 0', display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0 }}>
                      {weapons.map((item) => (
                        <div
                          key={item.slot}
                          style={{
                            background: '#0a0a0a',
                            border: `1px solid ${effectiveAccent}1a`,
                            padding: '10px 12px 8px',
                          }}
                        >
                          {item.image && (
                            <div style={{ width: '100%', aspectRatio: '16 / 7', position: 'relative', marginBottom: 8 }}>
                              <Image src={item.image} alt={item.name} fill style={{ objectFit: 'contain' }} />
                            </div>
                          )}
                          <div style={{ fontSize: '0.65rem', color: '#e5e5e5', fontWeight: 600, marginBottom: 2 }}>{item.name}</div>
                          <div style={{ fontSize: '0.48rem', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                            {weaponLabel(item.slot)}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {/* Gear — 2×1 right column, much smaller squares */}
                  {gadgets.length > 0 && (
                    <div style={{ flex: '0 0 28%', display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {gadgets.map((item) => (
                        <div
                          key={item.slot}
                          style={{
                            background: '#0a0a0a',
                            border: `1px solid ${effectiveAccent}1a`,
                            padding: '8px 6px',
                            textAlign: 'center',
                            aspectRatio: '1 / 1',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <div style={{ fontSize: '1.5rem', lineHeight: 1, marginBottom: 5, color: effectiveAccent + '99' }}>
                            {item.icon}
                          </div>
                          <div style={{ fontSize: '0.52rem', color: '#e5e5e5', fontWeight: 500, lineHeight: 1.2 }}>{item.name}</div>
                          <div style={{ fontSize: '0.42rem', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 3 }}>
                            {item.slot}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        </div>

        {/* Career Highlights — col 2, row 2 on desktop */}
        <div
          className="md:[grid-column:2] md:[grid-row:2]"
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
            <h2 className="text-base md:text-lg font-semibold" style={{ color: '#e5e5e5' }}>Career Highlights</h2>
          </div>
          <div className="p-3 md:p-5 space-y-2 md:space-y-4">
            {player.careerHighlights.length === 0 ? (
              <div className="flex items-center justify-center py-8" style={{ color: 'rgba(255,255,255,0.25)' }}>
                <span className="font-mono text-sm">No highlights yet</span>
              </div>
            ) : (
              player.careerHighlights.map((highlight) => (
                <div
                  key={highlight.label}
                  className="flex items-center justify-between"
                  style={{ padding: '6px 10px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}
                >
                  <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>{highlight.label}</span>
                  <span className="font-mono font-bold tabular-nums text-sm" style={{ color: effectiveAccent }}>{highlight.value}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ── Stats Grid with Filters ── */}
      <StatsGrid stats={player.stats} />

      {/* ── Recent Matches ── */}
      <RecentMatches matches={isOwnProfile ? [] : mockMatches} />

      {/* ── Weapons + Recently Played With ── */}
      <div className="grid md:grid-cols-2 gap-4 md:gap-6">
        <WeaponUsage weapons={isOwnProfile ? [] : mockWeaponStats} />
        <RecentlyPlayedWith players={isOwnProfile ? [] : mockRecentlyPlayedWith} />
      </div>
    </div>
  );
}
