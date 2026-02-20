'use client';

import { RunnerType } from '@/types';
import { RUNNER_ABILITIES, ABILITY_LABELS, ABILITY_SYMBOLS } from '@/lib/runner-abilities';

interface RunnerAbilitiesCardProps {
  runner: RunnerType;
  effectiveAccent: string;
}

export function RunnerAbilitiesCard({ runner, effectiveAccent }: RunnerAbilitiesCardProps) {
  const abilities = RUNNER_ABILITIES[runner] ?? [];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
      {abilities.map((ability) => (
        <div
          key={ability.type}
          style={{
            background: 'rgba(255,255,255,0.02)',
            border: `1px solid ${effectiveAccent}14`,
            padding: '9px 10px',
          }}
        >
          {/* Symbol + type label */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 6 }}>
            <span
              style={{
                color: effectiveAccent,
                fontSize: '0.6rem',
                opacity: 0.7,
                lineHeight: 1,
                flexShrink: 0,
              }}
            >
              {ABILITY_SYMBOLS[ability.type]}
            </span>
            <span
              style={{
                fontSize: '0.44rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: effectiveAccent,
                opacity: 0.55,
                fontWeight: 700,
              }}
            >
              {ABILITY_LABELS[ability.type]}
            </span>
          </div>

          {/* Name */}
          <div
            style={{
              fontSize: '0.6rem',
              color: '#e5e5e5',
              fontWeight: 700,
              marginBottom: 4,
              lineHeight: 1.3,
            }}
          >
            {ability.name}
          </div>

          {/* Summary */}
          <div
            style={{
              fontSize: '0.52rem',
              color: 'rgba(255,255,255,0.35)',
              lineHeight: 1.45,
            }}
          >
            {ability.summary}
          </div>
        </div>
      ))}
    </div>
  );
}
