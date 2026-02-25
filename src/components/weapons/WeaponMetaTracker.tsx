'use client';

import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';

interface Weapon {
  rank:          number;
  name:          string;
  image:         string | null;
  usage:         number;
  type:          string | null;
  firepower?:    number | null;
  accuracy?:     number | null;
  handling?:     number | null;
  range?:        number | null;
  mag?:          number | null;
  zoom?:         number | null;
  dps?:          number | null;
  description?:  string | null;
  ammo_type?:    string | null;
  mod_slots?:    number | null;
  filteredRank?: number;
}

const RANK_COLORS = ['#c2ff0b', '#a8b8c8', '#c87941'];

// ── Hero weapon card ──────────────────────────────────────────────────────────
function WeaponHeroCard({
  weapon,
  pos,
  onClick,
}: {
  weapon: Weapon;
  pos:    number;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const accent = RANK_COLORS[pos] ?? '#c2ff0b';

  return (
    <div
      style={{
        background: 'rgba(10,10,10,0.95)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderTop: `2px solid ${accent}77`,
        overflow: 'hidden',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      {/* Rank + type */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '9px 11px 4px',
      }}>
        <span style={{
          fontSize: '0.52rem', fontWeight: 800, letterSpacing: '0.1em',
          color: accent, fontFamily: 'var(--font-mono)',
        }}>
          #{pos + 1}
        </span>
        {weapon.type && (
          <span style={{
            fontSize: '0.38rem', letterSpacing: '0.09em',
            color: 'rgba(255,255,255,0.28)',
            border: '1px solid rgba(255,255,255,0.09)',
            padding: '1px 5px', fontFamily: 'var(--font-mono)',
          }}>
            {weapon.type}
          </span>
        )}
      </div>

      {/* Weapon image — rotates on Y-axis on hover */}
      <div style={{
        height: 120,
        position: 'relative',
        overflow: 'visible',
        // Radial glow behind image, rank-accented
        background: `radial-gradient(ellipse at 50% 65%, ${accent}09 0%, transparent 65%)`,
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          // Left side comes forward, right side tilts back
          transform: hovered
            ? 'perspective(500px) rotateY(14deg) scale(1.04)'
            : 'perspective(500px) rotateY(0deg) scale(1)',
          filter: hovered
            ? `drop-shadow(0 0 14px ${accent}66) drop-shadow(0 0 4px ${accent}44)`
            : 'none',
          transition: 'transform 0.4s cubic-bezier(0.23, 1, 0.32, 1), filter 0.35s ease',
          transformOrigin: 'center center',
        }}>
          {weapon.image ? (
            <Image
              src={weapon.image}
              alt={weapon.name}
              fill
              unoptimized
              sizes="(max-width: 768px) 90vw, 25vw"
              style={{ objectFit: 'contain', padding: '10px 14px' }}
            />
          ) : (
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.4rem', color: 'rgba(255,255,255,0.1)',
              fontFamily: 'var(--font-mono)',
            }}>
              NO IMAGE
            </div>
          )}
        </div>
      </div>

      {/* Separator */}
      <div style={{ height: 1, background: 'rgba(255,255,255,0.05)' }} />

      {/* Name + usage — always visible */}
      <div style={{ padding: '9px 12px 12px' }}>
        <div style={{
          fontSize: '0.61rem', fontWeight: 700, color: '#e0e0e0',
          letterSpacing: '0.01em',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          marginBottom: 4,
        }}>
          {weapon.name}
        </div>
        <div style={{
          fontSize: '1.1rem', fontWeight: 800,
          color: accent, fontFamily: 'var(--font-mono)',
          lineHeight: 1, letterSpacing: '-0.01em',
        }}>
          {weapon.usage}%
        </div>
        <div style={{
          marginTop: 3, fontSize: '0.36rem', letterSpacing: '0.1em',
          color: 'rgba(255,255,255,0.18)', fontFamily: 'var(--font-mono)',
        }}>
          PICK RATE
        </div>
      </div>
    </div>
  );
}

// ── Mobile swipe carousel ─────────────────────────────────────────────────────
const SWIPE_THRESHOLD = 60;

