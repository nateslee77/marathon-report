import { MatchPlayer } from '@/types';
import { PlayerStatRow } from './PlayerStatRow';

interface TeamBreakdownProps {
  team1: MatchPlayer[];
  team2: MatchPlayer[];
}

export function TeamBreakdown({ team1, team2 }: TeamBreakdownProps) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Team Alpha */}
      <div className="game-card overflow-hidden">
        <div className="px-5 py-3.5 border-b border-border/40 bg-background-elevated/30">
          <h2 className="text-lg font-semibold text-text-primary">Team Alpha</h2>
        </div>
        <div className="px-5 py-2 border-b border-border/30 grid grid-cols-12 gap-4 stat-label">
          <div className="col-span-3">Player</div>
          <div className="col-span-2">K/D/A</div>
          <div className="col-span-2">K/D</div>
          <div className="col-span-2">Damage</div>
          <div className="col-span-3">Objective</div>
        </div>
        <div>
          {team1.map((player) => (
            <PlayerStatRow key={player.playerId} player={player} />
          ))}
        </div>
      </div>

      {/* Team Bravo */}
      <div className="game-card overflow-hidden">
        <div className="px-5 py-3.5 border-b border-border/40 bg-background-elevated/30">
          <h2 className="text-lg font-semibold text-text-primary">Team Bravo</h2>
        </div>
        <div className="px-5 py-2 border-b border-border/30 grid grid-cols-12 gap-4 stat-label">
          <div className="col-span-3">Player</div>
          <div className="col-span-2">K/D/A</div>
          <div className="col-span-2">K/D</div>
          <div className="col-span-2">Damage</div>
          <div className="col-span-3">Objective</div>
        </div>
        <div>
          {team2.map((player) => (
            <PlayerStatRow key={player.playerId} player={player} />
          ))}
        </div>
      </div>
    </div>
  );
}
