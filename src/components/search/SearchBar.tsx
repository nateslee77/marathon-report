'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { PlayerAvatar } from '@/components/ui/PlayerAvatar';
import { SuggestResult, SearchPlayer } from '@/types';

interface SearchBarProps {
  variant?: 'rail' | 'hero';
}

function suggestToSearchPlayer(r: SuggestResult): SearchPlayer {
  return {
    id: r.membershipId,
    name: r.displayName,
    tag: r.displayNameCode ? `#${String(r.displayNameCode).padStart(4, '0')}` : '',
    platform: r.platform,
    rank: 0,
    kd: 0,
    winRate: 0,
    competitiveRank: 'Unranked',
  };
}

export function SearchBar({ variant = 'rail' }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SuggestResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [resolving, setResolving] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const { addRecentPlayer, recentPlayers, user, selectedAvatar } = useApp();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // ── Debounced suggest (300ms) ──────────────────────────────────────────────
  useEffect(() => {
    const q = query.trim();
    setActiveIndex(-1);

    if (q.length < 1) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(async () => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const res = await fetch(`/api/search/suggest?q=${encodeURIComponent(q)}`, {
          signal: controller.signal,
        });
        if (!res.ok) { setResults([]); return; }
        const data = await res.json();
        setResults(data.results ?? []);
      } catch (err: unknown) {
        if (!(err instanceof Error && err.name === 'AbortError')) setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // ── Show dropdown when focused + has content ───────────────────────────────
  const hasQuery = query.trim().length >= 1;
  const showDropdown =
    isFocused && ((!hasQuery && recentPlayers.length > 0) || hasQuery);

  // ── Navigation helpers ─────────────────────────────────────────────────────
  function goToPlayer(id: string, result: SuggestResult | SearchPlayer) {
    if ('membershipId' in result) {
      addRecentPlayer(suggestToSearchPlayer(result as SuggestResult));
    } else {
      addRecentPlayer(result as SearchPlayer);
    }
    setQuery('');
    setIsFocused(false);
    setActiveIndex(-1);
    inputRef.current?.blur();
    router.push(`/player/${id}`);
  }

  // ── Form submit (Enter key) ────────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;

    // Keyboard-highlighted item takes priority
    if (activeIndex >= 0) {
      if (!hasQuery) {
        const r = recentPlayers[activeIndex];
        if (r) goToPlayer(r.id, r);
      } else {
        const r = results[activeIndex];
        if (r) goToPlayer(r.membershipId, r);
      }
      return;
    }

    // First suggestion
    if (results.length > 0) {
      goToPlayer(results[0].membershipId, results[0]);
      return;
    }

    // Fall back: exact "name#1234" resolve via Bungie API
    const hashIdx = q.lastIndexOf('#');
    if (hashIdx > 0 && /^\d{4}$/.test(q.slice(hashIdx + 1))) {
      setResolving(true);
      try {
        const res = await fetch('/api/search/resolve', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ full_name: q }),
        });
        if (res.ok) {
          const data = await res.json();
          const synth: SuggestResult = {
            membershipId: data.player_id,
            membershipType: data.membership_type ?? 3,
            displayName: q.slice(0, hashIdx),
            displayNameCode: parseInt(q.slice(hashIdx + 1), 10),
            fullName: q,
            platform: 'PC',
            isRegistered: false,
          };
          goToPlayer(data.player_id, synth);
        }
      } catch {
        // ignore — user just doesn't navigate
      } finally {
        setResolving(false);
      }
    }
  }

  // ── Keyboard navigation ────────────────────────────────────────────────────
  function handleKeyDown(e: React.KeyboardEvent) {
    if (!showDropdown) return;
    const listLen = hasQuery ? results.length : recentPlayers.slice(0, 6).length;
    if (listLen === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % listLen);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => (i <= 0 ? listLen - 1 : i - 1));
    } else if (e.key === 'Escape') {
      setIsFocused(false);
      setActiveIndex(-1);
    }
  }

  // ── Click-outside close ────────────────────────────────────────────────────
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setIsFocused(false);
      }
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const isHero = variant === 'hero';
  const isSpinning = isLoading || resolving;

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="relative">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary">
            {isSpinning ? (
              <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            )}
          </div>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onKeyDown={handleKeyDown}
            placeholder="Search runner + tag..."
            className={isHero ? 'search-input search-input-hero pl-9 pr-4' : 'search-input pl-9 pr-4'}
          />
        </div>
      </form>

      {showDropdown && (
        <div ref={dropdownRef} className="search-dropdown">

          {/* ── Recent header ── */}
          {!hasQuery && (
            <div className="px-3 py-1.5 text-[10px] text-text-tertiary uppercase tracking-wider font-mono border-b border-border">
              Recent
            </div>
          )}

          {/* ── Empty state ── */}
          {hasQuery && !isLoading && results.length === 0 && (
            <div className="px-3 py-4 text-center text-sm text-text-tertiary">
              No players found
            </div>
          )}

          {/* ── Recent players ── */}
          {!hasQuery && recentPlayers.slice(0, 6).map((player, idx) => {
            const isOwn = user?.id === player.id;
            const avatarSrc = isOwn ? selectedAvatar : undefined;
            const isActive = activeIndex === idx;

            return (
              <button
                key={player.id}
                onClick={() => goToPlayer(player.id, player)}
                className="search-suggestion w-full text-left"
                style={isActive ? { background: 'rgba(255,255,255,0.06)' } : undefined}
              >
                {avatarSrc ? (
                  <PlayerAvatar
                    src={avatarSrc}
                    alt={player.name}
                    width={32}
                    height={32}
                    className="flex-shrink-0"
                    style={{ width: 32, height: 32, objectFit: 'cover', border: '1px solid rgba(255,255,255,0.08)' }}
                  />
                ) : (
                  <div className="w-8 h-8 flex-shrink-0 bg-background-surface border border-border flex items-center justify-center">
                    <span className="text-xs text-text-tertiary font-mono">
                      {player.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-text-primary font-medium truncate">{player.name}</span>
                    <span className="text-text-tertiary text-xs font-mono">{player.tag}</span>
                  </div>
                  <span className="text-xs text-text-tertiary">{player.platform}</span>
                </div>
              </button>
            );
          })}

          {/* ── Search results ── */}
          {hasQuery && results.map((result, idx) => {
            const isOwn = user?.id === result.membershipId;
            const avatarSrc = isOwn ? selectedAvatar : result.avatar;
            const tag = result.displayNameCode
              ? `#${String(result.displayNameCode).padStart(4, '0')}`
              : '';
            const isActive = activeIndex === idx;

            return (
              <button
                key={result.membershipId}
                onClick={() => goToPlayer(result.membershipId, result)}
                className="search-suggestion w-full text-left"
                style={isActive ? { background: 'rgba(255,255,255,0.06)' } : undefined}
              >
                {avatarSrc ? (
                  <PlayerAvatar
                    src={avatarSrc}
                    alt={result.displayName}
                    width={32}
                    height={32}
                    className="flex-shrink-0"
                    style={{ width: 32, height: 32, objectFit: 'cover', border: '1px solid rgba(255,255,255,0.08)' }}
                  />
                ) : (
                  <div className="w-8 h-8 flex-shrink-0 bg-background-surface border border-border flex items-center justify-center">
                    <span className="text-xs text-text-tertiary font-mono">
                      {result.displayName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-text-primary font-medium truncate">{result.displayName}</span>
                    <span className="text-text-tertiary text-xs font-mono">{tag}</span>
                  </div>
                  <span className="text-xs text-text-tertiary">{result.platform}</span>
                </div>
              </button>
            );
          })}

        </div>
      )}
    </div>
  );
}
