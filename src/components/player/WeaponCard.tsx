import Image from 'next/image';
import { LoadoutItem, WeaponRecord } from '@/types';

interface WeaponCardProps {
  item: LoadoutItem;
  data: WeaponRecord | null | undefined;
  accent: string;
  compact?: boolean;
}

const STAT_ITEMS = [
  { key: 'firepower', label: 'Firepower' },
  { key: 'accuracy',  label: 'Accuracy' },
  { key: 'handling',  label: 'Handling' },
  { key: 'range',     label: 'Range' },
  { key: 'dps',       label: 'DPS' },
  { key: 'mag',       label: 'Magazine' },
] as const;

export function WeaponCard({ item, data, accent, compact = false }: WeaponCardProps) {
  const slotLabel = item.slot === 'primary' ? 'Primary' : 'Sidearm';
  const mods = data?.mod_slots
    ? data.mod_slots.split(';').map(s => s.trim()).filter(Boolean)
    : [];

  const visibleStats = STAT_ITEMS.filter(s => data?.[s.key] != null);

  return (
    <div
      style={{
        background: '#0a0a0a',
        border: `1px solid ${accent}20`,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Weapon image */}
      {item.image && (
        <div style={{ width: '100%', aspectRatio: compact ? '16 / 7' : '16 / 5', position: 'relative', borderBottom: `1px solid ${accent}10` }}>
          <Image src={item.image} alt={item.name} fill style={{ objectFit: 'contain' }} />
        </div>
      )}

      <div style={{ padding: compact ? '8px 10px' : '10px 14px', display: 'flex', flexDirection: 'column', gap: compact ? 5 : 8 }}>
        {/* Name + slot label */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 4 }}>
          <span style={{ fontSize: compact ? '0.65rem' : '0.8rem', fontWeight: 700, color: '#e5e5e5', lineHeight: 1.2 }}>
            {item.name}
          </span>
          <span style={{ fontSize: compact ? '0.42rem' : '0.5rem', color: 'rgba(255,255,255,0.22)', textTransform: 'uppercase', letterSpacing: '0.1em', flexShrink: 0, marginTop: 1 }}>
            {slotLabel}
          </span>
        </div>

        {/* Type + ammo type badges */}
        {data && (data.type || data.ammo_type) && (
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {data.type && (
              <span
                style={{
                  fontSize: compact ? '0.44rem' : '0.55rem',
                  fontWeight: 600,
                  color: accent,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  padding: compact ? '2px 5px' : '3px 7px',
                  border: `1px solid ${accent}30`,
                }}
              >
                {data.type}
              </span>
            )}
            {data.ammo_type && (
              <span
                style={{
                  fontSize: compact ? '0.44rem' : '0.55rem',
                  color: 'rgba(255,255,255,0.4)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  padding: compact ? '2px 5px' : '3px 7px',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                {data.ammo_type}
              </span>
            )}
          </div>
        )}

        {/* Stats grid — full view only */}
        {!compact && visibleStats.length > 0 && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '8px 10px',
              borderTop: '1px solid rgba(255,255,255,0.06)',
              paddingTop: 8,
            }}
          >
            {visibleStats.map(s => (
              <div key={s.key}>
                <div style={{ fontSize: compact ? '0.4rem' : '0.5rem', color: 'rgba(255,255,255,0.28)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  {s.label}
                </div>
                <div className={compact ? 'font-mono' : 'font-stat'} style={{ fontSize: compact ? '0.6rem' : '0.9rem', color: '#e5e5e5', fontWeight: 600 }}>
                  {data![s.key]}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Mod slots — full view only */}
        {!compact && mods.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3, borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: 4 }}>
            {mods.map(mod => (
              <span
                key={mod}
                style={{
                  fontSize: '0.4rem',
                  color: 'rgba(255,255,255,0.28)',
                  padding: '1px 4px',
                  border: '1px solid rgba(255,255,255,0.07)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                }}
              >
                {mod}
              </span>
            ))}
          </div>
        )}

        {/* Description — full view only */}
        {!compact && data?.description && (
          <div style={{ fontSize: '0.48rem', color: 'rgba(255,255,255,0.3)', lineHeight: 1.4, borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: 4 }}>
            {data.description}
          </div>
        )}
      </div>
    </div>
  );
}
