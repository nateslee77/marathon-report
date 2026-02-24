'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { LoadoutItem, WeaponRecord } from '@/types';

interface WeaponCardProps {
  item:    LoadoutItem;
  data:    WeaponRecord | null | undefined;
  accent:  string;
  compact?: boolean;
}

const STAT_ITEMS = [
  { key: 'firepower', label: 'Firepower' },
  { key: 'accuracy',  label: 'Accuracy'  },
  { key: 'handling',  label: 'Handling'  },
  { key: 'range',     label: 'Range'     },
  { key: 'dps',       label: 'DPS'       },
  { key: 'mag',       label: 'Magazine'  },
] as const;

function ModalStatBar({ label, value }: { label: string; value?: number | null }) {
  const pct = value != null ? Math.min(100, Number(value)) : 0;
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{
          fontSize: '0.44rem', letterSpacing: '0.12em', textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-mono)',
        }}>
          {label}
        </span>
        <span style={{
          fontSize: '0.56rem', fontWeight: 700,
          color: value != null ? '#d0d0d0' : 'rgba(255,255,255,0.15)',
          fontFamily: 'var(--font-mono)',
        }}>
          {value ?? '—'}
        </span>
      </div>
      <div style={{ height: 3, background: 'rgba(255,255,255,0.07)', overflow: 'hidden' }}>
        <div style={{
          width: `${pct}%`, height: '100%',
          background: 'linear-gradient(90deg, rgba(194,255,11,0.4), #c2ff0b)',
          transition: 'width 0.45s ease',
        }} />
      </div>
    </div>
  );
}

