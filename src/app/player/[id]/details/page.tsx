'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { detailedPlayers, mockMatches, mockRecentlyPlayedWith, mockWeaponStats, playerBadges } from '@/lib/mock-data';
import { RUNNER_VISUALS } from '@/lib/runners';
import { StatsGrid } from '@/components/player/StatsGrid';
import { RecentMatches } from '@/components/player/RecentMatches';
import { RecentlyPlayedWith } from '@/components/player/RecentlyPlayedWith';
import { formatKD, formatPercentage } from '@/lib/utils';
import { RankBadge } from '@/components/ui/RankBadge';
import { BadgeIcon } from '@/components/ui/BadgeIcon';
import { PlayerAvatar } from '@/components/ui/PlayerAvatar';
import { DetailedPlayer, WeaponRecord } from '@/types';
import { ShellLoadout } from '@/components/player/ShellLoadout';
import { ShellStats } from '@/components/player/ShellStats';
import { PerformanceGraph } from '@/components/player/PerformanceGraph';
import { WeaponCard } from '@/components/player/WeaponCard';
import { useApp } from '@/context/AppContext';
import { getBadgeById, PINNACLE_BADGE } from '@/lib/badges';
import { buildDefaultPlayer } from '@/lib/default-player';
import { EloBadge } from '@/components/ui/EloBadge';
import { EloInfoModal } from '@/components/ui/EloInfoModal';

interface DetailsPageProps {
  params: { id: string };
}

const CARD_BG: React.CSSProperties = {
  background: 'linear-gradient(180deg, rgba(20,20,20,0.9) 0%, rgba(12,12,12,0.95) 100%)',
  border: '1px solid rgba(255,255,255,0.06)',
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.03), 0 4px 12px rgba(0,0,0,0.4)',
};

