import Link from 'next/link';
import { TeammateInfo } from '@/types';
import { formatKD, formatPercentage } from '@/lib/utils';

interface TeammateCardProps {
  teammate: TeammateInfo;
  side: 'left' | 'right';
}

export function TeammateCard({ teammate, side }: TeammateCardProps) {
  const perfPercent = Math.min(teammate.kd / 2.5 * 100, 100);

  return (
    <Link href={`/player/${teammate.id}`} className="block">
      <div className="game-card p-5 h-full flex flex-col">
        {/* Header: avatar + identity */}
        <div className="flex items-center gap-3 mb-5">
          {/* Avatar */}
          <div className="w-11 h-11 flex-shrink-0 bg-background-base border border-border flex items-center justify-center">
            <span className="text-sm text-text-tertiary font-mono font-semibold">
              {teammate.name.charAt(0)}
            </span>
          </div>
          <div className="min-w-0">
            <div className="text-base font-semibold text-text-primary truncate">
              {teammate.name}
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-xs text-text-tertiary font-mono">{teammate.tag}</span>
              <span className="text-xs text-text-tertiary">&middot;</span>
              <span className="text-xs text-text-tertiary">{teammate.platform}</span>
            </div>
          </div>
        </div>

        {/* Label */}
        <div className="stat-label mb-3">Fireteam Member</div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-3 mb-5">
          <div>
            <div className="stat-label mb-1">K/D</div>
            <div className="text-lg font-mono font-semibold tabular-nums text-text-primary">
              {formatKD(teammate.kd)}
            </div>
          </div>
          <div>
            <div className="stat-label mb-1">Extract Rate</div>
            <div className="text-lg font-mono font-semibold tabular-nums text-accent-primary">
              {formatPercentage(teammate.winRate)}
            </div>
          </div>
          <div>
            <div className="stat-label mb-1">Matches</div>
            <div className="text-sm font-mono tabular-nums text-text-secondary">
              {teammate.matchesPlayed}
            </div>
          </div>
          <div>
            <div className="stat-label mb-1">Avg Kills</div>
            <div className="text-sm font-mono tabular-nums text-text-secondary">
              {teammate.avgKills.toFixed(1)}
            </div>
          </div>
        </div>

        {/* Performance bar */}
        <div className="mt-auto">
          <div className="perf-bar">
            <div
              className="perf-bar-fill"
              style={{ width: `${perfPercent}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-text-tertiary">Rank #{teammate.rank}</span>
            <span className="text-xs text-text-tertiary">Lv. {teammate.level}</span>
          </div>
        </div>

        {/* Last active */}
        <div className="mt-3 pt-3 border-t border-border/40 text-xs text-text-tertiary">
          Active {teammate.lastActive}
        </div>
      </div>
    </Link>
  );
}