function MobileWeaponCarousel({
  weapons,
  onSelect,
}: {
  weapons:  Weapon[];
  onSelect: (w: Weapon) => void;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [dragOffset, setDragOffset]   = useState(0);
  const containerRef  = useRef<HTMLDivElement>(null);
  const touchStartX   = useRef(0);
  const touchStartY   = useRef(0);
  const isHorizontal  = useRef(false);

  const goTo = useCallback((idx: number) => {
    setActiveIndex(Math.max(0, Math.min(idx, weapons.length - 1)));
    setDragOffset(0);
  }, [weapons.length]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onTouchStart = (e: TouchEvent) => {
      touchStartX.current  = e.touches[0].clientX;
      touchStartY.current  = e.touches[0].clientY;
      isHorizontal.current = false;
    };
    const onTouchMove = (e: TouchEvent) => {
      const dx = e.touches[0].clientX - touchStartX.current;
      const dy = e.touches[0].clientY - touchStartY.current;
      if (!isHorizontal.current) {
        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 6) isHorizontal.current = true;
        else if (Math.abs(dy) > 8) return;
        else return;
      }
      e.preventDefault();
      setDragOffset(dx);
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (!isHorizontal.current) return;
      const dx = e.changedTouches[0].clientX - touchStartX.current;
      const dy = e.changedTouches[0].clientY - touchStartY.current;
      if (Math.abs(dy) > Math.abs(dx)) { setDragOffset(0); return; }
      if (Math.abs(dx) >= SWIPE_THRESHOLD) goTo(dx < 0 ? activeIndex + 1 : activeIndex - 1);
      else setDragOffset(0);
      isHorizontal.current = false;
    };

    el.addEventListener('touchstart', onTouchStart, { passive: true  });
    el.addEventListener('touchmove',  onTouchMove,  { passive: false });
    el.addEventListener('touchend',   onTouchEnd,   { passive: true  });
    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove',  onTouchMove);
      el.removeEventListener('touchend',   onTouchEnd);
    };
  }, [activeIndex, goTo]);

  const isDragging = Math.abs(dragOffset) > 1;

  return (
    <div>
      <div ref={containerRef} style={{ overflow: 'hidden', width: '100%' }}>
        <div style={{
          display: 'flex',
          transform: `translateX(calc(-${activeIndex * 100}% + ${dragOffset}px))`,
          transition: isDragging ? 'none' : 'transform 0.3s ease',
          willChange: 'transform',
        }}>
          {weapons.map((weapon, i) => {
            const accent = RANK_COLORS[i] ?? '#c2ff0b';
            return (
              <div
                key={weapon.rank}
                style={{ flexShrink: 0, width: '100%', padding: '0 12px', boxSizing: 'border-box' }}
              >
                <div
                  style={{
                    background: 'rgba(10,10,10,0.95)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    borderTop: `2px solid ${accent}77`,
                    overflow: 'hidden',
                    cursor: 'pointer',
                  }}
                  onClick={() => onSelect(weapon)}
                >
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '9px 11px 4px',
                  }}>
                    <span style={{
                      fontSize: '0.52rem', fontWeight: 800, letterSpacing: '0.1em',
                      color: accent, fontFamily: 'var(--font-mono)',
                    }}>
                      #{i + 1}
                    </span>
                    {weapon.type && (
                      <span style={{
                        fontSize: '0.38rem', letterSpacing: '0.09em',
                        color: 'rgba(255,255,255,0.28)',
                        border: '1px solid rgba(255,255,255,0.09)',
                        padding: '1px 5px', fontFamily: 'var(--font-mono)',
                      }}>
                        {weapon.type}
                      </span>
                    )}
                  </div>

                  <div style={{ height: 140, position: 'relative' }}>
                    {weapon.image && (
                      <Image
                        src={weapon.image} alt={weapon.name} fill unoptimized
                        sizes="90vw"
                        style={{ objectFit: 'contain', padding: '10px 20px' }}
                      />
                    )}
                  </div>

                  <div style={{ height: 1, background: 'rgba(255,255,255,0.05)' }} />

                  <div style={{ padding: '9px 12px 12px' }}>
                    <div style={{
                      fontSize: '0.65rem', fontWeight: 700, color: '#e0e0e0',
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                      marginBottom: 4,
                    }}>
                      {weapon.name}
                    </div>
                    <div style={{
                      fontSize: '1.15rem', fontWeight: 800,
                      color: accent, fontFamily: 'var(--font-mono)', lineHeight: 1,
                    }}>
                      {weapon.usage}%
                    </div>
                    <div style={{
                      marginTop: 3, fontSize: '0.36rem', letterSpacing: '0.1em',
                      color: 'rgba(255,255,255,0.18)', fontFamily: 'var(--font-mono)',
                    }}>
                      PICK RATE
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dot indicators */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 6, padding: '8px 0 2px' }}>
        {weapons.map((_, i) => (
          <div
            key={i}
            onClick={() => goTo(i)}
            style={{
              width: activeIndex === i ? 16 : 6,
              height: 6, borderRadius: 3,
              background: activeIndex === i ? '#c2ff0b' : 'rgba(255,255,255,0.15)',
              transition: 'all 0.2s ease', cursor: 'pointer',
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ── Stat bar for detail modal ─────────────────────────────────────────────────
function StatBar({ label, value }: { label: string; value?: number | null }) {
  const pct = value != null ? Math.min(100, value) : 0;
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

// ── Skeletons ─────────────────────────────────────────────────────────────────
function SkeletonCards() {
  return (
    <div style={{ display: 'flex', gap: 8, padding: '10px 12px' }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{
          flex: '1 1 0', minHeight: 200,
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.05)',
        }} />
      ))}
    </div>
  );
}

function SkeletonRows({ count }: { count: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '7px 12px',
          borderBottom: '1px solid rgba(255,255,255,0.03)',
        }}>
          <div style={{ width: 20, height: 7,  background: 'rgba(255,255,255,0.06)', flexShrink: 0 }} />
          <div style={{ width: 50, height: 26, background: 'rgba(255,255,255,0.04)', flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ height: 7, width: `${48 + (i % 4) * 12}%`, background: 'rgba(255,255,255,0.06)', marginBottom: 5 }} />
          </div>
          <div style={{ width: 34, height: 9, background: 'rgba(255,255,255,0.06)' }} />
        </div>
      ))}
    </>
  );
}

