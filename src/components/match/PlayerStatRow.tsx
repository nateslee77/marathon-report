import Link from 'next/link';
import { MatchPlayer } from '@/types';
import { formatKD, cn } from '@/lib/utils';

interface PlayerStatRowProps {
  player: MatchPlayer;
}

export function PlayerStatRow({ player }: PlayerStatRowProps) {
  const kd =
    player.deaths > 0 ? player.kills / player.deaths : player.kills;

  return (
    <Link
      href={`/player/${player.playerId}`}
      className={cn(
        'block px-5 py-3 border-b border-border/20 last:border-b-0 table-row-hover',
        player.isTopPerformer && 'bg-accent-warning/5 border-l-2 border-l-accent-warning'
      )}
    >
      <div className="grid grid-cols-12 gap-4 items-center text-sm">
        <div className="col-span-3 flex items-center gap-2">
          <span className="text-text-primary font-medium hover:text-accent-primary transition-colors">
            {player.playerName}
          </span>
          {player.isTopPerformer && (
            <span className="text-xs text-accent-warning">MVP</span>
          )}
        </div>
        <div className="col-span-2 font-mono tabular-nums text-text-secondary">
          <span className="text-text-primary">{player.kills}</span>
          <span className="text-text-tertiary"> / </span>
          <span className="text-accent-danger">{player.deaths}</span>
          <span className="text-text-tertiary"> / </span>
          <span className="text-text-secondary">{player.assists}</span>
        </div>
        <div
          className={cn(
            'col-span-2 font-mono tabular-nums',
            kd >= 1.5
              ? 'text-accent-primary'
              : kd >= 1.0
                ? 'text-text-primary'
                : 'text-accent-danger'
          )}
        >
          {formatKD(kd)}
        </div>
        <div className="col-span-2 font-mono tabular-nums text-text-secondary">
          {player.damage.toLocaleString()}
        </div>
        <div className="col-span-3 font-mono tabular-nums text-text-secondary">
          {player.objectiveScore > 0 ? player.objectiveScore.toLocaleString() : '\u2014'}
        </div>
      </div>
    </Link>
  );
}
