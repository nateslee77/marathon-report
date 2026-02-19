'use client';

import Link from 'next/link';
import Image from 'next/image';
import { DetailedPlayer } from '@/types';
import { RUNNER_VISUALS } from '@/lib/runners';
import { formatKD, formatPercentage } from '@/lib/utils';
import { RankBadge } from '@/components/ui/RankBadge';
import { BadgeIcon } from '@/components/ui/BadgeIcon';
import { PlayerAvatar } from '@/components/ui/PlayerAvatar';
import { useApp } from '@/context/AppContext';
import { getBadgeById, PINNACLE_BADGE } from '@/lib/badges';
import { playerBadges } from '@/lib/mock-data';

interface MobilePlayerCardProps {
  player: DetailedPlayer;
  isCenter?: boolean;
}

export function MobilePlayerCard({ player, isCenter = false }: MobilePlayerCardProps) {
  const { user, cardThemeColor, equippedBadges, isPinnacle } = useApp();
  const isOwnCard = user?.id === player.id;
  const runner = RUNNER_VISUALS[player.runner];
  const playerThemeColor = isOwnCard && cardThemeColor ? cardThemeColor : player.themeColor;
  const effectiveAccent = playerThemeColor ?? runner.accent;
  const useCustomTheme = !!playerThemeColor;
  const stats = player.stats.overall;

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

  const displayBadges = isOwnCard
    ? equippedBadges.map(getBadgeById).filter(Boolean)
    : (playerBadges[player.id] || []).map(getBadgeById).filter(Boolean);

  return (
    <Link
      href={`/player/${player.id}/details`}
      className="block group"
      style={{ textDecoration: 'none' }}
    >
      <div
        style={{
          background: 'linear-gradient(180deg, rgba(16,16,16,0.95) 0%, rgba(10,10,10,0.98) 100%)',
          border: `1px solid ${isCenter ? effectiveAccent + '1a' : 'rgba(255,255,255,0.05)'}`,
          boxShadow: isCenter
            ? `0 0 20px ${effectiveAccent}06, 0 2px 8px rgba(0,0,0,0.4)`
            : '0 2px 8px rgba(0,0,0,0.3)',
          overflow: 'hidden',
        }}
      >
        {/* ── Emblem Banner ── */}
        <div
          className="relative overflow-hidden"
          style={{ height: 80, background: emblemGradient }}
        >
          {/* Badges */}
          {displayBadges.length > 0 && (
            <div
              style={{
                position: 'absolute',
                top: 6,
                left: 10,
                zIndex: 10,
                display: 'flex',
                gap: 3,
              }}
            >
              {displayBadges.map((badge) => badge && (
                <BadgeIcon key={badge.id} badge={badge} size="sm" variant="tag" />
              ))}
            </div>
          )}

          {/* Runner silhouette */}
          <div
            className="absolute top-0 right-0"
            style={{ width: 70, height: 80, opacity: 0.4, transform: 'scaleX(-1)' }}
          >
            <Image
              src={runner.image}
              alt={runner.name}
              fill
              style={{ objectFit: 'cover', objectPosition: 'left top' }}
            />
          </div>

          {/* Vignette */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, transparent 30%, rgba(16,16,16,0.95) 100%)',
          }} />

          {/* Player name + rating overlay */}
          <div style={{ position: 'absolute', bottom: 8, left: 12, right: 12 }}>
            <div className="flex items-end justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <PlayerAvatar
                  src={player.avatar}
                  alt={player.name}
                  width={36}
                  height={36}
                  style={{
                    flexShrink: 0,
                    border: `1px solid ${effectiveAccent}33`,
                    objectFit: 'cover',
                  }}
                />
                <div className="min-w-0">
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-bold text-base tracking-tight text-white truncate">
                      {player.name}
                    </span>
                    <span className="font-mono text-[0.6rem] text-white/40">
                      {player.tag}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span
                      className="font-mono text-[0.6rem] font-semibold uppercase"
                      style={{ color: effectiveAccent }}
                    >
                      {runner.name}
                    </span>
                    <span className="font-mono text-[0.55rem] text-white/30">Lvl {player.level}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
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
          </div>
        </div>

        {/* ── Core Stats ── */}
        <div
          className="grid grid-cols-3 gap-0"
          style={{
            padding: '8px 12px',
            borderBottom: '1px solid rgba(255,255,255,0.04)',
            background: useCustomTheme ? `radial-gradient(ellipse at 50% 20%, ${effectiveAccent}22 0%, transparent 55%)` : runner.bgGradient,
          }}
        >
          {[
            { label: 'K/D', value: formatKD(stats.kd), color: stats.kd >= 1.5 ? effectiveAccent : stats.kd >= 1.0 ? '#e5e5e5' : '#ff4444', bold: true },
            { label: 'EXT%', value: formatPercentage(stats.extractionRate, 1), color: stats.extractionRate >= 60 ? effectiveAccent : '#e5e5e5' },
            { label: 'RATING', value: String(player.rating), color: effectiveAccent },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div
                className={`font-stat text-lg tabular-nums leading-none ${stat.bold ? 'font-bold' : 'font-semibold'}`}
                style={{ color: stat.color }}
              >
                {stat.value}
              </div>
              <div
                className="mt-1"
                style={{
                  fontSize: '0.5rem',
                  letterSpacing: '0.12em',
                  color: 'rgba(255,255,255,0.28)',
                  textTransform: 'uppercase',
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* ── Loadout ── */}
        <div style={{ padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
          {player.loadout.length === 0 ? (
            <div className="flex items-center justify-center py-3" style={{ color: 'rgba(255,255,255,0.2)' }}>
              <span className="font-mono" style={{ fontSize: '0.6rem' }}>No loadout configured</span>
            </div>
          ) : (() => {
            const WEAPON_SLOTS = ['primary', 'sidearm', 'weapon3'];
            const weapons = player.loadout.filter(i => WEAPON_SLOTS.includes(i.slot));
            const gadgets = player.loadout.filter(i => !WEAPON_SLOTS.includes(i.slot));
            return (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {/* Weapons — horizontal grid */}
                {weapons.length > 0 && (
                  <div style={{ display: 'grid', gridTemplateColumns: `repeat(${weapons.length}, 1fr)`, gap: 3 }}>
                    {weapons.map((item) => (
                      <div
                        key={item.slot}
                        style={{
                          background: '#0a0a0a',
                          border: '1px solid rgba(255,255,255,0.06)',
                          padding: '5px 4px 4px',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                        }}
                      >
                        {item.image ? (
                          <div style={{ width: '100%', height: 32, position: 'relative', marginBottom: 3 }}>
                            <Image src={item.image} alt={item.name} fill style={{ objectFit: 'contain' }} />
                          </div>
                        ) : (
                          <div style={{ height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', color: `${effectiveAccent}66`, marginBottom: 3 }}>
                            {item.icon}
                          </div>
                        )}
                        <div className="truncate w-full text-center" style={{ fontSize: '0.48rem', color: 'rgba(255,255,255,0.35)' }}>{item.name}</div>
                      </div>
                    ))}
                  </div>
                )}
                {/* Gadgets — compact horizontal row */}
                {gadgets.length > 0 && (
                  <div style={{ display: 'grid', gridTemplateColumns: `repeat(${gadgets.length}, 1fr)`, gap: 3 }}>
                    {gadgets.map((item) => (
                      <div
                        key={item.slot}
                        style={{
                          background: '#0a0a0a',
                          border: '1px solid rgba(255,255,255,0.06)',
                          padding: '4px 6px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 5,
                        }}
                      >
                        <div style={{ fontSize: '0.85rem', lineHeight: 1, flexShrink: 0, color: `${effectiveAccent}99` }}>
                          {item.icon}
                        </div>
                        <div className="truncate" style={{ fontSize: '0.48rem', color: 'rgba(255,255,255,0.35)' }}>{item.name}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })()}
        </div>

        {/* ── Recent Matches ── */}
        <div style={{ padding: '8px 12px 10px' }}>
          {player.recentMatchSummary.length === 0 ? (
            <div className="flex items-center justify-center py-3" style={{ color: 'rgba(255,255,255,0.2)' }}>
              <span className="font-mono" style={{ fontSize: '0.6rem' }}>No recent matches</span>
            </div>
          ) : (
            <div className="space-y-1">
              {player.recentMatchSummary.slice(0, 3).map((match, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between font-mono text-[0.65rem]"
                  style={{
                    padding: '3px 6px',
                    background: 'rgba(255,255,255,0.015)',
                    border: '1px solid rgba(255,255,255,0.03)',
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span
                      style={{
                        color: match.result === 'EXTRACTED' ? '#c2ff0b' : '#ff4444',
                        fontWeight: 700,
                      }}
                    >
                      {match.result === 'EXTRACTED' ? 'EXT' : 'KIA'}
                    </span>
                    <span style={{ color: 'rgba(255,255,255,0.4)' }}>{match.map}</span>
                  </div>
                  <span style={{ color: 'rgba(255,255,255,0.5)' }}>
                    {match.kills}/{match.deaths}/{match.assists}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