// ── Rank row ──────────────────────────────────────────────────────────────────
function WeaponRankRow({
  weapon, display, barPct, isLast, onClick,
}: {
  weapon:  Weapon;
  display?: number;
  barPct:  number;
  isLast:  boolean;
  onClick: () => void;
}) {
  return (
    <div
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '7px 12px',
        borderBottom: isLast ? 'none' : '1px solid rgba(255,255,255,0.03)',
        cursor: 'pointer', background: 'transparent',
        transition: 'background 0.1s',
      }}
      onClick={onClick}
      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.025)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
    >
      <span style={{
        width: 22, textAlign: 'right', flexShrink: 0,
        fontSize: '0.5rem', fontWeight: 700,
        color: 'rgba(255,255,255,0.12)', fontFamily: 'var(--font-mono)',
      }}>
        {String(display ?? weapon.rank).padStart(2, '0')}
      </span>

      <div style={{
        width: 50, height: 28, flexShrink: 0,
        position: 'relative', overflow: 'hidden',
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.05)',
      }}>
        {weapon.image && (
          <Image
            src={weapon.image} alt={weapon.name} fill unoptimized
            sizes="60px"
            style={{ objectFit: 'contain', padding: 3 }}
          />
        )}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 4 }}>
          <span style={{
            fontSize: '0.58rem', color: '#c0c0c0', letterSpacing: '0.01em',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            maxWidth: 130,
          }}>
            {weapon.name}
          </span>
          {weapon.type && (
            <span style={{
              fontSize: '0.38rem', letterSpacing: '0.07em',
              color: 'rgba(255,255,255,0.18)',
              border: '1px solid rgba(255,255,255,0.07)',
              padding: '1px 4px', flexShrink: 0,
              fontFamily: 'var(--font-mono)',
            }}>
              {weapon.type}
            </span>
          )}
        </div>
        <div style={{ height: 2, background: 'rgba(255,255,255,0.05)', overflow: 'hidden' }}>
          <div style={{
            width: `${barPct}%`, height: '100%',
            background: 'rgba(194,255,11,0.4)',
            transition: 'width 0.4s ease',
          }} />
        </div>
      </div>

      <span style={{
        fontSize: '0.62rem', fontWeight: 700, flexShrink: 0,
        minWidth: 38, textAlign: 'right',
        color: '#c2ff0b', fontFamily: 'var(--font-mono)',
      }}>
        {weapon.usage}%
      </span>
    </div>
  );
}

