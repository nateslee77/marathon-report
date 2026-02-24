import { RunnerType } from '@/types';

export interface ShellStatDef {
  label: string;
  value: number;
  max: number;
}

// Base stats per runner type. Values from example shell stats image, adapted per runner role.
export const RUNNER_BASE_STATS: Record<RunnerType, ShellStatDef[]> = {
  assassin: [
    { label: 'Heat Capacity',     value: 10, max: 30 },
    { label: 'Agility',           value: 25, max: 30 },
    { label: 'Loot Speed',        value: 15, max: 30 },
    { label: 'Melee Damage',      value: 20, max: 30 },
    { label: 'Prime Recovery',    value: 10, max: 30 },
    { label: 'Tactical Recovery', value: 15, max: 30 },
    { label: 'Self-Repair Speed', value: 10, max: 30 },
    { label: 'Finisher Siphon',   value: 20, max: 30 },
    { label: 'Revive Speed',      value: 5,  max: 30 },
    { label: 'Hardware',          value: 10, max: 30 },
    { label: 'Firewall',          value: 15, max: 30 },
    { label: 'Fall Resistance',   value: 20, max: 30 },
    { label: 'Ping Duration',     value: 10, max: 30 },
  ],
  vandal: [
    { label: 'Heat Capacity',     value: 20, max: 30 },
    { label: 'Agility',           value: 15, max: 30 },
    { label: 'Loot Speed',        value: 10, max: 30 },
    { label: 'Melee Damage',      value: 25, max: 30 },
    { label: 'Prime Recovery',    value: 15, max: 30 },
    { label: 'Tactical Recovery', value: 10, max: 30 },
    { label: 'Self-Repair Speed', value: 5,  max: 30 },
    { label: 'Finisher Siphon',   value: 25, max: 30 },
    { label: 'Revive Speed',      value: 10, max: 30 },
    { label: 'Hardware',          value: 20, max: 30 },
    { label: 'Firewall',          value: 10, max: 30 },
    { label: 'Fall Resistance',   value: 15, max: 30 },
    { label: 'Ping Duration',     value: 5,  max: 30 },
  ],
  recon: [
    { label: 'Heat Capacity',     value: 10, max: 30 },
    { label: 'Agility',           value: 20, max: 30 },
    { label: 'Loot Speed',        value: 20, max: 30 },
    { label: 'Melee Damage',      value: 10, max: 30 },
    { label: 'Prime Recovery',    value: 15, max: 30 },
    { label: 'Tactical Recovery', value: 20, max: 30 },
    { label: 'Self-Repair Speed', value: 15, max: 30 },
    { label: 'Finisher Siphon',   value: 10, max: 30 },
    { label: 'Revive Speed',      value: 10, max: 30 },
    { label: 'Hardware',          value: 25, max: 30 },
    { label: 'Firewall',          value: 20, max: 30 },
    { label: 'Fall Resistance',   value: 10, max: 30 },
    { label: 'Ping Duration',     value: 25, max: 30 },
  ],
  destroyer: [
    { label: 'Heat Capacity',     value: 25, max: 30 },
    { label: 'Agility',           value: 5,  max: 30 },
    { label: 'Loot Speed',        value: 5,  max: 30 },
    { label: 'Melee Damage',      value: 30, max: 30 },
    { label: 'Prime Recovery',    value: 20, max: 30 },
    { label: 'Tactical Recovery', value: 10, max: 30 },
    { label: 'Self-Repair Speed', value: 20, max: 30 },
    { label: 'Finisher Siphon',   value: 15, max: 30 },
    { label: 'Revive Speed',      value: 5,  max: 30 },
    { label: 'Hardware',          value: 30, max: 30 },
    { label: 'Firewall',          value: 25, max: 30 },
    { label: 'Fall Resistance',   value: 25, max: 30 },
    { label: 'Ping Duration',     value: 5,  max: 30 },
  ],
  triage: [
    { label: 'Heat Capacity',     value: 15, max: 30 },
    { label: 'Agility',           value: 10, max: 30 },
    { label: 'Loot Speed',        value: 25, max: 30 },
    { label: 'Melee Damage',      value: 10, max: 30 },
    { label: 'Prime Recovery',    value: 25, max: 30 },
    { label: 'Tactical Recovery', value: 25, max: 30 },
    { label: 'Self-Repair Speed', value: 30, max: 30 },
    { label: 'Finisher Siphon',   value: 15, max: 30 },
    { label: 'Revive Speed',      value: 30, max: 30 },
    { label: 'Hardware',          value: 15, max: 30 },
    { label: 'Firewall',          value: 10, max: 30 },
    { label: 'Fall Resistance',   value: 10, max: 30 },
    { label: 'Ping Duration',     value: 20, max: 30 },
  ],
  thief: [
    { label: 'Heat Capacity',     value: 10, max: 30 },
    { label: 'Agility',           value: 30, max: 30 },
    { label: 'Loot Speed',        value: 30, max: 30 },
    { label: 'Melee Damage',      value: 15, max: 30 },
    { label: 'Prime Recovery',    value: 10, max: 30 },
    { label: 'Tactical Recovery', value: 15, max: 30 },
    { label: 'Self-Repair Speed', value: 10, max: 30 },
    { label: 'Finisher Siphon',   value: 20, max: 30 },
    { label: 'Revive Speed',      value: 15, max: 30 },
    { label: 'Hardware',          value: 10, max: 30 },
    { label: 'Firewall',          value: 5,  max: 30 },
    { label: 'Fall Resistance',   value: 25, max: 30 },
    { label: 'Ping Duration',     value: 15, max: 30 },
  ],
  rook: [
    { label: 'Heat Capacity',     value: 20, max: 30 },
    { label: 'Agility',           value: 10, max: 30 },
    { label: 'Loot Speed',        value: 10, max: 30 },
    { label: 'Melee Damage',      value: 20, max: 30 },
    { label: 'Prime Recovery',    value: 20, max: 30 },
    { label: 'Tactical Recovery', value: 15, max: 30 },
    { label: 'Self-Repair Speed', value: 25, max: 30 },
    { label: 'Finisher Siphon',   value: 10, max: 30 },
    { label: 'Revive Speed',      value: 20, max: 30 },
    { label: 'Hardware',          value: 25, max: 30 },
    { label: 'Firewall',          value: 30, max: 30 },
    { label: 'Fall Resistance',   value: 20, max: 30 },
    { label: 'Ping Duration',     value: 10, max: 30 },
  ],
};

/** Get shell stats for a player, optionally applying a flat modifier to all values (from equipment). */
export function getShellStats(runner: RunnerType, modifier = 0): ShellStatDef[] {
  return RUNNER_BASE_STATS[runner].map((s) => ({
    ...s,
    value: Math.min(s.max, Math.max(0, s.value + modifier)),
  }));
}
