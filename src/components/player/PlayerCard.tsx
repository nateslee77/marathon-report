'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { DetailedPlayer, MembershipTier, StatsFilter, WeaponRecord } from '@/types';
import { RUNNER_VISUALS } from '@/lib/runners';
import { formatKD, formatPercentage, cn } from '@/lib/utils';
import { RankBadge } from '@/components/ui/RankBadge';
import { BadgeIcon } from '@/components/ui/BadgeIcon';
import { PlayerAvatar } from '@/components/ui/PlayerAvatar';
import { ShellLoadout } from '@/components/player/ShellLoadout';
import { PerformanceGraph } from '@/components/player/PerformanceGraph';
import { WeaponCard } from '@/components/player/WeaponCard';
import { useApp } from '@/context/AppContext';
import { getBadgeById, PINNACLE_BADGE } from '@/lib/badges';
import { playerBadges } from '@/lib/mock-data';

interface PlayerCardProps {
  player: DetailedPlayer;
  isCenter?: boolean;
}

export function PlayerCard({ player, isCenter = false }: PlayerCardProps) {
  const { user, cardThemeColor, equippedBadges, avatarBorderStyle, isPinnacle, youtubeUrl, twitchUrl } = useApp();
  const isOwnCard = user?.id === player.id;

  // Fetch weapon data from Supabase via API (keyed by lowercase name for lookup)
  const [weaponData, setWeaponData] = useState<Record<string, WeaponRecord>>({});
  useEffect(() => {
    fetch('/api/weapons')
      .then(r => r.json())
      .then((rows: WeaponRecord[]) => {
        if (!Array.isArray(rows)) return;
        const map: Record<string, WeaponRecord> = {};
        rows.forEach(r => { map[r.weapon.toLowerCase()] = r; });
        setWeaponData(map);
      })
      .catch(() => {});
  }, []);
  const runner = RUNNER_VISUALS[player.runner];
  const displayYoutubeUrl = isOwnCard ? youtubeUrl : player.youtubeUrl;
  const displayTwitchUrl = isOwnCard ? twitchUrl : player.twitchUrl;
  const playerThemeColor = isOwnCard && cardThemeColor ? cardThemeColor : player.themeColor;
  const effectiveAccent = playerThemeColor ?? runner.accent;
  const useCustomTheme = !!playerThemeColor;

  // Generate emblem gradient from the effective accent color
  function hexToRgb(hex: string) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
  }
  const emblemGradient = useCustomTheme
    ? (() => {
        const { r, g, b } = hexToRgb(effectiveAccent);
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

  const [statsFilter, setStatsFilter] = useState<StatsFilter>('thisWeek');
  const filteredStats = player.stats[statsFilter];
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
          style={{ height: 140, background: emblemGradient }}
        >
          {/* Shell at top of emblem, reflected on y-axis */}
          <div
            className="absolute top-0 right-0"
            style={{ width: 90, height: 140, opacity: 0.5, transform: 'scaleX(-1)' }}
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
          {/* Pinnacle badge — bottom-right of shell image */}
          {(player.membership === 'pinnacle' || (user?.id === player.id && isPinnacle)) && (
            <div style={{ position: 'absolute', bottom: 12, right: 8, zIndex: 5 }}>
              <BadgeIcon badge={PINNACLE_BADGE} size="sm" variant="tag" />
            </div>
          )}
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
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="font-bold text-xl tracking-tight" style={{ color: '#fff' }}>
                    {player.name}
                  </span>
                  <span className="font-mono text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
                    {player.tag}
                  </span>
                </div>
                {(displayYoutubeUrl || displayTwitchUrl) && (
                  <div className="flex items-center gap-2 mt-1">
                    {displayYoutubeUrl && (
                      <a
                        href={displayYoutubeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '2px 6px', background: 'rgba(255,0,0,0.12)', border: '1px solid rgba(255,0,0,0.25)', color: '#ff4444', fontSize: '0.55rem', letterSpacing: '0.06em', textTransform: 'uppercase', textDecoration: 'none', transition: 'background 150ms' }}
                      >
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8zM9.7 15.5V8.5l6.3 3.5-6.3 3.5z"/></svg>
                        YT
                      </a>
                    )}
                    {displayTwitchUrl && (
                      <a
                        href={displayTwitchUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '2px 6px', background: 'rgba(145,70,255,0.12)', border: '1px solid rgba(145,70,255,0.25)', color: '#9146ff', fontSize: '0.55rem', letterSpacing: '0.06em', textTransform: 'uppercase', textDecoration: 'none', transition: 'background 150ms' }}
                      >
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M11.6 6H13v4.5h-1.4V6zm3.8 0H17v4.5h-1.4V6zM2 0L.5 4v16.5H6V24l3.5-3.5H13L21.5 12V0H2zm18 11.5l-3.5 3.5H13l-3 3v-3H4.5V1.5h15.5V11.5z"/></svg>
                        Twitch
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Runner Background Layer ── */}
        <div
          className="relative flex-1 flex flex-col"
          style={{ background: useCustomTheme ? `radial-gradient(ellipse at 50% 20%, ${effectiveAccent}22 0%, transparent 55%)` : runner.bgGradient }}
        >
          {/* Runner + Platform + Rating + Elo row */}
          <div
            className="relative flex items-center justify-between px-4 py-2.5"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
          >
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-semibold uppercase" style={{ color: effectiveAccent }}>
                {runner.name}
              </span>
              <span className="font-mono text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
                Lvl {player.level}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <RankBadge rank={player.competitiveRank} size="sm" />
              {/* Elo stack: trio + solo */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <span style={{ fontSize: '0.45rem', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>TRIO</span>
                  <span className="font-mono font-bold" style={{ fontSize: '0.6rem', color: effectiveAccent }}>{player.trioElo ?? player.rating}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <span style={{ fontSize: '0.45rem', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>SOLO</span>
                  <span className="font-mono" style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.5)' }}>{player.soloElo ?? player.rating}</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Core Stats Grid ── */}
          <div
            className="relative px-4 py-3"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
          >
            {/* Row 1 */}
            <div className="grid grid-cols-4 gap-0 mb-3">
              {[
                { label: 'K/D',      value: formatKD(stats.kd),                       color: stats.kd >= 1.5 ? effectiveAccent : stats.kd >= 1.0 ? '#e5e5e5' : '#ff4444', bold: true },
                { label: 'EXT%',     value: formatPercentage(stats.extractionRate, 1), color: stats.extractionRate >= 60 ? effectiveAccent : '#e5e5e5' },
                { label: 'AVG KILLS',value: stats.averageKills.toFixed(1),             color: '#e5e5e5' },
                { label: 'K/D/A',    value: formatKD(stats.kda),                       color: 'rgba(255,255,255,0.6)' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className={`font-stat tabular-nums ${stat.bold ? 'font-bold' : 'font-semibold'}`} style={{ fontSize: '1.25rem', color: stat.color }}>
                    {stat.value}
                  </div>
                  <div className="mt-0.5" style={{ fontSize: '0.5rem', letterSpacing: '0.09em', color: 'rgba(255,255,255,0.28)', textTransform: 'uppercase' }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
            {/* Divider */}
            <div style={{ height: 1, background: 'rgba(255,255,255,0.04)', marginBottom: 10 }} />
            {/* Row 2 */}
            <div className="grid grid-cols-4 gap-0">
              {[
                { label: 'MATCHES',  value: String(stats.matchesPlayed),              color: 'rgba(255,255,255,0.7)' },
                { label: 'STREAK',   value: String(stats.currentStreak),              color: stats.currentStreak >= 3 ? effectiveAccent : 'rgba(255,255,255,0.7)' },
                { label: 'BEST STK', value: String(stats.bestStreak),                 color: 'rgba(255,255,255,0.7)' },
                { label: 'TIME',     value: stats.timePlayed.replace('h ', 'h ').split(' ')[0], color: 'rgba(255,255,255,0.5)' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="font-stat tabular-nums font-semibold" style={{ fontSize: '1rem', color: stat.color }}>
                    {stat.value}
                  </div>
                  <div className="mt-0.5" style={{ fontSize: '0.5rem', letterSpacing: '0.09em', color: 'rgba(255,255,255,0.22)', textTransform: 'uppercase' }}>
                    {stat.label}
                  </div>
                </div>
              ))}
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
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                {player.loadout.map((item) => (
                  <WeaponCard
                    key={item.slot}
                    item={item}
                    data={weaponData[item.name.toLowerCase()] ?? null}
                    accent={effectiveAccent}
                    compact
                  />
                ))}
              </div>
            )}
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

          {/* ── Performance Graph ── */}
          <div
            className="relative px-4 py-3 flex-1"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
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
              Performance
            </div>
            {player.recentMatchSummary.length >= 2 ? (
              <PerformanceGraph matches={player.recentMatchSummary} compact />
            ) : (
              <div className="flex items-center justify-center py-4" style={{ color: 'rgba(255,255,255,0.2)' }}>
                <span className="font-mono" style={{ fontSize: '0.65rem' }}>No match data</span>
              </div>
            )}
          </div>

          {/* ── Stats with filter tabs ── */}
          <div
            className="relative px-4 py-5"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
          >
            {/* Section label */}
            <div style={{ fontSize: '0.55rem', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', marginBottom: 10 }}>
              Stats
            </div>

            {/* Filter chips */}
            <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
              {([
                { key: 'thisWeek',  label: 'Weekly'   },
                { key: 'last10',    label: 'Last 10'  },
                { key: 'last50',    label: 'Last 50'  },
                { key: 'thisSeason',label: 'Seasonal' },
                { key: 'overall',   label: 'All Time' },
              ] as { key: StatsFilter; label: string }[]).map(({ key, label }) => {
                const active = statsFilter === key;
                return (
                  <button
                    key={key}
                    onClick={() => setStatsFilter(key)}
                    style={{
                      flex: '1 1 0',
                      fontSize: '0.58rem',
                      fontWeight: 700,
                      letterSpacing: '0.04em',
                      padding: '7px 4px',
                      border: active ? `1px solid ${effectiveAccent}60` : '1px solid rgba(255,255,255,0.1)',
                      background: active ? `${effectiveAccent}20` : 'rgba(255,255,255,0.03)',
                      color: active ? effectiveAccent : 'rgba(255,255,255,0.4)',
                      cursor: 'pointer',
                      transition: 'all 0.12s',
                      whiteSpace: 'nowrap',
                      textAlign: 'center',
                    }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            {/* 4 stats — equal-width bordered boxes */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
              {[
                { label: 'K/D',     value: formatKD(filteredStats.kd),                       color: filteredStats.kd >= 1.5 ? effectiveAccent : filteredStats.kd >= 1.0 ? '#e5e5e5' : '#ff4444' },
                { label: 'EXT%',    value: formatPercentage(filteredStats.extractionRate, 1), color: filteredStats.extractionRate >= 60 ? effectiveAccent : '#e5e5e5' },
                { label: 'Matches', value: String(filteredStats.matchesPlayed),               color: 'rgba(255,255,255,0.75)' },
                { label: 'Time',    value: filteredStats.timePlayed.split(' ')[0],             color: 'rgba(255,255,255,0.55)' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  style={{
                    textAlign: 'center',
                    padding: '12px 4px',
                    background: 'rgba(255,255,255,0.025)',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  <div className="font-stat tabular-nums font-bold" style={{ fontSize: '1.125rem', color: stat.color, lineHeight: 1 }}>
                    {stat.value}
                  </div>
                  <div style={{ fontSize: '0.5rem', letterSpacing: '0.09em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginTop: 5 }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Click hint ── */}
          <div
            className="relative px-4 py-3 text-center transition-opacity duration-200 opacity-100 md:opacity-0 md:group-hover:opacity-100"
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
