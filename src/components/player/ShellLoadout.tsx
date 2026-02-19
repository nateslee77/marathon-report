'use client';

import Image from 'next/image';
import { useState } from 'react';
import { RunnerType } from '@/types';

const SHELL_IMAGES: Record<RunnerType, string> = {
  destroyer: '/images/shell loadout images/destroyer-loadout image.png',
  vandal:    '/images/shell loadout images/vandal-loadout image.png',
  recon:     '/images/shell loadout images/recon-loadout image.png',
  assassin:  '/images/shell loadout images/assassin-loadout image.png',
  triage:    '/images/shell loadout images/triage-loadout image.png',
  thief:     '/images/shell loadout images/thief-loadout image.png',
  rook:      '/images/shell loadout images/rook-placeholder loadout image.png',
};

const SLOT_IMAGES = {
  equipment: '/images/shell loadout images/equipment-slot-96x96.png',
  shield:    '/images/shell loadout images/shield-slot-96x96.png',
  core:      '/images/shell loadout images/core-slot-96x96.png',
  head:      '/images/shell loadout images/head-slot-96x96.png',
  torso:     '/images/shell loadout images/torso-slot-96x96.png',
  leg:       '/images/shell loadout images/leg-slot-96x96.png',
};

interface ShellLoadoutProps {
  runner: RunnerType;
  effectiveAccent: string;
  /** Size of each square slot box in px (default 64) */
  slotSize?: number;
  /** Width/height of the runner image in px (default 220) */
  shellSize?: number;
  /** Extra top padding inside the outer wrapper (default 0) */
  extraTopPadding?: number;
}

function SlotLabel({ children }: { children: string }) {
  return (
    <div style={{
      fontSize: '0.48rem',
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      color: 'rgba(255,255,255,0.45)',
      fontWeight: 600,
      marginBottom: 3,
    }}>
      {children}
    </div>
  );
}

function SlotBox({ src, label, tooltip, accent, size }: { src: string; label: string; tooltip: string; accent: string; size: number }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      style={{ position: 'relative', display: 'inline-block' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{
        width: size,
        height: size,
        border: `1px solid ${accent}44`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        background: 'rgba(255,255,255,0.04)',
        cursor: 'default',
      }}>
        <Image
          src={src}
          alt={label}
          width={96}
          height={96}
          style={{
            width: size * 0.88,
            height: size * 0.88,
            objectFit: 'contain',
            opacity: 0.7,
          }}
        />
      </div>
      {hovered && (
        <div style={{
          position: 'absolute',
          bottom: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          marginBottom: 6,
          pointerEvents: 'none',
          zIndex: 50,
          whiteSpace: 'nowrap',
          background: '#111',
          border: `1px solid ${accent}66`,
          padding: '3px 7px',
          fontSize: '0.55rem',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          fontWeight: 600,
          color: accent,
        }}>
          {tooltip}
        </div>
      )}
    </div>
  );
}

export function ShellLoadout({ runner, effectiveAccent, slotSize = 64, shellSize = 220, extraTopPadding = 0 }: ShellLoadoutProps) {
  const gap = Math.max(5, Math.round(slotSize * 0.12));
  const basePad = gap * 1.5;

  return (
    // Unified dark background encompasses everything
    <div style={{
      background: '#0a0a0a',
      border: `1px solid ${effectiveAccent}22`,
      paddingTop: basePad + extraTopPadding,
      paddingBottom: basePad,
      paddingLeft: basePad,
      paddingRight: basePad,
      display: 'inline-flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      {/* ── Top 2-row section: slots on left/right, runner in center ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `${slotSize + 4}px 1fr ${slotSize + 4}px`,
        gridTemplateRows: 'auto auto',
        columnGap: gap,
        rowGap: gap,
        alignItems: 'center',
        justifyItems: 'center',
      }}>

        {/* Equipment — top-left */}
        <div style={{ gridColumn: '1', gridRow: '1', alignSelf: 'end', width: slotSize, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <SlotLabel>Equipment</SlotLabel>
          <SlotBox src={SLOT_IMAGES.equipment} label="Equipment" tooltip="Equipment — Empty" accent={effectiveAccent} size={slotSize} />
        </div>

        {/* Runner image — center, spans both rows */}
        <div style={{ gridColumn: '2', gridRow: '1 / 3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Image
            src={SHELL_IMAGES[runner]}
            alt={`${runner} shell`}
            width={500}
            height={500}
            style={{
              width: shellSize,
              height: shellSize,
              objectFit: 'contain',
            }}
          />
        </div>

        {/* Shield — top-right */}
        <div style={{ gridColumn: '3', gridRow: '1', alignSelf: 'end', width: slotSize, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <SlotLabel>Shield</SlotLabel>
          <SlotBox src={SLOT_IMAGES.shield} label="Shield" tooltip="Shield — Empty" accent={effectiveAccent} size={slotSize} />
        </div>

        {/* Core 1 — middle-left */}
        <div style={{ gridColumn: '1', gridRow: '2', alignSelf: 'start', width: slotSize, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <SlotLabel>Core</SlotLabel>
          <SlotBox src={SLOT_IMAGES.core} label="Core 1" tooltip="Core — Empty" accent={effectiveAccent} size={slotSize} />
        </div>

        {/* Core 2 — middle-right */}
        <div style={{ gridColumn: '3', gridRow: '2', alignSelf: 'start', width: slotSize, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <SlotLabel>Core</SlotLabel>
          <SlotBox src={SLOT_IMAGES.core} label="Core 2" tooltip="Core — Empty" accent={effectiveAccent} size={slotSize} />
        </div>

      </div>

      {/* ── Implants row — Head, Torso, Leg ── */}
      <div style={{ marginTop: gap }}>
        <div style={{
          fontSize: '0.48rem',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.45)',
          fontWeight: 600,
          marginBottom: 3,
          textAlign: 'center',
        }}>
          Implants
        </div>
        <div style={{ display: 'flex', gap, justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <SlotLabel>Head</SlotLabel>
            <SlotBox src={SLOT_IMAGES.head}  label="Head"  tooltip="Head Implant — Empty"  accent={effectiveAccent} size={slotSize} />
          </div>
          <div style={{ textAlign: 'center' }}>
            <SlotLabel>Torso</SlotLabel>
            <SlotBox src={SLOT_IMAGES.torso} label="Torso" tooltip="Torso Implant — Empty" accent={effectiveAccent} size={slotSize} />
          </div>
          <div style={{ textAlign: 'center' }}>
            <SlotLabel>Leg</SlotLabel>
            <SlotBox src={SLOT_IMAGES.leg}   label="Leg"   tooltip="Leg Implant — Empty"   accent={effectiveAccent} size={slotSize} />
          </div>
        </div>
      </div>
    </div>
  );
}
