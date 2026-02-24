'use client';

import { useState, useRef, useEffect, useId } from 'react';
import Link from 'next/link';
import { MiniMatch } from '@/types';

interface PerformanceGraphProps {
  matches: MiniMatch[];
  compact?: boolean;
}

const PADDING_X = 12;
const LABEL_W = 32; // right-side y-axis label space (full view only)

export function PerformanceGraph({ matches, compact = false }: PerformanceGraphProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
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

  const last10 = matches.slice(-10);
  if (last10.length < 2) return null;

  // Dynamic scale: fit to actual data with a small buffer
  const rawCredits = last10.map(m =>
    m.creditsExtracted ?? (m.result === 'EXTRACTED' ? 5000 : -3000)
  );
  const dataMax = Math.max(...rawCredits.map(Math.abs));
  // Round up to nearest 2000, add 2000 buffer, minimum 8000
  const MAX_CREDITS = Math.max(8000, Math.ceil(dataMax / 2000) * 2000 + 2000);

  const height = compact ? 130 : 240;
  const paddingY = compact ? 14 : 24;
  const labelW = compact ? 0 : LABEL_W;
  const width = svgWidth;
  const innerW = width - PADDING_X * 2 - labelW;
  const innerH = height - paddingY * 2;
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

  // Grid levels for full view
  const halfK = Math.round(MAX_CREDITS / 2 / 1000);
  const fullK = Math.round(MAX_CREDITS / 1000);
  const gridLevels = !compact
    ? [
        { credits: MAX_CREDITS, label: `+${fullK}K` },
        { credits: MAX_CREDITS / 2, label: `+${halfK}K` },
        { credits: 0, label: '0' },
        { credits: -MAX_CREDITS / 2, label: `-${halfK}K` },
        { credits: -MAX_CREDITS, label: `-${fullK}K` },
      ]
    : [];

  const tooltipW = 160;

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
      {/* Legend — full view only */}
      {!compact && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, paddingRight: labelW }}>
          <span style={{ fontSize: '0.55rem', fontWeight: 700, letterSpacing: '0.18em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' }}>
            Credits Per Match
          </span>
          <div style={{ display: 'flex', gap: 14 }}>
            <span style={{ fontSize: '0.6rem', color: 'rgba(194,255,11,0.75)', display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#c2ff0b', display: 'inline-block', flexShrink: 0 }} />
              Extracted
            </span>
            <span style={{ fontSize: '0.6rem', color: 'rgba(255,68,68,0.75)', display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#ff4444', display: 'inline-block', flexShrink: 0 }} />
              Eliminated
            </span>
          </div>
        </div>
      )}

      <svg
        viewBox={`0 0 ${width} ${height}`}
        width="100%"
        height={height}
        style={{ display: 'block', overflow: 'visible' }}
      >
        <defs>
          <linearGradient id={`gf-${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c2ff0b" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#c2ff0b" stopOpacity="0.03" />
          </linearGradient>
          <linearGradient id={`rf-${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ff4444" stopOpacity="0.03" />
            <stop offset="100%" stopColor="#ff4444" stopOpacity="0.30" />
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
                x1={PADDING_X}
                y1={gy}
                x2={width - labelW - 4}
                y2={gy}
                stroke={isMid ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.06)'}
                strokeWidth={isMid ? 1 : 0.5}
                strokeDasharray={isMid ? '5 4' : '3 5'}
              />
              <text
                x={width - labelW + 4}
                y={gy + 3}
                fill={isMid ? 'rgba(255,255,255,0.28)' : 'rgba(255,255,255,0.16)'}
                fontSize="7.5"
                textAnchor="start"
                fontFamily="monospace"
              >
                {label}
              </text>
            </g>
          );
        })}

        {/* Center 0-line — compact view */}
        {compact && (
          <line
            x1={PADDING_X}
            y1={midY}
            x2={width - PADDING_X}
            y2={midY}
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="1"
            strokeDasharray="5 4"
          />
        )}

        {/* Fill areas */}
        <path d={greenArea} fill={`url(#gf-${uid})`} clipPath={`url(#ca-${uid})`} />
        <path d={redArea} fill={`url(#rf-${uid})`} clipPath={`url(#cb-${uid})`} />

        {/* Connecting line */}
        <polyline
          points={polylinePoints}
          fill="none"
          stroke="rgba(255,255,255,0.35)"
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Dots */}
        {points.map((p, i) => {
          const isExtracted = p.match.result === 'EXTRACTED';
          const isHovered = hoveredIndex === i;
          const dotColor = isExtracted ? '#c2ff0b' : '#ff4444';
          const r = isHovered ? 6 : 4.5;
          return (
            <g
              key={i}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{ cursor: p.match.matchId ? 'pointer' : 'default' }}
            >
              {/* Hit area */}
              <circle cx={p.x} cy={p.y} r={16} fill="transparent" />
              {/* Glow ring */}
              {isHovered && (
                <circle
                  cx={p.x} cy={p.y} r={r + 4}
                  fill="none"
                  stroke={dotColor}
                  strokeWidth="1"
                  opacity={0.4}
                />
              )}
              {/* Dot */}
              {p.match.matchId ? (
                <Link href={`/match/${p.match.matchId}`}>
                  <circle cx={p.x} cy={p.y} r={r} fill={dotColor} />
                </Link>
              ) : (
                <circle cx={p.x} cy={p.y} r={r} fill={dotColor} />
              )}
            </g>
          );
        })}

        {/* Map labels — full view */}
        {!compact && points.map((p, i) => (
          <text
            key={i}
            x={p.x}
            y={height - 6}
            fill="rgba(255,255,255,0.22)"
            fontSize="8"
            textAnchor="middle"
            fontFamily="monospace"
          >
            {p.match.map.split(' ')[0]}
          </text>
        ))}
      </svg>

      {/* Hover tooltip */}
      {hoveredIndex !== null && (() => {
        const p = points[hoveredIndex];
        const m = p.match;
        const isExtracted = m.result === 'EXTRACTED';
        const credits = m.creditsExtracted ?? 0;
        const dotIsLow = p.y > midY;
        const clampedX = Math.max(tooltipW / 2, Math.min(width - tooltipW / 2, p.x));
        const kd = m.deaths > 0 ? (m.kills / m.deaths).toFixed(2) : `${m.kills}.0`;
        return (
          <div
            style={{
              position: 'absolute',
              ...(dotIsLow
                ? { bottom: height - p.y + 12 }
                : { top: p.y + 12 }),
              left: clampedX,
              transform: 'translateX(-50%)',
              background: 'rgba(6,6,6,0.97)',
              border: `1px solid ${isExtracted ? 'rgba(194,255,11,0.25)' : 'rgba(255,68,68,0.25)'}`,
              borderTop: `2px solid ${isExtracted ? '#c2ff0b' : '#ff4444'}`,
              padding: '8px 11px',
              pointerEvents: 'none',
              zIndex: 20,
              minWidth: tooltipW,
              whiteSpace: 'nowrap',
            }}
          >
            {/* Result label */}
            <div style={{ fontSize: '0.55rem', fontWeight: 700, letterSpacing: '0.14em', color: isExtracted ? '#c2ff0b' : '#ff4444', marginBottom: 6 }}>
              {m.result}
            </div>
            {/* Credits — big number */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 7 }}>
              <span style={{
                fontSize: '1.15rem',
                fontWeight: 700,
                color: isExtracted ? '#c2ff0b' : '#ff4444',
                fontFamily: 'var(--font-rajdhani), sans-serif',
                lineHeight: 1,
                letterSpacing: '0.02em',
              }}>
                {isExtracted ? '+' : ''}{credits.toLocaleString()}
              </span>
              <span style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.05em' }}>CR</span>
            </div>
            {/* Divider */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 6, display: 'flex', flexDirection: 'column', gap: 3 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
                <span style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>K/D</span>
                <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.75)', fontFamily: 'monospace' }}>{kd}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
                <span style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>K/D/A</span>
                <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.75)', fontFamily: 'monospace' }}>{m.kills}/{m.deaths}/{m.assists}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
                <span style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Map</span>
                <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.75)', fontFamily: 'monospace' }}>{m.map}</span>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