export default function DetailsPage({ params }: DetailsPageProps) {
  const { user, equippedBadges, cardThemeColor, avatarBorderStyle, selectedAvatar, isPinnacle, youtubeUrl, twitchUrl } = useApp();
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [eloModalOpen, setEloModalOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

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

  const mockPlayer = detailedPlayers[params.id];
  const isOwnProfile = mounted && !mockPlayer && !!user && user.id === params.id;
  const idSlice = params.id.slice(-4).replace(/\D/g, '').padStart(4, '0');
  const player: DetailedPlayer = mockPlayer
    ?? (isOwnProfile
      ? buildDefaultPlayer(user, selectedAvatar)
      : buildDefaultPlayer({ id: params.id, name: 'Unknown Runner', tag: `#${idSlice}` }, ''));

  const runner = RUNNER_VISUALS[player.runner];
  const stats = player.stats.overall;
  const playerThemeColor = isOwnProfile && cardThemeColor ? cardThemeColor : player.themeColor;
  const effectiveAccent = playerThemeColor ?? runner.accent;

  function hexToRgb(hex: string) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
  }
  const emblemGradient = playerThemeColor
    ? (() => {
        const { r, g, b } = hexToRgb(playerThemeColor);
        const dark = `rgb(${Math.round(r * 0.3)},${Math.round(g * 0.3)},${Math.round(b * 0.3)})`;
        const mid = `rgb(${r},${g},${b})`;
        const light = `rgb(${Math.min(255, Math.round(r * 1.3))},${Math.min(255, Math.round(g * 1.3))},${Math.min(255, Math.round(b * 1.3))})`;
        return `linear-gradient(135deg, ${dark} 0%, ${mid} 45%, ${light} 55%, ${dark} 100%)`;
      })()
    : runner.emblemGradient;

  const borderClass = isOwnProfile && avatarBorderStyle !== 'none' ? `avatar-border-${avatarBorderStyle}` : '';
  const borderVars = {
    '--border-color': effectiveAccent,
    '--border-color-dim': effectiveAccent + '88',
    '--border-color-dim2': effectiveAccent + '44',
    '--border-color-light': effectiveAccent + 'cc',
  } as React.CSSProperties;

  const displayBadges = isOwnProfile
    ? equippedBadges.map(getBadgeById).filter(Boolean)
    : (playerBadges[player.id] || []).map(getBadgeById).filter(Boolean);

  const displayYoutubeUrl = isOwnProfile ? youtubeUrl : player.youtubeUrl;
  const displayTwitchUrl = isOwnProfile ? twitchUrl : player.twitchUrl;

  const topWeapons = [...mockWeaponStats].sort((a, b) => b.kills - a.kills).slice(0, 5);
  const maxWeaponKills = topWeapons[0]?.kills ?? 1;

  const primaryWeapon = player.loadout.find(i => i.slot === 'primary');
  const sidearmWeapon = player.loadout.find(i => i.slot === 'sidearm');
  const hasShellUsage = !!(player.shellUsage && player.shellUsage.length > 0);
  const hasWeaponUsage = !isOwnProfile && topWeapons.length > 0;

  // Section header: accent label + fading line
  const SectionHeader = ({ label }: { label: string }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
      <span style={{
        fontSize: '0.55rem',
        fontWeight: 700,
        color: effectiveAccent,
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        flexShrink: 0,
      }}>
        {label}
      </span>
      <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${effectiveAccent}50 0%, rgba(255,255,255,0.04) 100%)` }} />
    </div>
  );

  return (
    <div className="space-y-8 animate-fade-in max-w-[1400px] mx-auto px-4 md:px-0 py-4 md:py-0">

      {/* ── Back link ── */}
      <Link
        href={`/player/${player.id}`}
        className="inline-flex items-center gap-2 text-sm transition-colors duration-150 hover:opacity-80"
        style={{ color: effectiveAccent, minHeight: 44, display: 'inline-flex', alignItems: 'center' }}
      >
        <span style={{ fontSize: '0.75rem' }}>&larr;</span>
        Back to Fireteam
      </Link>

      {/* ── HERO BANNER — identity only ── */}
      <div
        className="relative overflow-hidden"
        style={{ background: emblemGradient, minHeight: 150, border: `1px solid ${effectiveAccent}22` }}
      >
        {!playerThemeColor && (
          <div style={{ position: 'absolute', inset: 0, background: runner.bgGradient }} />
        )}
        <div className="absolute top-0 right-0 bottom-0" style={{ width: 200, opacity: 0.45, transform: 'scaleX(-1)' }}>
          <Image src={runner.image} alt={runner.name} fill style={{ objectFit: 'contain', objectPosition: 'left top' }} />
        </div>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(100deg, rgba(10,10,10,0.85) 40%, rgba(10,10,10,0.2) 100%)' }} />

        <div className="relative px-5 py-6 md:px-8 md:py-8 flex flex-col justify-center" style={{ minHeight: 150 }}>
          {displayBadges.length > 0 && (
            <div className="flex items-center flex-wrap gap-2 mb-3">
              {displayBadges.map((badge) => badge && (
                <BadgeIcon key={badge.id} badge={badge} size="md" variant="tag" />
              ))}
            </div>
          )}

          <div className="flex items-center gap-4">
            <PlayerAvatar
              src={player.avatar}
              alt={player.name}
              width={72}
              height={72}
              className={`md:w-[88px] md:h-[88px] ${borderClass}`}
              style={{ flexShrink: 0, width: 72, height: 72, border: `2px solid ${effectiveAccent}55`, borderRadius: 0, objectFit: 'cover', ...borderVars }}
            />
            <div className="min-w-0">
              <div className="flex items-baseline gap-2 md:gap-3 flex-wrap">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight" style={{ color: '#fff' }}>
                  {player.name}
                </h1>
                <span className="font-mono text-base md:text-lg flex-shrink-0" style={{ color: 'rgba(255,255,255,0.35)' }}>
                  {player.tag}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2">
                <span className="font-mono text-xs md:text-sm font-bold" style={{ color: effectiveAccent }}>
                  {runner.name}
                </span>
                {(player.membership === 'pinnacle' || (isOwnProfile && isPinnacle)) && (
                  <BadgeIcon badge={PINNACLE_BADGE} size="sm" variant="tag" />
                )}
                <span style={{ width: 1, height: 12, background: 'rgba(255,255,255,0.12)', display: 'inline-block' }} />
                <span className="font-mono text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>{player.platform}</span>
                <span className="font-mono text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>Lvl {player.level}</span>
              </div>
              {(displayYoutubeUrl || displayTwitchUrl) && (
                <div className="flex items-center gap-2 mt-2">
                  {displayYoutubeUrl && (
                    <a href={displayYoutubeUrl} target="_blank" rel="noopener noreferrer"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 9px', background: 'rgba(255,0,0,0.12)', border: '1px solid rgba(255,0,0,0.25)', color: '#ff4444', fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', textDecoration: 'none' }}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8zM9.7 15.5V8.5l6.3 3.5-6.3 3.5z"/></svg>
                      YouTube
                    </a>
                  )}
                  {displayTwitchUrl && (
                    <a href={displayTwitchUrl} target="_blank" rel="noopener noreferrer"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 9px', background: 'rgba(145,70,255,0.12)', border: '1px solid rgba(145,70,255,0.25)', color: '#9146ff', fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', textDecoration: 'none' }}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M11.6 6H13v4.5h-1.4V6zm3.8 0H17v4.5h-1.4V6zM2 0L.5 4v16.5H6V24l3.5-3.5H13L21.5 12V0H2zm18 11.5l-3.5 3.5H13l-3 3v-3H4.5V1.5h15.5V11.5z"/></svg>
                      Twitch
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── OVERVIEW — career stats + rank ── */}
      <div style={{ ...CARD_BG, padding: isMobile ? '14px 16px' : '18px 24px' }}>
        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', flexWrap: isMobile ? undefined : 'wrap', alignItems: isMobile ? 'stretch' : 'center', gap: isMobile ? 14 : '16px 0' }}>

          {/* Career stat numbers */}
          <div style={isMobile
            ? { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px 0' }
            : { display: 'flex', flexWrap: 'wrap', flex: 1, gap: '12px 28px' }
          }>
            {[
              { label: 'K/D',        value: formatKD(stats.kd),                       highlight: stats.kd >= 1.5 },
              { label: 'KDA',        value: formatKD(stats.kda),                       highlight: false },
              { label: 'Extraction', value: formatPercentage(stats.extractionRate),    highlight: stats.extractionRate >= 60 },
              { label: 'Win Rate',   value: formatPercentage(stats.winRate),           highlight: false },
              { label: 'Matches',    value: String(stats.matchesPlayed),               highlight: false },
              { label: 'Time Played',value: stats.timePlayed,                          highlight: false },
            ].map((s) => (
              <div key={s.label} style={isMobile ? { textAlign: 'center' } : {}}>
                <div className="font-stat font-bold tabular-nums" style={{ fontSize: isMobile ? '1rem' : '1.3rem', color: s.highlight ? effectiveAccent : '#fff', marginBottom: 3 }}>
                  {s.value}
                </div>
                <div style={{ fontSize: '0.48rem', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          {/* Rank + Elo block */}
          <div style={{
            ...(isMobile
              ? { borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 12 }
              : { borderLeft: '1px solid rgba(255,255,255,0.08)', paddingLeft: 24 }),
            display: 'flex', flexDirection: 'column', gap: 8,
          }}>
            {/* In-game competitive rank */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <RankBadge rank={player.competitiveRank} size="sm" />
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#e5e5e5' }}>{player.competitiveRank}</span>
            </div>

            {/* TRIO + SOLO Elo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div
                style={{ display: 'flex', gap: isMobile ? 24 : 20, cursor: 'pointer', padding: '6px 0', transition: 'opacity 0.12s' }}
                onClick={() => setEloModalOpen(true)}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.8')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
              >
                <div>
                  <div style={{ fontSize: '0.42rem', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4, fontFamily: 'var(--font-mono)' }}>TRIO</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <EloBadge elo={player.trioElo ?? player.rating} size={34} />
                    <span className="font-mono font-bold" style={{ fontSize: '0.95rem', color: effectiveAccent }}>{player.trioElo ?? player.rating}</span>
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.42rem', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4, fontFamily: 'var(--font-mono)' }}>SOLO</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <EloBadge elo={player.soloElo ?? player.rating} size={34} />
                    <span className="font-mono font-bold" style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.5)' }}>{player.soloElo ?? player.rating}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setEloModalOpen(true)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 3, color: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', transition: 'color 0.12s', flexShrink: 0 }}
                onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.6)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.2)')}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M12 8v1M12 12v5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
          </div>

          {mounted && eloModalOpen && <EloInfoModal onClose={() => setEloModalOpen(false)} />}
        </div>
      </div>

      {/* ── SHELL SECTION ── */}
      <div>
        <SectionHeader label="Shell" />
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : hasShellUsage ? '1fr 1fr 1fr' : '1fr 1fr', gap: 16 }}>

          {/* Shell Loadout */}
          <div style={{ ...CARD_BG, display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <h2 style={{ fontSize: '0.65rem', fontWeight: 700, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.12em', textTransform: 'uppercase', margin: 0 }}>Loadout</h2>
            </div>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px 12px', overflow: 'hidden' }}>
              <ShellLoadout
                runner={player.runner}
                effectiveAccent={effectiveAccent}
                slotSize={isMobile ? 60 : 70}
                shellSize={isMobile ? 150 : 200}
              />
            </div>
          </div>

          {/* Shell Stats */}
          <ShellStats player={player} effectiveAccent={effectiveAccent} />

          {/* Shell Usage */}
          {hasShellUsage && (
            <div style={CARD_BG}>
              <div style={{ padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <h2 style={{ fontSize: '0.65rem', fontWeight: 700, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.12em', textTransform: 'uppercase', margin: 0 }}>Usage</h2>
              </div>
              <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                {player.shellUsage!.map((entry) => {
                  const rv = RUNNER_VISUALS[entry.runner];
                  return (
                    <div key={entry.runner} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                      <div style={{ width: 26, height: 36, position: 'relative', flexShrink: 0 }}>
                        <Image src={rv.image} alt={rv.name} fill style={{ objectFit: 'contain', objectPosition: 'top' }} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '0.6rem', fontWeight: 700, color: effectiveAccent, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                          {rv.name}
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 12px' }}>
                          {[
                            { label: 'Usage', value: `${entry.usagePct}%` },
                            { label: 'Kills', value: entry.kills.toLocaleString() },
                            { label: 'EXT Rate', value: formatPercentage(entry.extractionRate) },
                            { label: 'Credits', value: `${Math.round(entry.credits / 1000)}K` },
                          ].map(({ label, value }) => (
                            <div key={label}>
                              <div style={{ fontSize: '0.44rem', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</div>
                              <div className="font-mono" style={{ fontSize: '0.65rem', color: '#e5e5e5', fontWeight: 600 }}>{value}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── WEAPONS SECTION ── */}
      <div>
        <SectionHeader label="Weapons" />
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : hasWeaponUsage ? '1fr 1fr 1fr' : '1fr 1fr', gap: 16 }}>

          {/* Primary weapon */}
          {primaryWeapon ? (
            <WeaponCard
              item={primaryWeapon}
              data={weaponData[primaryWeapon.name.toLowerCase()] ?? null}
              accent={effectiveAccent}
            />
          ) : (
            <div style={{ ...CARD_BG, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
              <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.2)', fontFamily: 'monospace' }}>No primary</span>
            </div>
          )}

          {/* Sidearm */}
          {sidearmWeapon ? (
            <WeaponCard
              item={sidearmWeapon}
              data={weaponData[sidearmWeapon.name.toLowerCase()] ?? null}
              accent={effectiveAccent}
            />
          ) : (
            <div style={{ ...CARD_BG, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
              <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.2)', fontFamily: 'monospace' }}>No sidearm</span>
            </div>
          )}

          {/* Weapon usage */}
          {hasWeaponUsage && (
            <div style={CARD_BG}>
              <div style={{ padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <h2 style={{ fontSize: '0.65rem', fontWeight: 700, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.12em', textTransform: 'uppercase', margin: 0 }}>Most Used</h2>
              </div>
              <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {topWeapons.map((weapon) => {
                  const barW = Math.round((weapon.kills / maxWeaponKills) * 100);
                  return (
                    <div key={weapon.weaponName}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
                        <span style={{ fontSize: '0.6rem', color: '#e5e5e5', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '75%' }}>
                          {weapon.weaponName}
                        </span>
                        <span className="font-mono" style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.4)', flexShrink: 0, marginLeft: 6 }}>
                          {weapon.kills.toLocaleString()} kills
                        </span>
                      </div>
                      <div style={{ height: 2, background: 'rgba(255,255,255,0.07)', position: 'relative' }}>
                        <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${barW}%`, background: effectiveAccent, opacity: 0.55 }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── PERFORMANCE SECTION ── */}
      {player.recentMatchSummary.length >= 2 && (
        <div>
          <SectionHeader label="Performance" />
          <div style={CARD_BG}>
            <div style={{ padding: '16px 20px' }}>
              <PerformanceGraph matches={player.recentMatchSummary} />
            </div>
          </div>
        </div>
      )}

      {/* ── STATS SECTION ── */}
      <div>
        <SectionHeader label="Stats" />
        <StatsGrid stats={player.stats} />
      </div>

      {/* ── HISTORY SECTION ── */}
      <div>
        <SectionHeader label="Match History" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <RecentMatches matches={isOwnProfile ? [] : mockMatches} />
          <RecentlyPlayedWith players={isOwnProfile ? [] : mockRecentlyPlayedWith} />
        </div>
      </div>

    </div>
  );
}
