import { MatchPlayer } from '@/types';
import { PlayerStatRow } from './PlayerStatRow';

interface TeamBreakdownProps {
  team1: MatchPlayer[];
  team2: MatchPlayer[];
  matchResult: string;
}

const CARD_BG: React.CSSProperties = {
  background: 'linear-gradient(180deg, rgba(20,20,20,0.9) 0%, rgba(12,12,12,0.95) 100%)',
  border: '1px solid rgba(255,255,255,0.06)',
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.03), 0 4px 12px rgba(0,0,0,0.4)',
};

export function TeamBreakdown({ team1, team2, matchResult }: TeamBreakdownProps) {
  const isTeam1Extracted = matchResult === 'EXTRACTED';
  const extracted = isTeam1Extracted ? team1 : team2;
  const eliminated = isTeam1Extracted ? team2 : team1;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Extracted group */}
      <div style={CARD_BG}>
        <div
          style={{
            padding: '10px 16px',
            borderBottom: '1px solid rgba(194,255,11,0.12)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <div style={{ width: 2, height: 14, background: '#c2ff0b', flexShrink: 0 }} />
          <h2
            style={{
              fontSize: '0.65rem',
              fontWeight: 700,
              color: '#c2ff0b',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              margin: 0,
            }}
          >
            EXTRACTED
          </h2>
          <span style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.25)', fontFamily: 'monospace' }}>
            {extracted.length} runners
          </span>
        </div>
        <div>
          {extracted.map((player) => (
            <PlayerStatRow key={player.playerId} player={player} isExtracted />
          ))}
        </div>
      </div>

      {/* Eliminated group */}
      <div style={CARD_BG}>
        <div
          style={{
            padding: '10px 16px',
            borderBottom: '1px solid rgba(255,68,68,0.12)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <div style={{ width: 2, height: 14, background: '#ff4444', flexShrink: 0 }} />
          <h2
            style={{
              fontSize: '0.65rem',
              fontWeight: 700,
              color: '#ff4444',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              margin: 0,
            }}
          >
            ELIMINATED
          </h2>
          <span style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.25)', fontFamily: 'monospace' }}>
            {eliminated.length} runners
          </span>
        </div>
        <div>
          {eliminated.map((player) => (
            <PlayerStatRow key={player.playerId} player={player} isExtracted={false} />
          ))}
        </div>
      </div>
    </div>
  );
}
