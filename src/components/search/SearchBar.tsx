'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { PlayerAvatar } from '@/components/ui/PlayerAvatar';
import { SearchPlayer } from '@/types';
import { formatKD } from '@/lib/utils';

interface SearchBarProps {
  variant?: 'rail' | 'hero';
}

export function SearchBar({ variant = 'rail' }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchPlayer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const { addRecentPlayer, recentPlayers, user, selectedAvatar } = useApp();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Debounced search — fires after 300ms, min 3 chars
  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data);
      } catch {
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const showDropdown =
    isFocused &&
    ((query.length === 0 && recentPlayers.length > 0) || query.length >= 2);

  const displayList = query.length === 0 ? recentPlayers.slice(0, 6) : results;

  function selectPlayer(player: SearchPlayer) {
    addRecentPlayer(player);
    setQuery('');
    setIsFocused(false);
    inputRef.current?.blur();
    router.push(`/player/${player.id}`);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (results.length > 0) selectPlayer(results[0]);
  }

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setIsFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isHero = variant === 'hero';

  return (
    <div className="relative">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary">
            {isLoading ? (
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
            placeholder="Search player + tag..."
            className={isHero ? 'search-input search-input-hero pl-9 pr-4' : 'search-input pl-9 pr-4'}
          />
        </div>
      </form>

      {showDropdown && (
        <div ref={dropdownRef} className="search-dropdown">
          {query.length === 0 && (
            <div className="px-3 py-1.5 text-[10px] text-text-tertiary uppercase tracking-wider font-mono border-b border-border">
              Recent
            </div>
          )}

          {query.length >= 2 && !isLoading && results.length === 0 && (
            <div className="px-3 py-4 text-center text-sm text-text-tertiary">
              No players found
            </div>
          )}

          {displayList.map((player) => (
            <button
              key={player.id}
              onClick={() => selectPlayer(player)}
              className="search-suggestion w-full text-left"
            >
              {user?.id === player.id && selectedAvatar ? (
                <PlayerAvatar
                  src={selectedAvatar}
                  alt={player.name}
                  width={32}
                  height={32}
                  className="flex-shrink-0"
                  style={{ width: 32, height: 32, objectFit: 'cover', border: '1px solid rgba(255,255,255,0.08)' }}
                />
              ) : (
                <div className="w-8 h-8 flex-shrink-0 bg-background-surface border border-border flex items-center justify-center">
                  <span className="text-xs text-text-tertiary font-mono">
                    {player.name.charAt(0)}
                  </span>
                </div>
              )}

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-text-primary font-medium truncate">{player.name}</span>
                  <span className="text-text-tertiary text-xs font-mono">{player.tag}</span>
                </div>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="text-xs text-text-tertiary">{player.platform}</span>
                  {player.kd > 0 && (
                    <span className="text-xs text-text-secondary font-mono">{formatKD(player.kd)} KD</span>
                  )}
                </div>
              </div>

              {player.rank > 0 && (
                <div className="text-xs text-text-tertiary font-mono">#{player.rank}</div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
