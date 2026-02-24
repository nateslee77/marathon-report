'use client';

import { useState, useRef, useEffect, useId } from 'react';
import Link from 'next/link';
import { MiniMatch } from '@/types';

interface PerformanceGraphProps {
  matches: MiniMatch[];
  compact?: boolean;
}

const PADDING_X = 14;
const LABEL_W = 30;

export function PerformanceGraph({ matches, compact = false }: PerformanceGraphProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [clickedIndex, setClickedIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgWidth, setSvgWidth] = useState(600);
  const uid = useId().replace(/:/g, '');

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width;
      if (w && w > 0) setSvgWidth(Math.round(w));
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (clickedIndex === null) return;
    const handle = (e: PointerEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setClickedIndex(null);
    };
    document.addEventListener('pointerdown', handle);
    return () => document.removeEventListener('pointerdown', handle);
  }, [clickedIndex]);

  const last10 = matches.slice(-10);
  if (last10.length < 2) return null;

  const rawCredits = last10.map(m =>
    m.creditsExtracted ?? (m.result === 'EXTRACTED' ? 5000 : -3000)
  );
  const dataMax = Math.max(...rawCredits.map(Math.abs));
  const MAX_CREDITS = Math.max(8000, Math.ceil(dataMax / 2000) * 2000 + 2000);

  const height = compact ? 130 : 240;
  // In full view, reserve bottom space for map labels (only on desktop)
  const mapLabelH = !compact && svgWidth >= 480 ? 18 : 0;
  const paddingY = compact ? 12 : 20;
  const labelW = compact ? 0 : LABEL_W;
  const width = svgWidth;
  const innerW = width - PADDING_X * 2 - labelW;
  const innerH = height - paddingY * 2 - mapLabelH;
  const midY = paddingY + innerH / 2;

  function creditsToY(credits: number) {
    const clamped = Math.max(-MAX_CREDITS, Math.min(MAX_CREDITS, credits));
    return midY - (clamped / MAX_CREDITS) * (innerH / 2);
  }

  const points = last10.map((m, i) => ({
    x: PADDING_X + (i / (last10.length - 1)) * innerW,
    y: creditsToY(m.creditsExtracted ?? (m.result === 'EXTRACTED' ? 5000 : -3000)),
    match: m,
  }));

  const polylinePoints = points.map((p) => `${p.x},${p.y}`).join(' ');

  const greenArea =
    `M ${points[0].x},${midY} ` +
    points.map((p) => `L ${p.x},${Math.min(p.y, midY)}`).join(' ') +
    ` L ${points[points.length - 1].x},${midY} Z`;

  const redArea =
    `M ${points[0].x},${midY} ` +
    points.map((p) => `L ${p.x},${Math.max(p.y, midY)}`).join(' ') +
    ` L ${points[points.length - 1].x},${midY} Z`;

  const halfK = Math.round(MAX_CREDITS / 2 / 1000);
  const fullK = Math.round(MAX_CREDITS / 1000);
  const gridLevels = !compact
    ? [
        { credits: MAX_CREDITS,      label: `+${fullK}K` },
        { credits: MAX_CREDITS / 2,  label: `+${halfK}K` },
        { credits: 0,                label: '0' },
        { credits: -MAX_CREDITS / 2, label: `-${halfK}K` },
        { credits: -MAX_CREDITS,     label: `-${fullK}K` },
      ]
    : [];

  // Net credit totals over last 10
  const netGain  = rawCredits.filter(c => c > 0).reduce((a, b) => a + b, 0);
  const netLoss  = rawCredits.filter(c => c < 0).reduce((a, b) => a + b, 0);
  const netTotal = rawCredits.reduce((a, b) => a + b, 0);

  const tooltipW = 160;
  const stripData = clickedIndex !== null ? points[clickedIndex] : null;
  const showMapLabels = !compact && svgWidth >= 480;

  return (
    <div
      ref={containerRef}
      style={{ position: 'relative', width: '100%' }}
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
    >

      {/* Title row — full view only */}
      {!compact && (
        <div style={{ marginBottom: 10, paddingRight: labelW }}>
          <span style={{ fontSize: '0.55rem', fontWeight: 700, letterSpacing: '0.18em', color: 'rgba(255,255,255,0.28)', textTransform: 'uppercase' }}>
            Credits Per Match
          </span>
        </div>
      )}

      <svg
        viewBox={`0 0 ${width} ${height}`}
        width="100%"
        height={height}
        style={{ display: 'block', overflow: 'visible' }}
      >
        <defs>
          {/* Green: bright at center line (midY), fades toward top (paddingY) */}
          <linearGradient id={`gf-${uid}`} x1="0" y1={midY} x2="0" y2={paddingY} gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="#c2ff0b" stopOpacity="0.6" />
            <stop offset="35%"  stopColor="#c2ff0b" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#c2ff0b" stopOpacity="0.02" />
          </linearGradient>
          {/* Red: bright at center line (midY), fades toward bottom (paddingY+innerH) */}
          <linearGradient id={`rf-${uid}`} x1="0" y1={midY} x2="0" y2={paddingY + innerH} gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="#ff4444" stopOpacity="0.6" />
            <stop offset="35%"  stopColor="#ff4444" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#ff4444" stopOpacity="0.02" />
          </linearGradient>
          <clipPath id={`ca-${uid}`}>
            <rect x="0" y="0" width={width} height={midY} />
          </clipPath>
          <clipPath id={`cb-${uid}`}>
            <rect x="0" y={midY} width={width} height={height - midY} />
          </clipPath>
        </defs>

        {/* Grid lines — full view */}
        {gridLevels.map(({ credits, label }) => {
          const gy = creditsToY(credits);
          const isMid = credits === 0;
          return (
            <g key={credits}>
              <line
                x1={PADDING_X} y1={gy} x2={width - labelW - 2} y2={gy}
                stroke={isMid ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.05)'}
                strokeWidth={isMid ? 1 : 0.5}
                strokeDasharray={isMid ? '6 4' : '3 6'}
              />
              <text
                x={width - labelW + 4} y={gy + 3}
                fill={isMid ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.15)'}
                fontSize="7" textAnchor="start" fontFamily="monospace"
              >
                {label}
              </text>
            </g>
          );
        })}

        {/* Center 0-line — compact */}
        {compact && (
          <line
            x1={PADDING_X} y1={midY} x2={width - PADDING_X} y2={midY}
            stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="6 4"
          />
        )}

        {/* Fill areas — solid edge fading inward */}
        <path d={greenArea} fill={`url(#gf-${uid})`} clipPath={`url(#ca-${uid})`} />
        <path d={redArea}   fill={`url(#rf-${uid})`} clipPath={`url(#cb-${uid})`} />
        {/* Bright edge line at top of green zone */}
        <line x1={PADDING_X} y1={paddingY} x2={width - labelW - 2} y2={paddingY}
          stroke="rgba(194,255,11,0.18)" strokeWidth="1" />
        {/* Bright edge line at bottom of red zone */}
        <line x1={PADDING_X} y1={paddingY + innerH} x2={width - labelW - 2} y2={paddingY + innerH}
          stroke="rgba(255,68,68,0.18)" strokeWidth="1" />

        {/* Zone labels — top and bottom corners, fully clear of fill */}
        <text
          x={PADDING_X + 6}
          y={paddingY + (compact ? 10 : 13)}
          fill="rgba(194,255,11,0.5)"
          fontSize={compact ? '7' : '8'}
          fontWeight="700"
          letterSpacing="0.14em"
          textAnchor="start"
          fontFamily="monospace"
        >
          EXTRACTED
        </text>
        <text
          x={PADDING_X + 6}
          y={paddingY + innerH - (compact ? 4 : 5)}
          fill="rgba(255,68,68,0.5)"
          fontSize={compact ? '7' : '8'}
          fontWeight="700"
          letterSpacing="0.14em"
          textAnchor="start"
          fontFamily="monospace"
        >
          ELIMINATED
        </text>

        {/* Connecting line */}
        <polyline
          points={polylinePoints}
          fill="none"
          stroke="rgba(255,255,255,0.4)"
          strokeWidth="1.5"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Dots */}
        {points.map((p, i) => {
          const isExtracted = p.match.result === 'EXTRACTED';
          const isActive = hoveredIndex === i || clickedIndex === i;
          const isClicked = clickedIndex === i;
          const dotColor = isExtracted ? '#c2ff0b' : '#ff4444';
          const r = isActive ? 5.5 : 4;
          return (
            <g
              key={i}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setClickedIndex(prev => prev === i ? null : i);
              }}
              style={{ cursor: 'pointer' }}
            >
              <circle cx={p.x} cy={p.y} r={22} fill="transparent" />
              {isClicked && (
                <circle cx={p.x} cy={p.y} r={r + 4.5} fill="none" stroke={dotColor} strokeWidth="1.5" opacity={0.5} />
              )}
              {isActive && !isClicked && (
                <circle cx={p.x} cy={p.y} r={r + 3.5} fill="none" stroke={dotColor} strokeWidth="1" opacity={0.35} />
              )}
              <circle cx={p.x} cy={p.y} r={r} fill={dotColor} />
            </g>
          );
        })}

        {/* Map labels — desktop full view only */}
        {showMapLabels && points.map((p, i) => (
          <text
            key={i}
            x={p.x}
            y={height - 4}
            fill={clickedIndex === i ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.2)'}
            fontSize="7.5"
            textAnchor="middle"
            fontFamily="monospace"
          >
            {p.match.map.split(' ')[0]}
          </text>
        ))}
      </svg>

      {/* Tap hint */}
      {clickedIndex === null && (
        <div style={{ textAlign: 'center', marginTop: 4 }}>
          <span style={{ fontSize: '0.48rem', color: 'rgba(255,255,255,0.15)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Tap a dot to view match
          </span>
        </div>
      )}

      {/* Info strip — tap/click (works on mobile) */}
      {stripData !== null && (() => {
        const m = stripData.match;
        const isExtracted = m.result === 'EXTRACTED';
        const credits = m.creditsExtracted ?? 0;
        const kd = m.deaths > 0 ? (m.kills / m.deaths).toFixed(2) : `${m.kills}.0`;
        return (
          <div style={{
            marginTop: 6,
            padding: '9px 12px',
            background: isExtracted ? 'rgba(194,255,11,0.04)' : 'rgba(255,68,68,0.04)',
            border: `1px solid ${isExtracted ? 'rgba(194,255,11,0.15)' : 'rgba(255,68,68,0.15)'}`,
            borderLeft: `3px solid ${isExtracted ? '#c2ff0b' : '#ff4444'}`,
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            flexWrap: 'wrap',
          }}>
            <div style={{ flexShrink: 0 }}>
              <div style={{ fontSize: '0.5rem', fontWeight: 700, letterSpacing: '0.12em', color: isExtracted ? '#c2ff0b' : '#ff4444', marginBottom: 2 }}>
                {m.result}
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
                <span style={{ fontSize: '1.05rem', fontWeight: 700, color: isExtracted ? '#c2ff0b' : '#ff4444', fontFamily: 'var(--font-rajdhani), sans-serif', letterSpacing: '0.02em', lineHeight: 1 }}>
                  {isExtracted ? '+' : ''}{credits.toLocaleString()}
                </span>
                <span style={{ fontSize: '0.5rem', color: 'rgba(255,255,255,0.3)' }}>CR</span>
              </div>
            </div>
            <div style={{ width: 1, height: 30, background: 'rgba(255,255,255,0.08)', flexShrink: 0 }} />
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontSize: '0.48rem', color: 'rgba(255,255,255,0.28)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>K/D</div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.85)', fontFamily: 'monospace' }}>{kd}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.48rem', color: 'rgba(255,255,255,0.28)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>K/D/A</div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.85)', fontFamily: 'monospace' }}>{m.kills}/{m.deaths}/{m.assists}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.48rem', color: 'rgba(255,255,255,0.28)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>Map</div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.85)', fontFamily: 'monospace' }}>{m.map}</div>
              </div>
            </div>
            {m.matchId && (
              <Link
                href={`/match/${m.matchId}`}
                style={{ marginLeft: 'auto', fontSize: '0.55rem', color: 'rgba(194,255,11,0.5)', letterSpacing: '0.06em', textTransform: 'uppercase', textDecoration: 'none', flexShrink: 0 }}
              >
                Details →
              </Link>
            )}
          </div>
        );
      })()}

      {/* Net totals strip */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 0,
        marginTop: clickedIndex !== null ? 6 : 4,
        borderTop: '1px solid rgba(255,255,255,0.05)',
        paddingTop: 8,
      }}>
        {[
          { label: 'NET GAIN',  value: `+${netGain.toLocaleString()}`, color: '#c2ff0b' },
          { label: 'NET LOSS',  value: netLoss.toLocaleString(),        color: '#ff4444' },
          { label: 'NET TOTAL', value: (netTotal >= 0 ? '+' : '') + netTotal.toLocaleString(), color: netTotal >= 0 ? '#c2ff0b' : '#ff4444' },
        ].map((item, i) => (
          <div key={item.label} style={{ flex: 1, textAlign: 'center', borderRight: i < 2 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
            <div style={{ fontSize: '0.48rem', color: 'rgba(255,255,255,0.28)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 2 }}>
              {item.label}
            </div>
            <div style={{ fontSize: compact ? '0.7rem' : '0.85rem', fontWeight: 700, color: item.color, fontFamily: 'var(--font-rajdhani), sans-serif', letterSpacing: '0.02em' }}>
              {item.value}
            </div>
            <div style={{ fontSize: '0.45rem', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.06em' }}>CR</div>
          </div>
        ))}
      </div>

      {/* Floating hover tooltip — desktop, only when nothing clicked */}
      {hoveredIndex !== null && clickedIndex === null && (() => {
        const p = points[hoveredIndex];
        const m = p.match;
        const isExtracted = m.result === 'EXTRACTED';
        const credits = m.creditsExtracted ?? 0;
        const dotIsLow = p.y > midY;
        const clampedX = Math.max(tooltipW / 2, Math.min(width - tooltipW / 2, p.x));
        const kd = m.deaths > 0 ? (m.kills / m.deaths).toFixed(2) : `${m.kills}.0`;
        return (
          <div style={{
            position: 'absolute',
            ...(dotIsLow ? { bottom: height - p.y + 12 } : { top: p.y + 12 }),
            left: clampedX,
            transform: 'translateX(-50%)',
            background: 'rgba(6,6,6,0.97)',
            border: `1px solid ${isExtracted ? 'rgba(194,255,11,0.2)' : 'rgba(255,68,68,0.2)'}`,
            borderTop: `2px solid ${isExtracted ? '#c2ff0b' : '#ff4444'}`,
            padding: '8px 11px',
            pointerEvents: 'none',
            zIndex: 20,
            minWidth: tooltipW,
            whiteSpace: 'nowrap',
          }}>
            <div style={{ fontSize: '0.55rem', fontWeight: 700, letterSpacing: '0.14em', color: isExtracted ? '#c2ff0b' : '#ff4444', marginBottom: 6 }}>
              {m.result}
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 7 }}>
              <span style={{ fontSize: '1.1rem', fontWeight: 700, color: isExtracted ? '#c2ff0b' : '#ff4444', fontFamily: 'var(--font-rajdhani), sans-serif', lineHeight: 1 }}>
                {isExtracted ? '+' : ''}{credits.toLocaleString()}
              </span>
              <span style={{ fontSize: '0.5rem', color: 'rgba(255,255,255,0.3)' }}>CR</span>
            </div>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 5, display: 'flex', flexDirection: 'column', gap: 3 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
                <span style={{ fontSize: '0.52rem', color: 'rgba(255,255,255,0.32)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>K/D</span>
                <span style={{ fontSize: '0.58rem', color: 'rgba(255,255,255,0.75)', fontFamily: 'monospace' }}>{kd}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
                <span style={{ fontSize: '0.52rem', color: 'rgba(255,255,255,0.32)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>K/D/A</span>
                <span style={{ fontSize: '0.58rem', color: 'rgba(255,255,255,0.75)', fontFamily: 'monospace' }}>{m.kills}/{m.deaths}/{m.assists}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
                <span style={{ fontSize: '0.52rem', color: 'rgba(255,255,255,0.32)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Map</span>
                <span style={{ fontSize: '0.58rem', color: 'rgba(255,255,255,0.75)', fontFamily: 'monospace' }}>{m.map}</span>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
