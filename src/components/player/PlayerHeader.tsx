import { Player } from '@/types';
import { Badge } from '../ui/Badge';
import { LastUpdated } from '../ui/LastUpdated';
import { formatPercentage, formatKD } from '@/lib/utils';

interface PlayerHeaderProps {
  player: Player;
}

export function PlayerHeader({ player }: PlayerHeaderProps) {
  const { overall } = player.stats;
  const perfPercent = Math.min((overall.kd / 2.5) * 100, 100);

  return (
    <div className="game-card-accent p-8">
      {/* ── Top row: avatar + identity + updated ── */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-5">
          {/* Avatar */}
          <div className="w-16 h-16 flex-shrink-0 bg-background-base border border-accent-primary/20 flex items-center justify-center">
            <span className="text-2xl text-accent-primary/60 font-mono font-bold">
              {player.name.charAt(0)}
            </span>
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-bold text-text-primary">
                {player.name}
              </h1>
              {player.tag && (
                <span className="text-lg text-text-tertiary font-mono">{player.tag}</span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="default">{player.platform}</Badge>
              <span className="text-sm text-text-secondary">
                Level <span className="text-text-primary font-semibold">{player.level}</span>
              </span>
              <span className="text-sm text-text-tertiary">&middot;</span>
              <span className="text-sm text-text-secondary">
                Rank <span className="text-text-primary font-semibold">#{player.rank.toLocaleString()}</span>
              </span>
            </div>
          </div>
        </div>
        <LastUpdated date={player.lastUpdated} />
      </div>

      {/* ── Active streak callout ── */}
      {overall.currentStreak >= 3 && (
        <div className="mb-6 p-4 border border-accent-primary/20 bg-accent-primary/5">
          <div className="stat-label text-accent-primary mb-1">Active Extraction Streak</div>
          <div className="text-2xl font-mono font-bold text-accent-primary tabular-nums">
            {overall.currentStreak} matches
          </div>
        </div>
      )}

      {/* ── Big stat line ── */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-6 pt-6 border-t border-border/40">
        <div>
          <div className="stat-label mb-1.5">K/D Ratio</div>
          <div className="text-stat font-mono font-semibold tabular-nums text-text-primary">
            {formatKD(overall.kd)}
          </div>
        </div>
        <div>
          <div className="stat-label mb-1.5">Extract Rate</div>
          <div className="text-stat font-mono font-semibold tabular-nums text-accent-primary">
            {formatPercentage(overall.winRate)}
          </div>
        </div>
        <div>
          <div className="stat-label mb-1.5">Matches</div>
          <div className="text-stat font-mono font-semibold tabular-nums text-text-primary">
            {overall.matchesPlayed}
          </div>
        </div>
        <div>
          <div className="stat-label mb-1.5">Best Streak</div>
          <div className="text-stat font-mono font-semibold tabular-nums text-accent-warning">
            {overall.bestStreak}
          </div>
        </div>
        <div>
          <div className="stat-label mb-1.5">Time Played</div>
          <div className="text-stat font-mono font-semibold tabular-nums text-text-primary">
            {overall.timePlayed}
          </div>
        </div>
      </div>

      {/* ── Performance bar ── */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-1.5">
          <span className="stat-label">Performance Rating</span>
          <span className="text-xs text-text-tertiary font-mono tabular-nums">
            {Math.round(perfPercent)}%
          </span>
        </div>
        <div className="perf-bar">
          <div className="perf-bar-fill" style={{ width: `${perfPercent}%` }} />
        </div>
      </div>
    </div>
  );
}
