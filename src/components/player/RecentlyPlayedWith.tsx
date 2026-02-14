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
      <div className="px-5 py-3.5 border-b border-border/40 bg-background-elevated/30">
        <h2 className="text-lg font-semibold text-text-primary">Recently Played With</h2>
      </div>

      {/* Grid */}
      <div className="divide-y divide-border/30">
        {players.map((player) => (
          <Link
            key={player.playerId}
            href={`/player/${player.playerId}`}
            className="block px-5 py-3 table-row-hover"
          >
            <div className="grid grid-cols-4 gap-4 items-center">
              <div className="col-span-1">
                <div className="text-text-primary font-medium hover:text-accent-primary transition-colors text-sm">
                  {player.playerName}
                </div>
              </div>
              <div className="col-span-1 text-center">
                <div className="stat-label mb-0.5">Matches</div>
                <div className="text-text-primary font-mono tabular-nums text-sm">
                  {player.matchesTogether}
                </div>
              </div>
              <div className="col-span-1 text-center">
                <div className="stat-label mb-0.5">Extract Rate</div>
                <div className="text-accent-primary font-mono tabular-nums text-sm">
                  {formatPercentage(player.winRateTogether)}
                </div>
              </div>
              <div className="col-span-1 text-center">
                <div className="stat-label mb-0.5">KDA</div>
                <div className="text-text-primary font-mono tabular-nums text-sm">
                  {formatKD(player.kdaTogether)}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
