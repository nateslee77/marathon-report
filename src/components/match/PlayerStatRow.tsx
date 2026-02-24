import Link from 'next/link';
import Image from 'next/image';
import { MatchPlayer } from '@/types';
import { RUNNER_VISUALS } from '@/lib/runners';

interface PlayerStatRowProps {
  player: MatchPlayer;
  isExtracted?: boolean;
}

export function PlayerStatRow({ player, isExtracted = false }: PlayerStatRowProps) {
  const runnerVis = player.runner ? RUNNER_VISUALS[player.runner] : null;
  const creditsColor = isExtracted ? '#c2ff0b' : '#ff4444';
  const creditsSign = isExtracted ? '+' : '-';
  const creditsAbs = player.credits != null ? Math.abs(player.credits) : null;

  return (
    <Link
      href={`/player/${player.playerId}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '10px 16px',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
        textDecoration: 'none',
      }}
      className="last:border-b-0 hover:bg-white/[0.02] transition-colors"
    >
      {/* Shell icon */}
      <div style={{ width: 20, height: 28, position: 'relative', flexShrink: 0 }}>
        {runnerVis ? (
          <Image
            src={runnerVis.image}
            alt={runnerVis.name}
            fill
            style={{ objectFit: 'contain', objectPosition: 'top' }}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', background: 'rgba(255,255,255,0.06)' }} />
        )}
      </div>

      {/* Player name + elo */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <span
            style={{
              fontSize: '0.8rem',
              fontWeight: 600,
              color: '#e5e5e5',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {player.playerName}
          </span>
          {player.isTopPerformer && (
            <span style={{ fontSize: '0.48rem', fontWeight: 700, color: '#f5c542', textTransform: 'uppercase', letterSpacing: '0.08em', flexShrink: 0 }}>
              MVP
            </span>
          )}
        </div>
        {player.elo != null && (
          <div style={{ fontSize: '0.5rem', color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace' }}>
            {player.elo}
          </div>
        )}
      </div>

      {/* Credits */}
      {creditsAbs != null && (
        <div className="font-mono" style={{ fontSize: '0.65rem', fontWeight: 700, color: creditsColor, flexShrink: 0 }}>
          {creditsSign}{creditsAbs.toLocaleString()}cr
        </div>
      )}

      {/* K / D(↓downs) / A */}
      <div className="font-mono" style={{ fontSize: '0.7rem', flexShrink: 0, textAlign: 'right', whiteSpace: 'nowrap' }}>
        <span style={{ color: '#e5e5e5' }}>{player.kills}</span>
        <span style={{ color: 'rgba(255,255,255,0.2)' }}>/</span>
        <span style={{ color: '#ff4444' }}>{player.deaths}</span>
        {player.downs != null && (
          <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.55rem' }}>({player.downs}↓)</span>
        )}
        <span style={{ color: 'rgba(255,255,255,0.2)' }}>/</span>
        <span style={{ color: 'rgba(255,255,255,0.5)' }}>{player.assists}</span>
      </div>
    </Link>
  );
}
