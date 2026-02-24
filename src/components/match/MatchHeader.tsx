import { Match } from '@/types';
import { getTimeAgo } from '@/lib/utils';

interface MatchHeaderProps {
  match: Match;
}

export function MatchHeader({ match }: MatchHeaderProps) {
  const isExtracted = match.result === 'EXTRACTED';

  return (
    <div
      style={{
        background: 'linear-gradient(180deg, rgba(20,20,20,0.9) 0%, rgba(12,12,12,0.95) 100%)',
        border: `1px solid ${isExtracted ? 'rgba(194,255,11,0.15)' : 'rgba(255,68,68,0.15)'}`,
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.03), 0 4px 12px rgba(0,0,0,0.4)',
        padding: '24px 32px',
      }}
    >
      {/* Map name */}
      <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#fff', margin: '0 0 8px 0' }}>
        {match.map}
      </h1>

      {/* Mode + duration + time ago */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <span
          style={{
            fontSize: '0.6rem',
            fontWeight: 700,
            color: 'rgba(255,255,255,0.4)',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            padding: '3px 8px',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          {match.mode}
        </span>
        <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>{match.duration}</span>
        <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.25)' }}>{getTimeAgo(match.date)}</span>
      </div>

      {/* Centered result badge */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div
          style={{
            padding: '10px 32px',
            background: isExtracted ? 'rgba(194,255,11,0.08)' : 'rgba(255,68,68,0.08)',
            border: `1px solid ${isExtracted ? 'rgba(194,255,11,0.3)' : 'rgba(255,68,68,0.3)'}`,
            fontSize: '0.9rem',
            fontWeight: 700,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: isExtracted ? '#c2ff0b' : '#ff4444',
          }}
        >
          {match.result}
        </div>
      </div>
    </div>
  );
}
