import { Match } from '@/types';
import { Badge } from '../ui/Badge';
import { getTimeAgo } from '@/lib/utils';

interface MatchHeaderProps {
  match: Match;
}

export function MatchHeader({ match }: MatchHeaderProps) {
  const team1Score = match.result === 'EXTRACTED' ? 'Extracted' : 'Eliminated';
  const team2Score = match.result === 'EXTRACTED' ? 'Eliminated' : 'Extracted';

  return (
    <div className="game-card-accent p-8">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            {match.map}
          </h1>
          <div className="flex items-center gap-3">
            <Badge variant="default">{match.mode}</Badge>
            <span className="text-sm text-text-secondary">
              Duration: <span className="text-text-primary font-semibold">{match.duration}</span>
            </span>
            <span className="text-sm text-text-tertiary">&middot;</span>
            <span className="text-sm text-text-tertiary">{getTimeAgo(match.date)}</span>
          </div>
        </div>
      </div>

      {/* Match Result */}
      <div className="grid grid-cols-3 gap-4 items-center pt-6 border-t border-border/40">
        <div className="text-center">
          <div className="stat-label mb-2">Team Alpha</div>
          <div className={`text-2xl font-bold ${match.result === 'EXTRACTED' ? 'text-accent-primary' : 'text-accent-danger'}`}>
            {team1Score}
          </div>
        </div>
        <div className="text-center text-text-tertiary text-sm">VS</div>
        <div className="text-center">
          <div className="stat-label mb-2">Team Bravo</div>
          <div className={`text-2xl font-bold ${match.result === 'ELIMINATED' ? 'text-accent-primary' : 'text-accent-danger'}`}>
            {team2Score}
          </div>
        </div>
      </div>
    </div>
  );
}
