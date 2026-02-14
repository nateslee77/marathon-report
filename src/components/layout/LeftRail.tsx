'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useApp } from '@/context/AppContext';
import { formatKD, formatPercentage } from '@/lib/utils';
import { SearchBar } from '@/components/search/SearchBar';

export function LeftRail() {
  const { recentPlayers } = useApp();

  return (
    <aside
      className="hidden md:flex"
      style={{
        background: '#111',
        borderRight: '1px solid #222',
        height: '100vh',
        position: 'sticky',
        top: 0,
        overflowY: 'auto',
        overflowX: 'hidden',
        flexDirection: 'column',
      }}
    >
      {/* Logo + Wordmark */}
      <div style={{ padding: '28px 24px 20px' }}>
        <Link href="/" className="flex items-center gap-3 focus-accent">
          <Image
            src="/images/Marathon_Bungie_Icon.svg"
            alt="Marathon Report"
            width={36}
            height={36}
            style={{ flexShrink: 0 }}
          />
          <div>
            <div>
              <span className="text-xl font-bold tracking-tight text-text-primary">
                MARATHON
              </span>
              <span className="text-xl font-bold tracking-tight text-text-tertiary">
                {' '}REPORT
              </span>
            </div>
            <div className="mt-0.5 text-xs text-text-tertiary tracking-widest uppercase">
              Player Intelligence
            </div>
          </div>
        </Link>
      </div>

      {/* Divider */}
      <div style={{ margin: '0 16px', borderTop: '1px solid #1a1a1a' }} />

      {/* Search */}
      <div style={{ padding: '20px 16px 8px' }}>
        <SearchBar variant="rail" />
      </div>

      {/* Recently Viewed */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 24px' }}>
        {recentPlayers.length > 0 && (
          <>
            <div className="stat-label mb-3 px-1">Recently Viewed</div>
            <div className="space-y-1.5">
              {recentPlayers.map((player) => (
                <Link
                  key={player.id}
                  href={`/player/${player.id}`}
                  className="block game-card p-3 group"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 flex-shrink-0 bg-background-base border border-border flex items-center justify-center transition-colors"
                      style={{ transition: 'border-color 150ms' }}
                    >
                      <span className="text-xs text-text-tertiary font-mono">
                        {player.name.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm text-text-primary font-medium truncate transition-colors group-hover:!text-[#c2ff0b]">
                          {player.name}
                        </span>
                        <span className="text-xs text-text-tertiary font-mono">
                          {player.tag}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="text-xs text-text-secondary font-mono tabular-nums">
                          {formatKD(player.kd)} KD
                        </span>
                        <span className="text-xs text-text-tertiary font-mono tabular-nums">
                          {formatPercentage(player.winRate)} EXT
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}

        {recentPlayers.length === 0 && (
          <div className="mt-8 text-center">
            <div className="text-text-tertiary text-xs uppercase tracking-wide mb-2">
              No recent searches
            </div>
            <div className="text-text-tertiary/60 text-xs">
              Search for a player to get started
            </div>
          </div>
        )}
      </div>

      {/* ── Buy Me a Coffee ── */}
      <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(34,34,34,0.4)' }}>
        <div className="flex items-start gap-2.5">
          <div style={{ flexShrink: 0, marginTop: 2 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M17 8h1a4 4 0 0 1 0 8h-1" stroke="#ffaa00" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8z" stroke="#ffaa00" strokeWidth="1.5" fill="rgba(255,170,0,0.1)" />
              <line x1="6" y1="2" x2="6" y2="5" stroke="#ffaa00" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="10" y1="2" x2="10" y2="5" stroke="#ffaa00" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="14" y1="2" x2="14" y2="5" stroke="#ffaa00" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <div style={{ fontSize: '0.7rem', color: '#e5e5e5', fontWeight: 500, marginBottom: 3 }}>
              Support the page & receive a
            </div>
            <div className="flex items-center gap-1 mb-2">
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
                gap: 5,
                padding: '4px 12px',
                fontSize: '0.6rem',
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
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <path d="M17 8h1a4 4 0 0 1 0 8h-1" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" />
                <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8z" stroke="#1a1a1a" strokeWidth="2" fill="rgba(26,26,26,0.15)" />
              </svg>
              Buy me a coffee
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ padding: '10px 20px', borderTop: '1px solid rgba(34,34,34,0.4)', fontSize: '11px', color: '#333' }}>
        v0.1.0 &middot; Not affiliated with Bungie
      </div>
    </aside>
  );
}