export function WeaponCard({ item, data, accent, compact = false }: WeaponCardProps) {
  const [open, setOpen]       = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const slotLabel   = item.slot === 'primary' ? 'Primary' : 'Sidearm';
  const mods        = data?.mod_slots
    ? String(data.mod_slots).split(';').map((s: string) => s.trim()).filter(Boolean)
    : [];
  const visibleStats = STAT_ITEMS.filter(s => data?.[s.key] != null);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setOpen(true);
  };

  return (
    <>
      <div
        onClick={handleClick}
        style={{
          background: '#0a0a0a',
          border: `1px solid ${accent}20`,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          cursor: 'pointer',
          transition: 'border-color 0.15s',
        }}
        onMouseEnter={e => (e.currentTarget.style.borderColor = `${accent}50`)}
        onMouseLeave={e => (e.currentTarget.style.borderColor = `${accent}20`)}
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

          {/* Type + ammo badges */}
          {data && (data.type || data.ammo_type) && (
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {data.type && (
                <span style={{
                  fontSize: compact ? '0.44rem' : '0.55rem', fontWeight: 600,
                  color: accent, textTransform: 'uppercase', letterSpacing: '0.08em',
                  padding: compact ? '2px 5px' : '3px 7px', border: `1px solid ${accent}30`,
                }}>
                  {data.type}
                </span>
              )}
              {data.ammo_type && (
                <span style={{
                  fontSize: compact ? '0.44rem' : '0.55rem',
                  color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em',
                  padding: compact ? '2px 5px' : '3px 7px', border: '1px solid rgba(255,255,255,0.1)',
                }}>
                  {data.ammo_type}
                </span>
              )}
            </div>
          )}

          {/* Stats grid — full view only */}
          {!compact && visibleStats.length > 0 && (
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px 10px',
              borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 8,
            }}>
              {visibleStats.map(s => (
                <div key={s.key}>
                  <div style={{ fontSize: '0.5rem', color: 'rgba(255,255,255,0.28)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    {s.label}
                  </div>
                  <div className="font-stat" style={{ fontSize: '0.9rem', color: '#e5e5e5', fontWeight: 600 }}>
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
                <span key={mod} style={{
                  fontSize: '0.4rem', color: 'rgba(255,255,255,0.28)',
                  padding: '1px 4px', border: '1px solid rgba(255,255,255,0.07)',
                  textTransform: 'uppercase', letterSpacing: '0.06em',
                }}>
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

      {/* ── Detail modal ── */}
      {mounted && open && createPortal(
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(8px)' }}
          onClick={() => setOpen(false)}
        >
          <div
            style={{
              width: 'min(480px, 94vw)',
              background: '#0c0c0c',
              border: '1px solid rgba(255,255,255,0.08)',
              borderTop: `2px solid ${accent}88`,
              display: 'flex', flexDirection: 'column',
              maxHeight: '92vh', overflow: 'hidden',
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{
              display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
              padding: '12px 16px',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              flexShrink: 0,
            }}>
              <div>
                <div style={{
                  fontSize: '0.88rem', fontWeight: 700, color: '#f0f0f0',
                  letterSpacing: '0.02em', marginBottom: 5,
                }}>
                  {item.name}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap' }}>
                  <span style={{
                    fontSize: '0.42rem', letterSpacing: '0.1em',
                    color: accent, border: `1px solid ${accent}40`,
                    background: `${accent}10`, padding: '1px 6px',
                    fontFamily: 'var(--font-mono)', textTransform: 'uppercase',
                  }}>
                    {slotLabel}
                  </span>
                  {data?.type && (
                    <span style={{
                      fontSize: '0.42rem', letterSpacing: '0.1em',
                      color: 'rgba(255,255,255,0.3)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      padding: '1px 6px', fontFamily: 'var(--font-mono)',
                    }}>
                      {data.type}
                    </span>
                  )}
                  {data?.ammo_type && (
                    <span style={{
                      fontSize: '0.42rem', letterSpacing: '0.08em',
                      color: 'rgba(255,255,255,0.25)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      padding: '1px 6px', fontFamily: 'var(--font-mono)',
                    }}>
                      {data.ammo_type}
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                style={{
                  color: 'rgba(255,255,255,0.3)', background: 'none',
                  border: 'none', cursor: 'pointer', padding: 4, flexShrink: 0,
                }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>

              {/* Weapon image */}
              <div style={{
                height: 170, position: 'relative', flexShrink: 0,
                background: `radial-gradient(ellipse at 50% 60%, ${accent}08 0%, transparent 70%)`,
                borderBottom: '1px solid rgba(255,255,255,0.05)',
              }}>
                {item.image && (
                  <Image
                    src={item.image} alt={item.name} fill
                    style={{ objectFit: 'contain', padding: '18px 32px' }}
                  />
                )}
                {/* DPS badge */}
                {data?.dps != null && (
                  <div style={{
                    position: 'absolute', bottom: 10, right: 12,
                    background: 'rgba(0,0,0,0.7)',
                    border: `1px solid ${accent}33`,
                    padding: '4px 10px',
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                  }}>
                    <span style={{
                      fontSize: '1.05rem', fontWeight: 800, color: accent,
                      fontFamily: 'var(--font-mono)', lineHeight: 1.1,
                    }}>
                      {data.dps}
                    </span>
                    <span style={{
                      fontSize: '0.36rem', letterSpacing: '0.12em',
                      color: 'rgba(255,255,255,0.28)', fontFamily: 'var(--font-mono)',
                    }}>
                      DPS
                    </span>
                  </div>
                )}
              </div>

              <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 14 }}>

                {/* Description */}
                {data?.description && (
                  <p style={{
                    fontSize: '0.56rem', color: 'rgba(255,255,255,0.35)',
                    lineHeight: 1.65, margin: 0,
                  }}>
                    {data.description}
                  </p>
                )}

                {/* Info pills */}
                {(data?.mag != null || mods.length > 0) && (
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {data?.mag != null && (
                      <span style={{
                        fontSize: '0.44rem', letterSpacing: '0.09em',
                        color: 'rgba(255,255,255,0.32)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        padding: '2px 9px', fontFamily: 'var(--font-mono)',
                      }}>
                        {data.mag} MAG
                      </span>
                    )}
                    {mods.map(mod => (
                      <span key={mod} style={{
                        fontSize: '0.44rem', letterSpacing: '0.09em',
                        color: 'rgba(255,255,255,0.32)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        padding: '2px 9px', fontFamily: 'var(--font-mono)',
                      }}>
                        {mod}
                      </span>
                    ))}
                  </div>
                )}

                {/* Stat bars */}
                {(data?.firepower != null || data?.accuracy != null ||
                  data?.handling != null || data?.range != null) && (
                  <div>
                    <div style={{
                      fontSize: '0.44rem', letterSpacing: '0.12em', textTransform: 'uppercase',
                      color: 'rgba(255,255,255,0.18)', fontFamily: 'var(--font-mono)',
                      marginBottom: 10, paddingBottom: 6,
                      borderBottom: '1px solid rgba(255,255,255,0.05)',
                    }}>
                      BASE STATS
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <ModalStatBar label="FIREPOWER" value={data?.firepower} />
                      <ModalStatBar label="ACCURACY"  value={data?.accuracy} />
                      <ModalStatBar label="HANDLING"  value={data?.handling} />
                      <ModalStatBar label="RANGE"     value={data?.range} />
                    </div>
                    {/* Zoom is a label string (e.g. "4x"), shown as a pill */}
                    {data?.zoom && (
                      <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                        <span style={{
                          fontSize: '0.44rem', letterSpacing: '0.09em',
                          color: 'rgba(255,255,255,0.32)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          padding: '2px 9px', fontFamily: 'var(--font-mono)',
                        }}>
                          ZOOM {data.zoom}
                        </span>
                      </div>
                    )}
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
