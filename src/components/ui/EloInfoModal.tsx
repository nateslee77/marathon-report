'use client';

import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { ELO_RANKS } from '@/lib/elo-ranks';

interface EloInfoModalProps {
  onClose: () => void;
}

export function EloInfoModal({ onClose }: EloInfoModalProps) {
  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return createPortal(
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <div
        style={{
          width: 'min(500px, 94vw)',
          maxHeight: '88vh',
          background: '#0c0c0c',
          border: '1px solid rgba(255,255,255,0.08)',
          borderTop: '2px solid rgba(194,255,11,0.5)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '13px 16px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="#c2ff0b" strokeWidth="1.5" strokeLinejoin="round" />
              <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="#c2ff0b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#e5e5e5', letterSpacing: '0.05em' }}>
              Elo Rating System
            </span>
          </div>
          <button
            onClick={onClose}
            style={{ color: 'rgba(255,255,255,0.3)', background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div style={{ overflowY: 'auto', flex: 1 }}>
          {/* Brief explanation */}
          <div style={{ padding: '14px 16px 10px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.65, margin: 0 }}>
              Elo measures your skill relative to other players. Beat higher-rated opponents to gain more points;
              lose to weaker ones and drop more. MarathonIntel tracks <strong style={{ color: 'rgba(255,255,255,0.7)' }}>TRIO</strong> and{' '}
              <strong style={{ color: 'rgba(255,255,255,0.7)' }}>SOLO</strong> ratings independently — the two modes
              reward different skills and never affect each other.
            </p>
            <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
              {[
                { label: 'Placement', desc: 'Primary driver' },
                { label: 'Performance', desc: '×0.85 – ×1.15 cap' },
                { label: 'Reliability', desc: 'Ramps over 30 matches' },
              ].map(f => (
                <div key={f.label} style={{
                  padding: '5px 10px',
                  background: 'rgba(194,255,11,0.05)',
                  border: '1px solid rgba(194,255,11,0.18)',
                }}>
                  <div style={{ fontSize: '0.6rem', fontWeight: 700, color: '#c2ff0b', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{f.label}</div>
                  <div style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.3)', marginTop: 1 }}>{f.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Rank ladder */}
          <div style={{ padding: '12px 16px' }}>
            <div style={{ fontSize: '0.52rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)', marginBottom: 10, fontFamily: 'var(--font-mono)' }}>
              Season 1 Ranks
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              {ELO_RANKS.map(rank => (
                <div key={rank.tier} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '9px 12px',
                  background: `${rank.color}08`,
                  border: `1px solid ${rank.color}1e`,
                }}>
                  {/* Badge image or placeholder */}
                  <div style={{ width: 40, height: 40, flexShrink: 0, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {rank.image ? (
                      <Image src={rank.image} alt={rank.label} fill unoptimized style={{ objectFit: 'contain' }} />
                    ) : (
                      <div style={{
                        width: 40, height: 40,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: `${rank.color}12`,
                        border: `1px dashed ${rank.color}44`,
                      }}>
                        <div style={{ width: 14, height: 14, background: rank.color, opacity: 0.55, transform: 'rotate(45deg)' }} />
                      </div>
                    )}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                      <span style={{ fontSize: '0.78rem', fontWeight: 700, color: rank.color, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                        {rank.label}
                      </span>
                      <span style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.22)', fontFamily: 'var(--font-mono)' }}>
                        {rank.minElo}–{rank.maxElo ?? '∞'} pts
                      </span>
                    </div>
                    <div style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.32)', marginTop: 1 }}>
                      {rank.description}
                    </div>
                  </div>

                  {rank.tier === 'Master' && (
                    <span style={{ fontSize: '0.44rem', letterSpacing: '0.1em', color: '#22c55e', border: '1px solid rgba(34,197,94,0.3)', padding: '2px 7px', fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap' }}>
                      ELITE
                    </span>
                  )}
                  {rank.tier === 'Ultra' && (
                    <span style={{ fontSize: '0.44rem', letterSpacing: '0.1em', color: '#ff3333', border: '1px solid rgba(255,51,51,0.3)', padding: '2px 7px', fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap' }}>
                      TOP 500
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
