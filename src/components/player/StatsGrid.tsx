'use client';

import { useState } from 'react';
import { StatsFilter, PlayerStats } from '@/types';
import { ToggleSwitch } from '../ui/ToggleSwitch';
import { StatCard } from './StatCard';
import { formatPercentage, formatKD } from '@/lib/utils';

interface StatsGridProps {
  stats: {
    overall: PlayerStats;
    last10: PlayerStats;
    last50: PlayerStats;
    thisWeek: PlayerStats;
    thisSeason: PlayerStats;
  };
}

const filterOptions = [
  { value: 'overall' as StatsFilter, label: 'Overall' },
  { value: 'last10' as StatsFilter, label: 'Last 10' },
  { value: 'last50' as StatsFilter, label: 'Last 50' },
  { value: 'thisWeek' as StatsFilter, label: 'This Week' },
  { value: 'thisSeason' as StatsFilter, label: 'Season' },
];

export function StatsGrid({ stats }: StatsGridProps) {
  const [filter, setFilter] = useState<StatsFilter>('overall');
  const currentStats = stats[filter];

  return (
    <div className="space-y-6">
      {/* Filter Toggle */}
      <div className="flex justify-start md:justify-end overflow-x-auto">
        <ToggleSwitch
          options={filterOptions}
          value={filter}
          onChange={setFilter}
        />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        <StatCard
          label="Matches Played"
          value={currentStats.matchesPlayed}
        />
        <StatCard
          label="Extract Rate"
          value={formatPercentage(currentStats.winRate)}
          variant={currentStats.winRate >= 50 ? 'success' : 'default'}
        />
        <StatCard
          label="K/D"
          value={formatKD(currentStats.kd)}
          variant={currentStats.kd >= 1.5 ? 'success' : currentStats.kd >= 1.0 ? 'default' : 'danger'}
        />
        <StatCard
          label="KDA"
          value={formatKD(currentStats.kda)}
        />
        <StatCard
          label="Avg Kills"
          value={currentStats.averageKills.toFixed(1)}
        />
        <StatCard
          label="Avg Deaths"
          value={currentStats.averageDeaths.toFixed(1)}
        />
        <StatCard
          label="Extraction Rate"
          value={formatPercentage(currentStats.extractionRate)}
          variant={currentStats.extractionRate >= 40 ? 'success' : 'default'}
        />
        <StatCard
          label="Best Streak"
          value={currentStats.bestStreak}
          variant="warning"
        />
        <StatCard
          label="Current Streak"
          value={currentStats.currentStreak}
          variant={currentStats.currentStreak >= 3 ? 'success' : 'default'}
        />
        <StatCard
          label="Time Played"
          value={currentStats.timePlayed}
        />
      </div>
    </div>
  );
}
