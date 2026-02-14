import { Match } from '@/types';
import { MatchRow } from './MatchRow';

interface RecentMatchesProps {
  matches: Match[];
}

export function RecentMatches({ matches }: RecentMatchesProps) {
  return (
    <div className="game-card overflow-hidden">
      {/* Header */}
      <div className="px-4 md:px-5 py-3 md:py-3.5 border-b border-border/40 bg-background-elevated/30">
        <h2 className="text-base md:text-lg font-semibold text-text-primary">Recent Matches</h2>
      </div>

      {/* Scrollable table area for mobile */}
      <div className="overflow-x-auto">
        <div style={{ minWidth: 600 }}>
          {/* Column Headers */}
          <div className="px-5 py-2 border-b border-border/30 grid grid-cols-12 gap-4 stat-label">
            <div className="col-span-2">Result</div>
            <div className="col-span-3">Match</div>
            <div className="col-span-4">Performance</div>
            <div className="col-span-2">Squad</div>
            <div className="col-span-1 text-right">Time</div>
          </div>

          {/* Match Rows */}
          <div>
            {matches.map((match) => (
              <MatchRow key={match.id} match={match} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