// ── Mobile full-list bottom-sheet ─────────────────────────────────────────────
function MobileWeaponListModal({
  weapons, activeFilter, maxUsage, onSelect, onClose,
}: {
  weapons:      Weapon[];
  activeFilter: string;
  maxUsage:     number;
  onSelect:     (w: Weapon) => void;
  onClose:      () => void;
}) {
  return createPortal(
    <div
      className="fixed inset-0 z-[105] flex flex-col justify-end"
      style={{ background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#0c0c0c',
          border: '1px solid rgba(255,255,255,0.08)',
          borderTop: '2px solid rgba(194,255,11,0.4)',
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* drag handle */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 4px' }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.12)' }} />
        </div>

        {/* header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '6px 16px 12px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          flexShrink: 0,
        }}>
          <div>
            <div style={{
              fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em',
              color: '#e0e0e0', fontFamily: 'var(--font-rajdhani)',
            }}>
              {activeFilter === 'ALL' ? 'ALL WEAPONS' : activeFilter}
            </div>
            <div style={{
              fontSize: '0.42rem', letterSpacing: '0.1em',
              color: 'rgba(255,255,255,0.25)', fontFamily: 'var(--font-mono)',
              marginTop: 2,
            }}>
              {weapons.length} WEAPONS · BY PICK RATE
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              color: 'rgba(255,255,255,0.3)', background: 'none',
              border: 'none', cursor: 'pointer', padding: 4,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* scrollable list */}
        <div style={{ overflowY: 'auto', flex: 1 }}>
          {weapons.map((weapon, i) => {
            const barPct  = (weapon.usage / maxUsage) * 100;
            const isLast  = i === weapons.length - 1;
            const display = weapon.filteredRank ?? weapon.rank;
            return (
              <WeaponRankRow
                key={weapon.rank}
                weapon={weapon}
                display={display}
                barPct={barPct}
                isLast={isLast}
                onClick={() => { onSelect(weapon); onClose(); }}
              />
            );
          })}
        </div>
      </div>
    </div>,
    document.body
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
const MOBILE_INITIAL_ROWS = 5;

export function WeaponMetaTracker() {
  const [weapons, setWeapons]             = useState<Weapon[]>([]);
  const [loading, setLoading]             = useState(true);
  const [previewWeapon, setPreviewWeapon] = useState<Weapon | null>(null);
  const [activeFilter, setActiveFilter]   = useState('ALL');
  const [mounted, setMounted]             = useState(false);
  const [mobileListOpen, setMobileListOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetch('/api/weapons/meta')
      .then(r => r.json())
      .then((data: Weapon[]) => { setWeapons(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filterTabs = useMemo(() => {
    const types = Array.from(
      new Set(weapons.map(w => w.type).filter(Boolean) as string[])
    ).sort();
    return ['ALL', ...types];
  }, [weapons]);

  const filtered = activeFilter === 'ALL'
    ? weapons
    : weapons.filter(w => w.type === activeFilter);

  const filteredRanked = filtered.map((w, i) => ({ ...w, filteredRank: i + 1 }));
  const top3    = filteredRanked.slice(0, 3);
  const rest    = filteredRanked.slice(3);
  const maxUsage = filtered[0]?.usage ?? 1;

  const mobilePreviewRest = rest.slice(0, MOBILE_INITIAL_ROWS);
  const hasMobileMore     = rest.length > MOBILE_INITIAL_ROWS;

  return (
    <>
      <div className="game-card" style={{ overflow: 'hidden' }}>

        {/* ── Header ── */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '11px 16px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
              <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="#c2ff0b" strokeWidth="1.5" strokeLinejoin="round" />
              <path d="M2 17l10 5 10-5"            stroke="#c2ff0b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M2 12l10 5 10-5"            stroke="#c2ff0b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span style={{
              fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em',
              color: '#e0e0e0', fontFamily: 'var(--font-rajdhani)',
            }}>
              WEAPON META
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {!loading && (
              <span style={{
                fontSize: '0.44rem', letterSpacing: '0.1em',
                color: 'rgba(255,255,255,0.18)', fontFamily: 'var(--font-mono)',
              }}>
                {filtered.length} WEAPONS
              </span>
            )}
            <span style={{
              fontSize: '0.44rem', letterSpacing: '0.14em', color: '#c2ff0b',
              border: '1px solid rgba(194,255,11,0.28)', padding: '2px 8px',
              background: 'rgba(194,255,11,0.07)', fontFamily: 'var(--font-mono)',
            }}>
              THIS WEEK
            </span>
          </div>
        </div>

        {/* ── Filter chips ── */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 5,
          padding: '7px 12px',
          borderBottom: '1px solid rgba(255,255,255,0.04)',
          overflowX: 'auto', scrollbarWidth: 'none',
        }}>
          {(loading ? ['ALL'] : filterTabs).map(tab => {
            const active = activeFilter === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                style={{
                  fontSize: '0.48rem', fontWeight: 700, letterSpacing: '0.09em',
                  padding: '3px 10px', cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0,
                  border:     active ? '1px solid rgba(194,255,11,0.5)' : '1px solid rgba(255,255,255,0.08)',
                  background: active ? 'rgba(194,255,11,0.1)'           : 'transparent',
                  color:      active ? '#c2ff0b'                         : 'rgba(255,255,255,0.3)',
                  transition: 'all 0.12s',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* ── Top-3 section ── */}
        {loading ? (
          <SkeletonCards />
        ) : top3.length > 0 ? (
          <>
            {/* Desktop — 3 equal cards */}
            <div
              className="hidden md:flex"
              style={{ gap: 8, padding: '10px 12px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
            >
              {top3.map((weapon, i) => (
                <div key={weapon.rank} style={{ flex: '1 1 0', minWidth: 0 }}>
                  <WeaponHeroCard
                    weapon={weapon}
                    pos={i}
                    onClick={() => setPreviewWeapon(weapon)}
                  />
                </div>
              ))}
            </div>

            {/* Mobile — swipe carousel */}
            <div
              className="md:hidden"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingTop: 10, paddingBottom: 6 }}
            >
              <MobileWeaponCarousel weapons={top3} onSelect={setPreviewWeapon} />
            </div>
          </>
        ) : null}

        {/* ── Rank list 4+ ── */}

        {/* Desktop — scrollable container */}
        <div
          className="hidden md:block"
          style={{
            maxHeight: 360,
            overflowY: 'auto',
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(255,255,255,0.07) transparent',
          }}
        >
          {loading ? (
            <SkeletonRows count={10} />
          ) : rest.length === 0 && top3.length === 0 ? (
            <div style={{
              padding: '28px 16px', textAlign: 'center',
              color: 'rgba(255,255,255,0.18)', fontSize: '0.58rem',
              fontFamily: 'var(--font-mono)',
            }}>
              NO WEAPONS IN THIS CATEGORY
            </div>
          ) : (
            rest.map((weapon, i) => {
              const barPct  = (weapon.usage / maxUsage) * 100;
              const isLast  = i === rest.length - 1;
              const display = activeFilter === 'ALL' ? weapon.rank : weapon.filteredRank;
              return (
                <WeaponRankRow
                  key={weapon.rank}
                  weapon={weapon}
                  display={display}
                  barPct={barPct}
                  isLast={isLast}
                  onClick={() => setPreviewWeapon(weapon)}
                />
              );
            })
          )}
        </div>

        {/* Mobile — limited rows + View More button */}
        <div className="md:hidden">
          {loading ? (
            <SkeletonRows count={5} />
          ) : rest.length === 0 && top3.length === 0 ? (
            <div style={{
              padding: '28px 16px', textAlign: 'center',
              color: 'rgba(255,255,255,0.18)', fontSize: '0.58rem',
              fontFamily: 'var(--font-mono)',
            }}>
              NO WEAPONS IN THIS CATEGORY
            </div>
          ) : (
            <>
              {mobilePreviewRest.map((weapon, i) => {
                const barPct  = (weapon.usage / maxUsage) * 100;
                const isLast  = i === mobilePreviewRest.length - 1 && !hasMobileMore;
                const display = activeFilter === 'ALL' ? weapon.rank : weapon.filteredRank;
                return (
                  <WeaponRankRow
                    key={weapon.rank}
                    weapon={weapon}
                    display={display}
                    barPct={barPct}
                    isLast={isLast}
                    onClick={() => setPreviewWeapon(weapon)}
                  />
                );
              })}
              {hasMobileMore && (
                <button
                  onClick={() => setMobileListOpen(true)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    background: 'transparent',
                    border: 'none',
                    borderTop: '1px solid rgba(255,255,255,0.05)',
                    cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    color: 'rgba(255,255,255,0.35)',
                    fontSize: '0.48rem', letterSpacing: '0.1em',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                  }}
                >
                  {`VIEW ALL  (${rest.length + 3})`}
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none">
                    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* ── Mobile full-list modal ── */}
      {mounted && mobileListOpen && (
        <MobileWeaponListModal
          weapons={filteredRanked}
          activeFilter={activeFilter}
          maxUsage={maxUsage}
          onSelect={setPreviewWeapon}
          onClose={() => setMobileListOpen(false)}
        />
      )}

      {/* ── Detail modal ── */}
      {mounted && previewWeapon && createPortal(
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(8px)' }}
          onClick={() => setPreviewWeapon(null)}
        >
          <div
            style={{
              width: 'min(480px, 94vw)',
              background: '#0c0c0c',
              border: '1px solid rgba(255,255,255,0.08)',
              borderTop: '2px solid rgba(194,255,11,0.55)',
              display: 'flex', flexDirection: 'column',
              maxHeight: '92vh', overflow: 'hidden',
            }}
            onClick={e => e.stopPropagation()}
          >
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
                  {previewWeapon.name}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  {previewWeapon.type && (
                    <span style={{
                      fontSize: '0.42rem', letterSpacing: '0.1em',
                      color: 'rgba(255,255,255,0.3)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      padding: '1px 6px', fontFamily: 'var(--font-mono)',
                    }}>
                      {previewWeapon.type}
                    </span>
                  )}
                  <span style={{
                    fontSize: '0.55rem', fontWeight: 700,
                    color: '#c2ff0b', fontFamily: 'var(--font-mono)',
                  }}>
                    {previewWeapon.usage}% pick rate
                  </span>
                  <span style={{ color: 'rgba(255,255,255,0.12)' }}>·</span>
                  <span style={{
                    fontSize: '0.46rem', color: 'rgba(255,255,255,0.22)',
                    fontFamily: 'var(--font-mono)',
                  }}>
                    #{previewWeapon.rank} overall
                  </span>
                </div>
              </div>
              <button
                onClick={() => setPreviewWeapon(null)}
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

            <div style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
              <div style={{
                height: 170, position: 'relative', flexShrink: 0,
                background: 'radial-gradient(ellipse at 50% 60%, rgba(194,255,11,0.05) 0%, transparent 70%)',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
              }}>
                {previewWeapon.image && (
                  <Image
                    src={previewWeapon.image} alt={previewWeapon.name} fill unoptimized
                    sizes="(max-width: 768px) 94vw, 480px"
                    style={{ objectFit: 'contain', padding: '18px 32px' }}
                  />
                )}
                {previewWeapon.dps != null && (
                  <div style={{
                    position: 'absolute', bottom: 10, right: 12,
                    background: 'rgba(0,0,0,0.7)',
                    border: '1px solid rgba(194,255,11,0.2)',
                    padding: '4px 10px',
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                  }}>
                    <span style={{
                      fontSize: '1.05rem', fontWeight: 800, color: '#c2ff0b',
                      fontFamily: 'var(--font-mono)', lineHeight: 1.1,
                    }}>
                      {previewWeapon.dps}
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
                {previewWeapon.description && (
                  <p style={{
                    fontSize: '0.56rem', color: 'rgba(255,255,255,0.35)',
                    lineHeight: 1.65, margin: 0,
                  }}>
                    {previewWeapon.description}
                  </p>
                )}

                {(previewWeapon.ammo_type || previewWeapon.mag != null || previewWeapon.mod_slots != null) && (
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {previewWeapon.ammo_type && (
                      <span style={{
                        fontSize: '0.44rem', letterSpacing: '0.09em',
                        color: 'rgba(255,255,255,0.32)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        padding: '2px 9px', fontFamily: 'var(--font-mono)',
                      }}>
                        {previewWeapon.ammo_type}
                      </span>
                    )}
                    {previewWeapon.mag != null && (
                      <span style={{
                        fontSize: '0.44rem', letterSpacing: '0.09em',
                        color: 'rgba(255,255,255,0.32)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        padding: '2px 9px', fontFamily: 'var(--font-mono)',
                      }}>
                        {previewWeapon.mag} MAG
                      </span>
                    )}
                    {previewWeapon.mod_slots != null && (
                      <span style={{
                        fontSize: '0.44rem', letterSpacing: '0.09em',
                        color: 'rgba(255,255,255,0.32)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        padding: '2px 9px', fontFamily: 'var(--font-mono)',
                      }}>
                        {previewWeapon.mod_slots} MOD SLOTS
                      </span>
                    )}
                  </div>
                )}

                {(previewWeapon.firepower != null || previewWeapon.accuracy != null ||
                  previewWeapon.handling != null || previewWeapon.range != null) && (
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
                      <StatBar label="FIREPOWER" value={previewWeapon.firepower} />
                      <StatBar label="ACCURACY"  value={previewWeapon.accuracy} />
                      <StatBar label="HANDLING"  value={previewWeapon.handling} />
                      <StatBar label="RANGE"     value={previewWeapon.range} />
                      {previewWeapon.zoom != null && (
                        <StatBar label="ZOOM" value={previewWeapon.zoom} />
                      )}
                    </div>
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
