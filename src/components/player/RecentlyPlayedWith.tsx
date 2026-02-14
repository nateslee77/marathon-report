import Link from 'next/link';
import { RecentlyPlayedWithPlayer } from '@/types';
import { formatPercentage, formatKD } from '@/lib/utils';

interface RecentlyPlayedWithProps {
  players: RecentlyPlayedWithPlayer[];
}

export function RecentlyPlayedWith({ players }: RecentlyPlayedWithProps) {
  return (
    <div className="game-card overflow-hidden">
      {/* Header */}
      <div className="px-4 md:px-5 py-3 md:py-3.5 border-b border-border/40 bg-background-elevated/30">
        <h2 className="text-base md:text-lg font-semibold text-text-primary">Recently Played With</h2>
      </div>

      {/* Player rows */}
      <div className="divide-y divide-border/30">
        {players.map((player) => (
          <Link
            key={player.playerId}
            href={`/player/${player.playerId}`}
            className="block px-3 md:px-5 py-3 table-row-hover"
          >
            <div className="flex items-center justify-between gap-2 md:grid md:grid-cols-4 md:gap-4 md:items-center">
              <div className="min-w-0 flex-1 md:flex-none md:col-span-1">
                <div className="text-text-primary font-medium hover:text-accent-primary transition-colors text-sm truncate">
                  {player.playerName}
                </div>
              </div>
              <div className="flex items-center gap-3 md:contents flex-shrink-0">
                <div className="text-center md:col-span-1">
                  <div className="hidden md:block stat-label mb-0.5">Matches</div>
                  <div className="text-text-primary font-mono tabular-nums text-xs md:text-sm">
                    {player.matchesTogether}
                  </div>
                </div>
                <div className="text-center md:col-span-1">
                  <div className="hidden md:block stat-label mb-0.5">Extract Rate</div>
                  <div className="text-accent-primary font-mono tabular-nums text-xs md:text-sm">
                    {formatPercentage(player.winRateTogether)}
                  </div>
                </div>
                <div className="text-center md:col-span-1">
                  <div className="hidden md:block stat-label mb-0.5">KDA</div>
                  <div className="text-text-primary font-mono tabular-nums text-xs md:text-sm">
                    {formatKD(player.kdaTogether)}
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
