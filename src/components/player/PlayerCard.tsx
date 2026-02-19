'use client';

import Link from 'next/link';
import Image from 'next/image';
import { DetailedPlayer, MembershipTier } from '@/types';
import { RUNNER_VISUALS } from '@/lib/runners';
import { formatKD, formatPercentage, cn } from '@/lib/utils';
import { RankBadge } from '@/components/ui/RankBadge';
import { BadgeIcon } from '@/components/ui/BadgeIcon';
import { PlayerAvatar } from '@/components/ui/PlayerAvatar';
import { ShellLoadout } from '@/components/player/ShellLoadout';
import { useApp } from '@/context/AppContext';
import { getBadgeById, PINNACLE_BADGE } from '@/lib/badges';
import { playerBadges } from '@/lib/mock-data';

interface PlayerCardProps {
  player: DetailedPlayer;
  isCenter?: boolean;
}

export function PlayerCard({ player, isCenter = false }: PlayerCardProps) {
  const { user, cardThemeColor, equippedBadges, avatarBorderStyle, isPinnacle } = useApp();
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

  // Avatar border animation
  const borderClass = isOwnCard && avatarBorderStyle !== 'none'
    ? `avatar-border-${avatarBorderStyle}`
    : '';
  const borderVars = {
    '--border-color': effectiveAccent,
    '--border-color-dim': effectiveAccent + '88',
    '--border-color-dim2': effectiveAccent + '44',
    '--border-color-light': effectiveAccent + 'cc',
  } as React.CSSProperties;

  // Get badges to display for this player
  const displayBadges = isOwnCard
    ? equippedBadges.map(getBadgeById).filter(Boolean)
    : (playerBadges[player.id] || []).map(getBadgeById).filter(Boolean);

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
          overflow: 'hidden',
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
          style={{ height: 120, background: emblemGradient }}
        >
          {/* Shell at top of emblem, reflected on y-axis */}
          <div
            className="absolute top-0 right-0"
            style={{ width: 90, height: 120, opacity: 0.5, transform: 'scaleX(-1)' }}
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
          <div style={{ position: 'absolute', bottom: 12, left: 16, right: 16 }}>
            <div className="flex items-center gap-2.5">
              <PlayerAvatar
                src={player.avatar}
                alt={player.name}
                width={48}
                height={48}
                className={borderClass}
                style={{
                  flexShrink: 0,
                  width: 48,
                  height: 48,
                  border: `2px solid ${effectiveAccent}44`,
                  borderRadius: 0,
                  objectFit: 'cover',
                  ...borderVars,
                }}
              />
              <div className="flex items-baseline gap-2">
                <span className="font-bold text-xl tracking-tight" style={{ color: '#fff' }}>
                  {player.name}
                </span>
                <span className="font-mono text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
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
              {(player.membership === 'pinnacle' || (user?.id === player.id && isPinnacle)) && (
                <BadgeIcon badge={PINNACLE_BADGE} size="sm" variant="tag" />
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
            {player.loadout.length === 0 ? (
              <div className="flex items-center justify-center py-4" style={{ color: 'rgba(255,255,255,0.2)' }}>
                <span className="font-mono" style={{ fontSize: '0.65rem' }}>No loadout configured</span>
              </div>
            ) : (() => {
              const WEAPON_SLOTS = ['primary', 'sidearm', 'weapon3'];
              const weapons = player.loadout.filter(i => WEAPON_SLOTS.includes(i.slot));
              const gadgets = player.loadout.filter(i => !WEAPON_SLOTS.includes(i.slot));
              return (
                <div style={{ display: 'flex', gap: 5, alignItems: 'flex-start' }}>
                  {/* Weapons — 1×3 left column */}
                  {weapons.length > 0 && (
                    <div style={{ flex: '1 1 0', display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 }}>
                      {weapons.map((item) => (
                        <div
                          key={item.slot}
                          style={{
                            background: '#0a0a0a',
                            border: `1px solid ${effectiveAccent}18`,
                            padding: '6px 8px 5px',
                          }}
                        >
                          {item.image && (
                            <div style={{ width: '100%', aspectRatio: '16 / 7', position: 'relative', marginBottom: 4 }}>
                              <Image src={item.image} alt={item.name} fill style={{ objectFit: 'contain' }} />
                            </div>
                          )}
                          <div className="truncate" style={{ fontSize: '0.52rem', color: '#e5e5e5', fontWeight: 600 }}>{item.name}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  {/* Gear — 2×1 right column, small squares */}
                  {gadgets.length > 0 && (
                    <div style={{ flex: '0 0 28%', display: 'flex', flexDirection: 'column', gap: 4 }}>
                      {gadgets.map((item) => (
                        <div
                          key={item.slot}
                          style={{
                            background: '#0a0a0a',
                            border: `1px solid ${effectiveAccent}18`,
                            padding: '5px 4px',
                            textAlign: 'center',
                            aspectRatio: '1 / 1',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <div style={{ fontSize: '1.1rem', lineHeight: 1, marginBottom: 3, color: effectiveAccent + '88' }}>
                            {item.icon}
                          </div>
                          <div className="truncate w-full" style={{ fontSize: '0.45rem', color: 'rgba(255,255,255,0.3)' }}>{item.name}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })()}
          </div>

          {/* ── Shell Loadout ── */}
          <div
            className="relative px-4 py-4 flex flex-col items-center"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
          >
            <div
              className="mb-3 self-start"
              style={{
                fontSize: '0.575rem',
                letterSpacing: '0.1em',
                color: 'rgba(255,255,255,0.25)',
                textTransform: 'uppercase',
              }}
            >
              Shell Loadout
            </div>
            <ShellLoadout
              runner={player.runner}
              effectiveAccent={effectiveAccent}
              slotSize={55}
              shellSize={260}
              extraTopPadding={14}
            />
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
            {player.recentMatchSummary.length === 0 ? (
              <div className="flex items-center justify-center py-4" style={{ color: 'rgba(255,255,255,0.2)' }}>
                <span className="font-mono" style={{ fontSize: '0.65rem' }}>No recent matches</span>
              </div>
            ) : (
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
                      <span style={{ color: 'rgba(255,255,255,0.5)' }}>{match.map}</span>
                      {match.runner && (
                        <span
                          style={{
                            color: RUNNER_VISUALS[match.runner].accent,
                            fontSize: '0.55rem',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            opacity: 0.8,
                          }}
                        >
                          {RUNNER_VISUALS[match.runner].name}
                        </span>
                      )}
                    </div>
                    <span style={{ color: 'rgba(255,255,255,0.6)' }}>
                      {match.kills}/{match.deaths}/{match.assists}
                    </span>
                  </div>
                ))}
              </div>
            )}
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
