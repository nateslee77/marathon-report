'use client';

import { RunnerType } from '@/types';
import { RUNNER_ABILITIES, ABILITY_LABELS, ABILITY_SYMBOLS } from '@/lib/runner-abilities';

interface RunnerAbilitiesFullProps {
  runner: RunnerType;
  effectiveAccent: string;
}

export function RunnerAbilitiesFull({ runner, effectiveAccent }: RunnerAbilitiesFullProps) {
  const abilities = RUNNER_ABILITIES[runner] ?? [];

  return (
    <div className="grid grid-cols-2 gap-3 p-4 md:p-5">
      {abilities.map((ability) => (
        <div
          key={ability.type}
          style={{
            background: 'rgba(255,255,255,0.02)',
            border: `1px solid ${effectiveAccent}18`,
            padding: '14px 16px',
          }}
        >
          {/* Type label row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 7,
              marginBottom: 10,
            }}
          >
            <span
              style={{
                fontSize: '0.9rem',
                color: effectiveAccent,
                lineHeight: 1,
                opacity: 0.65,
              }}
            >
              {ABILITY_SYMBOLS[ability.type]}
            </span>
            <span
              style={{
                fontSize: '0.5rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: effectiveAccent,
                fontWeight: 700,
                opacity: 0.6,
              }}
            >
              {ABILITY_LABELS[ability.type]}
            </span>
          </div>

          {/* Ability name */}
          <div
            style={{
              fontSize: '0.875rem',
              color: '#e5e5e5',
              fontWeight: 700,
              marginBottom: 5,
              letterSpacing: '-0.01em',
            }}
          >
            {ability.name}
          </div>

          {/* Summary */}
          <div
            style={{
              fontSize: '0.6rem',
              color: effectiveAccent,
              fontWeight: 500,
              marginBottom: 8,
              opacity: 0.75,
              letterSpacing: '0.02em',
            }}
          >
            {ability.summary}
          </div>

          {/* Full description */}
          <div
            style={{
              fontSize: '0.65rem',
              color: 'rgba(255,255,255,0.42)',
              lineHeight: 1.6,
            }}
          >
            {ability.description}
          </div>
        </div>
      ))}
    </div>
  );
}
