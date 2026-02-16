import Link from 'next/link';
import { Match } from '@/types';
import { RUNNER_VISUALS } from '@/lib/runners';
import { getResultBadgeClasses, getTimeAgo, formatKD, cn } from '@/lib/utils';

interface MatchRowProps {
  match: Match;
}

export function MatchRow({ match }: MatchRowProps) {
  const { personalStats } = match;

  if (!personalStats) return null;

  const kd =
    personalStats.deaths > 0
      ? personalStats.kills / personalStats.deaths
      : personalStats.kills;

  return (
    <Link
      href={`/match/${match.id}`}
      className="block border-b border-border/20 last:border-b-0 table-row-hover"
    >
      <div className="px-5 py-3 grid grid-cols-12 gap-4 items-center text-sm">
        {/* Result */}
        <div className="col-span-2">
          <span className={getResultBadgeClasses(match.result)}>
            {match.result === 'EXTRACTED' ? 'E' : 'D'}
          </span>
        </div>

        {/* Map & Mode & Runner */}
        <div className="col-span-3">
          <div className="text-text-primary font-medium">{match.map}</div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-text-tertiary">{match.mode}</span>
            {match.runner && (
              <span
                className="font-mono font-semibold uppercase"
                style={{ color: RUNNER_VISUALS[match.runner].accent, fontSize: '0.6rem' }}
              >
                {RUNNER_VISUALS[match.runner].name}
              </span>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="col-span-4 grid grid-cols-3 gap-2 font-mono text-text-secondary tabular-nums">
          <div>
            <span className="text-text-primary">{personalStats.kills}</span>
            <span className="text-text-tertiary">/</span>
            <span className="text-accent-danger">{personalStats.deaths}</span>
            <span className="text-text-tertiary">/</span>
            <span className="text-text-secondary">{personalStats.assists}</span>
          </div>
          <div
            className={cn(
              kd >= 1.5
                ? 'text-accent-primary'
                : kd >= 1.0
                  ? 'text-text-primary'
                  : 'text-accent-danger'
            )}
          >
            {formatKD(kd)} KD
          </div>
          <div className="text-text-secondary">
            {personalStats.damage.toLocaleString()} DMG
          </div>
        </div>

        {/* Squad */}
        <div className="col-span-2 text-text-tertiary text-xs">
          {match.squadMembers && match.squadMembers.length > 0
            ? match.squadMembers.slice(0, 2).join(', ')
            : 'Solo'}
        </div>

        {/* Time */}
        <div className="col-span-1 text-right text-text-tertiary text-xs">
          {getTimeAgo(match.date)}
        </div>
      </div>
    </Link>
  );
}
