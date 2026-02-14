'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { SearchBar } from '@/components/search/SearchBar';

export default function HomePage() {
  const { user, signIn, signOut } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative flex flex-col md:mx-[-24px] md:mt-[-24px]">
      {/* ── Hero Section with Background ── */}
      <div
        className="relative flex flex-col"
        style={{ padding: '0' }}
      >
        {/* Hero image container — clamped on mobile, full on desktop */}
        <div className="relative h-[32vh] min-h-[200px] max-h-[280px] md:h-auto md:min-h-[calc(100vh-48px)] md:max-h-none flex flex-col">
          {/* Background image */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 0,
              backgroundImage: 'url(/images/904f23205038723.66b3a6eecd27b.jpg)',
              backgroundSize: 'cover',
              backgroundPosition: '46% 30%',
              backgroundRepeat: 'no-repeat',
              pointerEvents: 'none',
            }}
          />
          {/* Dark overlay for readability + bottom fade */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 0,
              background: 'linear-gradient(180deg, rgba(10,10,10,0.35) 0%, rgba(10,10,10,0.5) 50%, rgba(10,10,10,0.92) 85%, rgba(10,10,10,1) 100%)',
              pointerEvents: 'none',
            }}
          />

          {/* ── Desktop Sign In / User Menu (top right) — hidden on mobile (header handles it) ── */}
          <div className="hidden md:flex relative z-50 justify-end px-6 pt-6">
            {!user ? (
              <button
                onClick={signIn}
                style={{
                  padding: '8px 20px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  color: '#e5e5e5',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  cursor: 'pointer',
                  transition: 'all 150ms',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(194,255,11,0.3)';
                  e.currentTarget.style.color = '#c2ff0b';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                  e.currentTarget.style.color = '#e5e5e5';
                }}
              >
                Sign In
              </button>
            ) : (
              <div ref={menuRef} style={{ position: 'relative' }}>
                <button
                  onClick={() => setMenuOpen((v) => !v)}
                  style={{
                    width: 44,
                    height: 44,
                    padding: 0,
                    background: 'transparent',
                    border: '2px solid rgba(194,255,11,0.4)',
                    cursor: 'pointer',
                    overflow: 'hidden',
                    transition: 'all 150ms',
                  }}
                >
                  <Image
                    src={user.avatar}
                    alt={user.name}
                    width={44}
                    height={44}
                    style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </button>

                {menuOpen && (
                  <div
                    className="animate-slide-down"
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 8px)',
                      right: 0,
                      width: 220,
                      background: 'linear-gradient(180deg, rgba(20,20,20,0.98) 0%, rgba(12,12,12,0.99) 100%)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      boxShadow: '0 12px 32px rgba(0,0,0,0.6)',
                      zIndex: 50,
                    }}
                  >
                    <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                      <div className="font-semibold text-sm" style={{ color: '#e5e5e5' }}>
                        {user.name}
                      </div>
                      <div className="font-mono text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
                        {user.tag}
                      </div>
                    </div>
                    <div style={{ padding: '6px 0' }}>
                      <Link
                        href={`/player/${user.id}/details`}
                        onClick={() => setMenuOpen(false)}
                        className="block"
                        style={{
                          padding: '8px 16px',
                          fontSize: '0.8rem',
                          color: '#a1a1a1',
                          textDecoration: 'none',
                          transition: 'all 100ms',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = '#e5e5e5';
                          e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = '#a1a1a1';
                          e.currentTarget.style.background = 'transparent';
                        }}
                      >
                        Profile
                      </Link>
                      <Link
                        href="/settings"
                        onClick={() => setMenuOpen(false)}
                        className="block"
                        style={{
                          padding: '8px 16px',
                          fontSize: '0.8rem',
                          color: '#a1a1a1',
                          textDecoration: 'none',
                          transition: 'all 100ms',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = '#e5e5e5';
                          e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = '#a1a1a1';
                          e.currentTarget.style.background = 'transparent';
                        }}
                      >
                        Settings
                      </Link>
                    </div>
                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '6px 0' }}>
                      <button
                        onClick={() => { signOut(); setMenuOpen(false); }}
                        className="block w-full text-left"
                        style={{
                          padding: '8px 16px',
                          fontSize: '0.8rem',
                          color: '#ff4444',
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          transition: 'all 100ms',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(255,68,68,0.06)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent';
                        }}
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── Hero content ── */}
          <div className="relative z-10 flex-1 flex flex-col items-center justify-end pb-6 md:justify-center md:py-20 max-w-[1400px] mx-auto w-full px-4 md:px-6">
            <div className="text-center max-w-2xl mx-auto w-full">
              {/* Tagline */}
              <div className="stat-label mb-2 md:mb-4 tracking-widest" style={{ color: '#c2ff0b' }}>
                Player Intelligence Platform
              </div>

              <h1 className="text-2xl md:text-4xl font-bold text-text-primary mb-2 md:mb-4 text-balance">
                Marathon Report
              </h1>

              <p className="hidden md:block text-base text-text-secondary max-w-md mx-auto mb-10">
                Search for any player in the left panel to view detailed performance
                metrics, match history, fireteam analytics, and more.
              </p>
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
              <div className="text-base md:text-xl font-mono font-bold text-text-primary tabular-nums">342</div>
              <div className="stat-label mt-0.5">Players</div>
            </div>
            <div className="w-px h-6 md:h-8 bg-border/50" />
            <div className="text-center">
              <div className="text-base md:text-xl font-mono font-bold text-text-primary tabular-nums">12.4K</div>
              <div className="stat-label mt-0.5">Matches</div>
            </div>
            <div className="w-px h-6 md:h-8 bg-border/50" />
            <div className="text-center">
              <div className="text-base md:text-xl font-mono font-bold tabular-nums" style={{ color: '#c2ff0b' }}>Live</div>
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
                  { rank: 1, name: 'VoidWalker', tag: '#7741', extractions: 147 },
                  { rank: 2, name: 'NeonStrike', tag: '#2209', extractions: 132 },
                  { rank: 3, name: 'PhantomAce', tag: '#5518', extractions: 124 },
                  { rank: 4, name: 'GhostRecon', tag: '#8834', extractions: 118 },
                  { rank: 5, name: 'SteelNova', tag: '#1190', extractions: 109 },
                ].map((entry) => (
                  <div
                    key={entry.rank}
                    className="flex items-center justify-between font-mono text-xs md:text-sm"
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
                  </div>
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
                  { rank: 1, name: 'NeonStrike', tag: '#2209', extractions: 8421 },
                  { rank: 2, name: 'VoidWalker', tag: '#7741', extractions: 7893 },
                  { rank: 3, name: 'IronClad', tag: '#4402', extractions: 7214 },
                  { rank: 4, name: 'CyberWraith', tag: '#6615', extractions: 6988 },
                  { rank: 5, name: 'PhantomAce', tag: '#5518', extractions: 6541 },
                ].map((entry) => (
                  <div
                    key={entry.rank}
                    className="flex items-center justify-between font-mono text-xs md:text-sm"
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
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
