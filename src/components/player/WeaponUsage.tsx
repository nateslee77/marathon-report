import { WeaponStats } from '@/types';
import { formatPercentage } from '@/lib/utils';

interface WeaponUsageProps {
  weapons: WeaponStats[];
}

export function WeaponUsage({ weapons }: WeaponUsageProps) {
  const maxKills = Math.max(...weapons.map((w) => w.kills));

  return (
    <div className="game-card overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3.5 border-b border-border/40 bg-background-elevated/30">
        <h2 className="text-lg font-semibold text-text-primary">Weapon Usage</h2>
      </div>

      {/* Weapon List */}
      <div className="divide-y divide-border/30">
        {weapons.map((weapon) => {
          const barWidth = (weapon.kills / maxKills) * 100;

          return (
            <div key={weapon.weaponName} className="px-5 py-3">
              <div className="flex items-center justify-between mb-2">
                <div className="text-text-primary font-medium text-sm">
                  {weapon.weaponName}
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-text-secondary font-mono tabular-nums">
                    {weapon.kills.toLocaleString()} kills
                  </span>
                  {weapon.headshotRate && (
                    <span className="text-text-tertiary text-xs font-mono">
                      {formatPercentage(weapon.headshotRate)} HS
                    </span>
                  )}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="perf-bar">
                <div
                  className="perf-bar-fill"
                  style={{ width: `${barWidth}%` }}
                />
              </div>

              <div className="mt-1 text-xs text-text-tertiary">
                {formatPercentage(weapon.killPercentage)} of total kills
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
