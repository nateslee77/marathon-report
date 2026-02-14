'use client';

import Link from 'next/link';
import Image from 'next/image';
import { DetailedPlayer, MembershipTier } from '@/types';
import { RUNNER_VISUALS } from '@/lib/runners';
import { formatKD, formatPercentage, cn } from '@/lib/utils';
import { RankBadge } from '@/components/ui/RankBadge';
import { BadgeIcon } from '@/components/ui/BadgeIcon';
import { useApp } from '@/context/AppContext';
import { getBadgeById } from '@/lib/badges';

interface PlayerCardProps {
  player: DetailedPlayer;
  isCenter?: boolean;
}

export function PlayerCard({ player, isCenter = false }: PlayerCardProps) {
  const { user, cardThemeColor, equippedBadges } = useApp();
  const isOwnCard = user?.id === player.id;
  const runner = RUNNER_VISUALS[player.runner];
  const effectiveAccent = isOwnCard && cardThemeColor ? cardThemeColor : runner.accent;
  const useCustomTheme = isOwnCard && !!cardThemeColor;

  // Generate emblem gradient from the effective accent color
  function hexToRgb(hex: string) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
  }
  const emblemGradient = useCustomTheme
    ? (() => {
        const { r, g, b } = hexToRgb(cardThemeColor);
        const dark = `rgb(${Math.round(r * 0.3)},${Math.round(g * 0.3)},${Math.round(b * 0.3)})`;
        const mid = `rgb(${r},${g},${b})`;
        const light = `rgb(${Math.min(255, Math.round(r * 1.3))},${Math.min(255, Math.round(g * 1.3))},${Math.min(255, Math.round(b * 1.3))})`;
        return `linear-gradient(135deg, ${dark} 0%, ${mid} 45%, ${light} 55%, ${dark} 100%)`;
      })()
    : runner.emblemGradient;

  // Get badges to display for this player
  const displayBadges = isOwnCard
    ? equippedBadges.map(getBadgeById).filter(Boolean)
    : [];

  const stats = player.stats.overall;

  return (
    <Link
      href={`/player/${player.id}/details`}
      className="block h-full group"
      style={{ textDecoration: 'none' }}
    >
      <div
        className={cn(
          'relative h-full flex flex-col transition-all duration-300',
          isCenter
            ? 'border-opacity-100'
            : 'border-opacity-60'
        )}
        style={{
          background: `linear-gradient(180deg, rgba(16,16,16,0.95) 0%, rgba(10,10,10,0.98) 100%)`,
          border: `1px solid ${isCenter ? effectiveAccent + '22' : 'rgba(255,255,255,0.06)'}`,
          boxShadow: isCenter
            ? `inset 0 1px 0 ${effectiveAccent}11, 0 0 40px ${effectiveAccent}08, 0 8px 32px rgba(0,0,0,0.5)`
            : `inset 0 1px 0 rgba(255,255,255,0.03), 0 4px 16px rgba(0,0,0,0.4)`,
        }}
      >
        {/* Equipped badges (overlaid, outside overflow-hidden) */}
        {displayBadges.length > 0 && (
          <div
            style={{
              position: 'absolute',
              top: 10,
              left: 12,
              zIndex: 10,
              display: 'flex',
              flexWrap: 'wrap',
              gap: 3,
              maxWidth: 'calc(100% - 24px)',
            }}
          >
            {displayBadges.map((badge) => badge && (
              <BadgeIcon key={badge.id} badge={badge} size="sm" variant="tag" />
            ))}
          </div>
        )}

        {/* ── Emblem Header ── */}
        <div
          className="relative overflow-hidden"
          style={{
            height: 120,
            background: emblemGradient,
          }}
        >
          {/* Shell at top of emblem, reflected on y-axis */}
          <div
            className="absolute top-0 right-0"
            style={{
              width: 90,
              height: 120,
              opacity: 0.5,
              transform: 'scaleX(-1)',
            }}
          >
            <Image
              src={runner.image}
              alt={runner.name}
              fill
              style={{ objectFit: 'cover', objectPosition: 'left top' }}
            />
          </div>
          {/* Vignette overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(180deg, transparent 40%, rgba(16,16,16,0.95) 100%)',
            }}
          />
          {/* Player name overlay */}
          <div
            style={{
              position: 'absolute',
              bottom: 12,
              left: 16,
              right: 16,
            }}
          >
            <div className="flex items-center gap-2.5">
              <Image
                src={player.avatar}
                alt={player.name}
                width={48}
                height={48}
                style={{
                  flexShrink: 0,
                  border: `1px solid ${effectiveAccent}44`,
                  borderRadius: 0,
                  objectFit: 'cover',
                }}
              />
              <div className="flex items-baseline gap-2">
                <span
                  className="font-bold text-xl tracking-tight"
                  style={{ color: '#fff' }}
                >
                  {player.name}
                </span>
                <span
                  className="font-mono text-xs"
                  style={{ color: 'rgba(255,255,255,0.4)' }}
                >
                  {player.tag}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Runner Background Layer ── */}
        <div
          className="relative flex-1 flex flex-col"
          style={{ background: runner.bgGradient }}
        >
          {/* Runner + Platform + Rating row */}
          <div
            className="relative flex items-center justify-between px-4 py-3"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
          >
            <div className="flex items-center gap-2">
              <span
                className="font-mono text-xs font-semibold uppercase"
                style={{ color: effectiveAccent }}
              >
                {runner.name}
              </span>
              <span
                className="text-xs"
                style={{ color: 'rgba(255,255,255,0.25)' }}
              >
                {runner.role}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {player.membership !== 'free' && (
                <span
                  style={{
                    fontSize: '0.45rem',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    fontWeight: 700,
                    color: player.membership === 'pinnacle' ? '#ffcc00' : '#c2ff0b',
                    background: player.membership === 'pinnacle' ? 'rgba(255,204,0,0.1)' : 'rgba(194,255,11,0.1)',
                    border: `1px solid ${player.membership === 'pinnacle' ? 'rgba(255,204,0,0.3)' : 'rgba(194,255,11,0.3)'}`,
                    padding: '1px 5px',
                  }}
                >
                  {player.membership === 'pinnacle' ? 'Pinnacle' : 'Runner Pass'}
                </span>
              )}
              <RankBadge rank={player.competitiveRank} size="sm" />
              <span
                className="font-mono text-sm font-bold"
                style={{ color: effectiveAccent }}
              >
                {player.rating}
              </span>
            </div>
          </div>

          {/* ── Core Stats Grid ── */}
          <div
            className="relative grid grid-cols-4 gap-0 px-4 py-4"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
          >
            {[
              { label: 'K/D', value: formatKD(stats.kd), color: stats.kd >= 1.5 ? effectiveAccent : stats.kd >= 1.0 ? '#e5e5e5' : '#ff4444' },
              { label: 'EXT%', value: formatPercentage(stats.winRate, 1), color: stats.winRate >= 60 ? effectiveAccent : '#e5e5e5' },
              { label: 'MATCHES', value: String(stats.matchesPlayed), color: '#e5e5e5' },
              { label: 'STREAK', value: String(stats.currentStreak), color: stats.currentStreak >= 3 ? effectiveAccent : '#e5e5e5' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div
                  className="font-mono text-lg font-bold tabular-nums"
                  style={{ color: stat.color }}
                >
                  {stat.value}
                </div>
                <div
                  className="mt-0.5"
                  style={{
                    fontSize: '0.575rem',
                    letterSpacing: '0.1em',
                    color: 'rgba(255,255,255,0.3)',
                    textTransform: 'uppercase',
                  }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* ── Performance Bar ── */}
          <div className="relative px-4 py-2">
            <div
              style={{
                height: 3,
                width: '100%',
                background: 'rgba(255,255,255,0.04)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  bottom: 0,
                  width: `${stats.winRate}%`,
                  background: `linear-gradient(90deg, ${effectiveAccent}55 0%, ${effectiveAccent} 100%)`,
                }}
              />
            </div>
          </div>

          {/* ── Loadout Preview ── */}
          <div
            className="relative px-4 py-3"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
          >
            <div
              className="mb-2"
              style={{
                fontSize: '0.575rem',
                letterSpacing: '0.1em',
                color: 'rgba(255,255,255,0.25)',
                textTransform: 'uppercase',
              }}
            >
              Loadout
            </div>
            <div className="grid grid-cols-4 gap-2">
              {player.loadout.map((item) => (
                <div
                  key={item.slot}
                  className="text-center"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.04)',
                    padding: '6px 2px',
                  }}
                >
                  <div
                    className="font-mono text-sm font-bold"
                    style={{ color: 'rgba(255,255,255,0.5)' }}
                  >
                    {item.icon}
                  </div>
                  <div
                    className="mt-1 truncate"
                    style={{
                      fontSize: '0.55rem',
                      color: 'rgba(255,255,255,0.3)',
                    }}
                  >
                    {item.name}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Mini Recent Matches ── */}
          <div className="relative px-4 py-3 flex-1">
            <div
              className="mb-2"
              style={{
                fontSize: '0.575rem',
                letterSpacing: '0.1em',
                color: 'rgba(255,255,255,0.25)',
                textTransform: 'uppercase',
              }}
            >
              Recent
            </div>
            <div className="space-y-1.5">
              {player.recentMatchSummary.map((match, i) => (
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
                    <span
                      style={{
                        color: match.result === 'EXTRACTED' ? '#c2ff0b' : '#ff4444',
                        fontWeight: 700,
                        fontSize: '0.65rem',
                      }}
                    >
                      {match.result === 'EXTRACTED' ? 'E' : 'D'}
                    </span>
                    <span style={{ color: 'rgba(255,255,255,0.5)' }}>
                      {match.map}
                    </span>
                  </div>
                  <span style={{ color: 'rgba(255,255,255,0.6)' }}>
                    {match.kills}/{match.deaths}/{match.assists}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Click hint ── */}
          <div
            className="relative px-4 py-3 text-center transition-opacity duration-200 opacity-0 group-hover:opacity-100"
            style={{
              fontSize: '0.6rem',
              letterSpacing: '0.1em',
              color: effectiveAccent,
              textTransform: 'uppercase',
              borderTop: `1px solid ${effectiveAccent}22`,
              background: `linear-gradient(180deg, transparent 0%, ${effectiveAccent}08 100%)`,
            }}
          >
            View Full Report
          </div>
        </div>
      </div>
    </Link>
  );
}
