import { DetailedPlayer } from '@/types';

interface ShellStatsProps {
  player: DetailedPlayer;
  effectiveAccent: string;
}

export function ShellStats({ player, effectiveAccent }: ShellStatsProps) {
  const stats = player.shellStats;
  if (!stats || stats.length === 0) return null;

  // Split into two columns
  const left = stats.filter((_, i) => i % 2 === 0);
  const right = stats.filter((_, i) => i % 2 === 1);

  return (
    <div
      style={{
        background: 'linear-gradient(180deg, rgba(20,20,20,0.9) 0%, rgba(12,12,12,0.95) 100%)',
        border: '1px solid rgba(255,255,255,0.06)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.03), 0 4px 12px rgba(0,0,0,0.4)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          padding: '12px 16px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#e5e5e5', margin: 0 }}>Shell Stats</h2>
      </div>
      <div style={{ padding: '12px 16px', flex: 1, overflow: 'auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px' }}>
          {[left, right].map((col, ci) => (
            <div key={ci} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {col.map((stat) => {
                const pct = Math.round((stat.value / stat.max) * 100);
                return (
                  <div key={stat.label}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 3 }}>
                      <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.55)', letterSpacing: '0.02em' }}>
                        {stat.label}
                      </span>
                      <span style={{ fontSize: '0.65rem', color: '#e5e5e5', fontWeight: 600, fontFamily: 'monospace' }}>
                        {stat.value}
                      </span>
                    </div>
                    <div style={{ height: 2, background: 'rgba(255,255,255,0.08)', position: 'relative' }}>
                      <div
                        style={{
                          position: 'absolute',
                          left: 0,
                          top: 0,
                          height: '100%',
                          width: `${pct}%`,
                          background: effectiveAccent,
                          opacity: 0.8,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
