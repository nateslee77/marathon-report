'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { SearchBar } from '@/components/search/SearchBar';
import { DesktopAuthButton } from '@/components/auth/DesktopAuthButton';

export default function HomePage() {
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // March 5th, 2026 10:00 AM PST = 18:00 UTC
  const launchDate = useMemo(() => new Date('2026-03-05T18:00:00Z'), []);

  useEffect(() => {
    function update() {
      const now = new Date();
      const diff = launchDate.getTime() - now.getTime();
      if (diff <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setCountdown({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    }
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [launchDate]);

  return (
    <div className="relative flex flex-col md:mx-[-24px] md:mt-[-24px]">
      {/* ── Info Banner ── */}
      <div style={{ padding: '12px 16px', background: '#0a0a0a' }}>
        <div className="max-w-[1400px] mx-auto">
          <div
            className="game-card"
            style={{ border: '1px solid rgba(194,255,11,0.15)' }}
          >
            <div className="p-4 md:p-5 flex gap-3">
              <div style={{ flexShrink: 0, marginTop: 2 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="#c2ff0b" strokeWidth="1.5" />
                  <line x1="12" y1="16" x2="12" y2="12" stroke="#c2ff0b" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="12" cy="8" r="1" fill="#c2ff0b" />
                </svg>
              </div>
              <div className="flex-1">
                <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.6, marginBottom: 12 }}>
                  Hello, and thank you for visiting Marathon Intel! As we wait for the release of Marathon, I wanted to create a website to keep track of our statistics. Please note that all info currently displayed is placeholder data and will be updated as soon as the Marathon API is released. If you have any questions or would like to leave some suggestions, feel free to use the Google Form below or visit the Discord. Thank you!
                </div>
                <a
                  href="https://forms.gle/i8iPpJpkGqC1x9cR9"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '6px 16px',
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    color: '#0a0a0a',
                    background: '#c2ff0b',
                    border: 'none',
                    cursor: 'pointer',
                    textDecoration: 'none',
                    transition: 'all 150ms',
                  }}
                >
                  Feedback / Suggestions
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Hero Section with Background ── */}
      <div
        className="relative flex flex-col"
        style={{ padding: '0' }}
      >
        {/* Hero image container — responsive, shows full image */}
        <div className="relative">
          {/* The image drives the height; it scales with container width */}
          <Image
            src="/images/newherobanner.png"
            alt="Marathon Intel Hero"
            width={1920}
            height={1080}
            priority
            style={{
              width: '100%',
              height: 'auto',
              display: 'block',
            }}
          />

          {/* Dark overlay for readability + bottom fade */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 1,
              background: 'linear-gradient(180deg, rgba(10,10,10,0.25) 0%, rgba(10,10,10,0.35) 40%, rgba(10,10,10,0.85) 80%, rgba(10,10,10,1) 100%)',
              pointerEvents: 'none',
            }}
          />

          {/* ── Overlay content — positioned over the image ── */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 2,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Sign in button - desktop only */}
            <DesktopAuthButton />

            {/* ── Hero text — centered over the image ── */}
            <div className="flex-1 flex flex-col items-center justify-center px-4 md:px-6">
              <div className="text-center max-w-2xl mx-auto w-full">
                <div className="stat-label mb-2 md:mb-4 tracking-widest" style={{ color: '#c2ff0b' }}>
                  Player Intelligence Platform
                </div>

                <h1 className="text-2xl md:text-4xl font-bold text-text-primary mb-3 md:mb-5 text-balance">
                  Marathon Intel
                </h1>

                {/* Countdown inline */}
                <div className="flex justify-center gap-2 md:gap-3 mb-4 md:mb-8">
                  {[
                    { value: countdown.days, label: 'Days' },
                    { value: countdown.hours, label: 'Hrs' },
                    { value: countdown.minutes, label: 'Min' },
                    { value: countdown.seconds, label: 'Sec' },
                  ].map((unit) => (
                    <div
                      key={unit.label}
                      className="text-center"
                      style={{
                        background: 'rgba(0,0,0,0.5)',
                        border: '1px solid rgba(194,255,11,0.15)',
                        padding: '8px 12px',
                        minWidth: 56,
                        backdropFilter: 'blur(8px)',
                      }}
                    >
                      <div
                        className="font-mono text-xl md:text-3xl font-bold tabular-nums leading-none"
                        style={{ color: '#c2ff0b' }}
                      >
                        {String(unit.value).padStart(2, '0')}
                      </div>
                      <div
                        className="mt-1"
                        style={{
                          fontSize: '0.45rem',
                          letterSpacing: '0.12em',
                          textTransform: 'uppercase',
                          color: 'rgba(255,255,255,0.4)',
                        }}
                      >
                        {unit.label}
                      </div>
                    </div>
                  ))}
                </div>

                <p className="hidden md:block text-sm text-text-secondary max-w-md mx-auto mb-6">
                  Search for any player in the left panel to view detailed performance
                  metrics, match history, fireteam analytics, and more.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Mobile search bar — immediately below hero ── */}
        <div className="md:hidden relative z-20 px-4 -mt-1" style={{ background: '#0a0a0a' }}>
          <SearchBar variant="hero" />
        </div>

        {/* ── Stats ribbon ── */}
        <div className="relative z-10 flex justify-center px-4 pt-6 pb-4 md:py-0 md:pb-16 md:-mt-8">
          <div
            className="inline-flex items-center gap-3 md:gap-8 px-4 md:px-8 py-2.5 md:py-4 game-card"
            style={{ background: 'linear-gradient(180deg, rgba(20,20,20,0.95) 0%, rgba(12,12,12,0.98) 100%)' }}
          >
            <div className="text-center">
              <div className="text-base md:text-xl font-mono font-bold text-text-primary tabular-nums">50K</div>
              <div className="stat-label mt-0.5">Players</div>
            </div>
            <div className="w-px h-6 md:h-8 bg-border/50" />
            <div className="text-center">
              <div className="text-base md:text-xl font-mono font-bold text-text-primary tabular-nums">12.4K</div>
              <div className="stat-label mt-0.5">Matches</div>
            </div>
            <div className="w-px h-6 md:h-8 bg-border/50" />
            <div className="text-center">
              <div className="text-base md:text-xl font-mono font-bold tabular-nums flex items-center gap-1.5" style={{ color: '#c2ff0b' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#c2ff0b', display: 'inline-block', animation: 'pulse-dot 1.5s ease-in-out infinite' }} />
                Live
              </div>
              <div className="stat-label mt-0.5">Updates</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Leaderboard Cards Section ── */}
      <div
        className="relative z-10"
        style={{ padding: '0 16px 48px', background: '#0a0a0a' }}
      >
        <div className="max-w-[1400px] mx-auto">
          <div className="grid md:grid-cols-2 gap-4 md:gap-6">
            {/* Weekly Extractions Leaderboard */}
            <div className="game-card">
              <div
                className="px-4 md:px-5 py-3 flex items-center justify-between"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
              >
                <h2 className="text-base md:text-lg font-semibold" style={{ color: '#e5e5e5' }}>
                  Weekly Extractions
                </h2>
                <span
                  style={{
                    fontSize: '0.55rem',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: '#c2ff0b',
                    border: '1px solid rgba(194,255,11,0.3)',
                    padding: '2px 8px',
                    background: 'rgba(194,255,11,0.08)',
                  }}
                >
                  This Week
                </span>
              </div>
              <div className="p-3 md:p-5 space-y-1.5 md:space-y-2">
                {[
                  { rank: 1, id: 'player-005', name: 'VoidWalker', tag: '#7741', extractions: 147 },
                  { rank: 2, id: 'player-024', name: 'NeonStrike', tag: '#2209', extractions: 132 },
                  { rank: 3, id: 'player-025', name: 'PhantomAce', tag: '#5518', extractions: 124 },
                  { rank: 4, id: 'player-026', name: 'GhostRecon', tag: '#8834', extractions: 118 },
                  { rank: 5, id: 'player-027', name: 'SteelNova', tag: '#1190', extractions: 109 },
                ].map((entry) => (
                  <Link
                    key={entry.rank}
                    href={`/player/${entry.id}`}
                    className="flex items-center justify-between font-mono text-xs md:text-sm transition-all hover:scale-[1.02]"
                    style={{
                      padding: '6px 10px',
                      background: entry.rank <= 3 ? 'rgba(194,255,11,0.04)' : 'rgba(255,255,255,0.02)',
                      border: `1px solid ${entry.rank <= 3 ? 'rgba(194,255,11,0.12)' : 'rgba(255,255,255,0.04)'}`,
                    }}
                  >
                    <div className="flex items-center gap-2 md:gap-3 min-w-0">
                      <span
                        className="font-bold tabular-nums"
                        style={{
                          color: entry.rank <= 3 ? '#c2ff0b' : 'rgba(255,255,255,0.3)',
                          width: 16,
                        }}
                      >
                        {entry.rank}
                      </span>
                      <span className="truncate" style={{ color: '#e5e5e5' }}>{entry.name}</span>
                      <span className="hidden sm:inline" style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem' }}>
                        {entry.tag}
                      </span>
                    </div>
                    <span className="font-bold tabular-nums flex-shrink-0" style={{ color: '#c2ff0b' }}>
                      {entry.extractions}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* All Time Extractions Leaderboard */}
            <div className="game-card">
              <div
                className="px-4 md:px-5 py-3 flex items-center justify-between"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
              >
                <h2 className="text-base md:text-lg font-semibold" style={{ color: '#e5e5e5' }}>
                  All Time Extractions
                </h2>
                <span
                  style={{
                    fontSize: '0.55rem',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: '#ffaa00',
                    border: '1px solid rgba(255,170,0,0.3)',
                    padding: '2px 8px',
                    background: 'rgba(255,170,0,0.08)',
                  }}
                >
                  All Time
                </span>
              </div>
              <div className="p-3 md:p-5 space-y-1.5 md:space-y-2">
                {[
                  { rank: 1, id: 'player-024', name: 'NeonStrike', tag: '#2209', extractions: 8421 },
                  { rank: 2, id: 'player-005', name: 'VoidWalker', tag: '#7741', extractions: 7893 },
                  { rank: 3, id: 'player-028', name: 'IronClad', tag: '#4402', extractions: 7214 },
                  { rank: 4, id: 'player-029', name: 'CyberWraith', tag: '#6615', extractions: 6988 },
                  { rank: 5, id: 'player-025', name: 'PhantomAce', tag: '#5518', extractions: 6541 },
                ].map((entry) => (
                  <Link
                    key={entry.rank}
                    href={`/player/${entry.id}`}
                    className="flex items-center justify-between font-mono text-xs md:text-sm transition-all hover:scale-[1.02]"
                    style={{
                      padding: '6px 10px',
                      background: entry.rank <= 3 ? 'rgba(255,170,0,0.04)' : 'rgba(255,255,255,0.02)',
                      border: `1px solid ${entry.rank <= 3 ? 'rgba(255,170,0,0.12)' : 'rgba(255,255,255,0.04)'}`,
                    }}
                  >
                    <div className="flex items-center gap-2 md:gap-3 min-w-0">
                      <span
                        className="font-bold tabular-nums"
                        style={{
                          color: entry.rank <= 3 ? '#ffaa00' : 'rgba(255,255,255,0.3)',
                          width: 16,
                        }}
                      >
                        {entry.rank}
                      </span>
                      <span className="truncate" style={{ color: '#e5e5e5' }}>{entry.name}</span>
                      <span className="hidden sm:inline" style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem' }}>
                        {entry.tag}
                      </span>
                    </div>
                    <span className="font-bold tabular-nums flex-shrink-0" style={{ color: '#ffaa00' }}>
                      {entry.extractions.toLocaleString()}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Buy Me a Coffee — mobile only (left rail handles desktop) ── */}
        <div className="md:hidden px-4 pb-6">
          <div className="game-card p-4">
            <div className="flex items-start gap-3">
              <div style={{ flexShrink: 0, marginTop: 2 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M17 8h1a4 4 0 0 1 0 8h-1" stroke="#ffaa00" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8z" stroke="#ffaa00" strokeWidth="1.5" fill="rgba(255,170,0,0.1)" />
                  <line x1="6" y1="2" x2="6" y2="5" stroke="#ffaa00" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="10" y1="2" x2="10" y2="5" stroke="#ffaa00" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="14" y1="2" x2="14" y2="5" stroke="#ffaa00" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div style={{ fontSize: '0.75rem', color: '#e5e5e5', fontWeight: 500, marginBottom: 4 }}>
                  Support the page & receive a
                </div>
                <div className="flex items-center gap-1 mb-3">
                  <span
                    style={{
                      fontSize: '0.55rem',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      fontWeight: 600,
                      color: '#ffaa00',
                      background: 'rgba(255,170,0,0.1)',
                      border: '1px solid rgba(255,170,0,0.3)',
                      padding: '1px 6px',
                    }}
                  >
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="#ffaa00" style={{ display: 'inline', marginRight: 2, verticalAlign: '-1px' }}>
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    Donator
                  </span>
                  <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.35)' }}>badge</span>
                </div>
                <a
                  href="https://buymeacoffee.com/sushiboba"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '6px 16px',
                    fontSize: '0.65rem',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    color: '#1a1a1a',
                    background: '#ffaa00',
                    border: 'none',
                    cursor: 'pointer',
                    textDecoration: 'none',
                    transition: 'all 150ms',
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M17 8h1a4 4 0 0 1 0 8h-1" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" />
                    <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8z" stroke="#1a1a1a" strokeWidth="2" fill="rgba(26,26,26,0.15)" />
                  </svg>
                  Buy me a coffee
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
