'use client';

import { RunnerType } from '@/types';
import { RUNNER_ABILITIES, ABILITY_SYMBOLS } from '@/lib/runner-abilities';

interface RunnerAbilitiesCompactProps {
  runner: RunnerType;
  effectiveAccent: string;
}

export function RunnerAbilitiesCompact({ runner, effectiveAccent }: RunnerAbilitiesCompactProps) {
  const abilities = RUNNER_ABILITIES[runner] ?? [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {abilities.map((ability) => (
        <div
          key={ability.type}
          style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: 6,
            padding: '4px 6px',
            background: 'rgba(255,255,255,0.02)',
            border: `1px solid ${effectiveAccent}0d`,
          }}
        >
          {/* Symbol */}
          <span
            style={{
              color: effectiveAccent,
              fontSize: '0.55rem',
              flexShrink: 0,
              lineHeight: 1.5,
              opacity: 0.75,
            }}
          >
            {ABILITY_SYMBOLS[ability.type]}
          </span>
          {/* Ability name */}
          <span
            style={{
              fontSize: '0.575rem',
              color: '#e5e5e5',
              fontWeight: 600,
              flexShrink: 0,
              whiteSpace: 'nowrap',
            }}
          >
            {ability.name}
          </span>
          {/* Separator + summary */}
          <span
            style={{
              fontSize: '0.525rem',
              color: 'rgba(255,255,255,0.28)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              flex: 1,
            }}
          >
            · {ability.summary}
          </span>
        </div>
      ))}
    </div>
  );
}
