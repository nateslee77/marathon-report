'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';

const weaponMetaData = [
  { rank: 1, name: 'OVERRUN AR', image: '/images/Weapons no bg/OVERRUN AR-Picsart-BackgroundRemover.png', usage: 18.4 },
  { rank: 2, name: 'TWIN TAP HBR', image: '/images/Weapons no bg/TWIN TAP HBR-Picsart-BackgroundRemover.png', usage: 14.7 },
  { rank: 3, name: 'V75 SCAR', image: '/images/Weapons no bg/V75 SCAR-Picsart-BackgroundRemover.png', usage: 12.1 },
  { rank: 4, name: 'M77 ASSAULT RIFLE', image: '/images/Weapons no bg/M77 ASSAULT RIFLE-Picsart-BackgroundRemover.png', usage: 9.8 },
  { rank: 5, name: 'CONQUEST LMG', image: '/images/Weapons no bg/CONQUEST LMG-Picsart-BackgroundRemover.png', usage: 8.3 },
  { rank: 6, name: 'WSTR COMBAT SHOTGUN', image: '/images/Weapons no bg/WSTR COMBAT SHOTGUN-Picsart-BackgroundRemover.png', usage: 7.1 },
  { rank: 7, name: 'COPPERHEAD RF', image: '/images/Weapons no bg/COPPERHEAD RF-Picsart-BackgroundRemover.png', usage: 5.9 },
  { rank: 8, name: 'BRRT SMG', image: '/images/Weapons no bg/BRRT SMG-Picsart-BackgroundRemover.png', usage: 4.6 },
  { rank: 9, name: 'IMPACT HAR', image: '/images/Weapons no bg/IMPACT HAR-Picsart-BackgroundRemover.png', usage: 3.8 },
  { rank: 10, name: 'BULLY SMG', image: '/images/Weapons no bg/BULLY SMG-Picsart-BackgroundRemover.png', usage: 3.2 },
  { rank: 11, name: 'LONGSHOT', image: '/images/Weapons no bg/LONGSHOT-Picsart-BackgroundRemover.png', usage: 2.7 },
  { rank: 12, name: 'MAGNUM HC', image: '/images/Weapons no bg/MAGNUM HC-Picsart-BackgroundRemover.png', usage: 2.1 },
  { rank: 13, name: 'REPEATER HPR', image: '/images/Weapons no bg/REPEATER HPR-Picsart-BackgroundRemover.png', usage: 1.8 },
  { rank: 14, name: 'V22 VOLT THROWER', image: '/images/Weapons no bg/V22 VOLT THROWER-Picsart-BackgroundRemover.png', usage: 1.4 },
  { rank: 15, name: 'RETALIATOR LMG', image: '/images/Weapons no bg/RETALIATOR LMG-Picsart-BackgroundRemover.png', usage: 1.1 },
  { rank: 16, name: 'DEMOLITION HMG', image: '/images/Weapons no bg/DEMOLITION HMG-Picsart-BackgroundRemover.png', usage: 0.9 },
  { rank: 17, name: 'HARDLINE PR', image: '/images/Weapons no bg/HARDLINE PR-Picsart-BackgroundRemover.png', usage: 0.7 },
  { rank: 18, name: 'ARES RG', image: '/images/Weapons no bg/ARES RG-Picsart-BackgroundRemover.png', usage: 0.6 },
  { rank: 19, name: 'CE TACTICAL SIDEARM', image: '/images/Weapons no bg/CE TACTICAL SIDEARM-Picsart-BackgroundRemover.png', usage: 0.5 },
  { rank: 20, name: 'STRYDER MIT', image: '/images/Weapons no bg/STRYDER MIT-Picsart-BackgroundRemover.png', usage: 0.4 },
  { rank: 21, name: 'V99 CHANNEL RIFLE', image: '/images/Weapons no bg/V99 CHANNEL RIFLE-Picsart-BackgroundRemover.png', usage: 0.35 },
  { rank: 22, name: 'V85 CIRCUIT BREAKER', image: '/images/Weapons no bg/V85 CIRCUIT BREAKER-Picsart-BackgroundRemover.png', usage: 0.3 },
  { rank: 23, name: 'V66 LOOKOUT', image: '/images/Weapons no bg/V66 LOOKOUT-Picsart-BackgroundRemover.png', usage: 0.25 },
  { rank: 24, name: 'V11 PUNCH', image: '/images/Weapons no bg/V11 PUNCH-Picsart-BackgroundRemover.png', usage: 0.2 },
  { rank: 25, name: 'B33 VOLLEY RIFLE', image: '/images/Weapons no bg/B33_VOLLEY_RIFLE-removebg-preview.png', usage: 0.15 },
  { rank: 26, name: 'OUTLAND', image: '/images/Weapons no bg/OUTLAND-Picsart-BackgroundRemover.png', usage: 0.12 },
  { rank: 27, name: 'MISRIAH 2442', image: '/images/Weapons no bg/MISRIAH 2442-Picsart-BackgroundRemover.png', usage: 0.1 },
  { rank: 28, name: 'VOO ZEUS RG', image: '/images/Weapons no bg/VOO ZEUS RG-Picsart-BackgroundRemover.png', usage: 0.08 },
];

export function WeaponMetaTracker() {
  const [showModal, setShowModal] = useState(false);
  const [previewWeapon, setPreviewWeapon] = useState<{ name: string; image: string } | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const top3 = weaponMetaData.slice(0, 3);
  const list4to10 = weaponMetaData.slice(3, 10);

  return (
    <>
      <div className="game-card">
        {/* Header */}
        <div
          className="px-4 md:px-5 py-3 flex items-center justify-between"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
              <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="#c2ff0b" strokeWidth="1.5" strokeLinejoin="round" />
              <path d="M2 17l10 5 10-5" stroke="#c2ff0b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M2 12l10 5 10-5" stroke="#c2ff0b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <h2 className="text-base md:text-lg font-semibold" style={{ color: '#e5e5e5' }}>
              Weapon Meta
            </h2>
          </div>
          <span
            style={{
              fontSize: '0.55rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#c2ff0b',
              border: '1px solid rgba(194,255,11,0.3)',
              padding: '2px 8px',
              background: 'rgba(194,255,11,0.08)',
            }}
          >
            This Week
          </span>
        </div>

        {/* Top 3 Podium */}
        <div className="p-4 md:p-6">
          <div className="flex items-end justify-center gap-2 md:gap-5 mb-6">
            {/* 2nd Place - Left */}
            <div className="flex flex-col items-center" style={{ flex: '1 1 0', maxWidth: 200, minWidth: 0 }}>
              <div
                className="meta-weapon-card meta-weapon-hover"
                onClick={() => setPreviewWeapon({ name: top3[1].name, image: top3[1].image })}
                style={{
                  width: '100%',
                  aspectRatio: '5 / 3',
                  position: 'relative',
                  overflow: 'hidden',
                  border: '1px solid rgba(194,255,11,0.15)',
                  background: '#0a0a0a',
                  cursor: 'pointer',
                }}
              >
                <Image
                  src={top3[1].image}
                  alt={top3[1].name}
                  fill
                  style={{ objectFit: 'contain', padding: 8 }}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: 6,
                    left: 6,
                    zIndex: 2,
                    background: 'rgba(194,255,11,0.15)',
                    border: '1px solid rgba(194,255,11,0.3)',
                    padding: '1px 6px',
                    fontSize: '0.55rem',
                    fontWeight: 700,
                    color: '#c2ff0b',
                    fontFamily: 'var(--font-mono)',
                    backdropFilter: 'blur(4px)',
                  }}
                >
                  #2
                </div>
              </div>
              <div
                className="text-center mt-2 truncate w-full"
                style={{ fontSize: '0.6rem', color: '#e5e5e5', letterSpacing: '0.02em' }}
              >
                {top3[1].name}
              </div>
              <div
                className="font-mono font-bold"
                style={{ fontSize: '0.7rem', color: '#c2ff0b' }}
              >
                {top3[1].usage}%
              </div>
            </div>

            {/* 1st Place - Center (biggest) */}
            <div className="flex flex-col items-center" style={{ flex: '1.4 1 0', maxWidth: 280, minWidth: 0, marginBottom: 8 }}>
              <div
                className="meta-weapon-card meta-weapon-hover"
                onClick={() => setPreviewWeapon({ name: top3[0].name, image: top3[0].image })}
                style={{
                  width: '100%',
                  aspectRatio: '7 / 4',
                  position: 'relative',
                  overflow: 'hidden',
                  border: '1px solid rgba(194,255,11,0.25)',
                  background: '#0a0a0a',
                  boxShadow: '0 0 20px rgba(194,255,11,0.08)',
                  cursor: 'pointer',
                }}
              >
                <Image
                  src={top3[0].image}
                  alt={top3[0].name}
                  fill
                  style={{ objectFit: 'contain', padding: 10 }}
                />
                {/* Crown / #1 indicator */}
                <div
                  style={{
                    position: 'absolute',
                    top: 6,
                    left: 6,
                    zIndex: 2,
                    background: 'rgba(194,255,11,0.15)',
                    border: '1px solid rgba(194,255,11,0.3)',
                    padding: '1px 6px',
                    fontSize: '0.55rem',
                    fontWeight: 700,
                    color: '#c2ff0b',
                    fontFamily: 'var(--font-mono)',
                    backdropFilter: 'blur(4px)',
                  }}
                >
                  #1
                </div>
              </div>
              <div
                className="text-center mt-2 truncate font-semibold w-full"
                style={{ fontSize: '0.7rem', color: '#c2ff0b', letterSpacing: '0.03em' }}
              >
                {top3[0].name}
              </div>
              <div
                className="font-mono font-bold"
                style={{ fontSize: '0.85rem', color: '#c2ff0b' }}
              >
                {top3[0].usage}%
              </div>
            </div>

            {/* 3rd Place - Right */}
            <div className="flex flex-col items-center" style={{ flex: '1 1 0', maxWidth: 200, minWidth: 0 }}>
              <div
                className="meta-weapon-card meta-weapon-hover"
                onClick={() => setPreviewWeapon({ name: top3[2].name, image: top3[2].image })}
                style={{
                  width: '100%',
                  aspectRatio: '5 / 3',
                  position: 'relative',
                  overflow: 'hidden',
                  border: '1px solid rgba(194,255,11,0.15)',
                  background: '#0a0a0a',
                  cursor: 'pointer',
                }}
              >
                <Image
                  src={top3[2].image}
                  alt={top3[2].name}
                  fill
                  style={{ objectFit: 'contain', padding: 8 }}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: 6,
                    left: 6,
                    zIndex: 2,
                    background: 'rgba(194,255,11,0.15)',
                    border: '1px solid rgba(194,255,11,0.3)',
                    padding: '1px 6px',
                    fontSize: '0.55rem',
                    fontWeight: 700,
                    color: '#c2ff0b',
                    fontFamily: 'var(--font-mono)',
                    backdropFilter: 'blur(4px)',
                  }}
                >
                  #3
                </div>
              </div>
              <div
                className="text-center mt-2 truncate w-full"
                style={{ fontSize: '0.6rem', color: '#e5e5e5', letterSpacing: '0.02em' }}
              >
                {top3[2].name}
              </div>
              <div
                className="font-mono font-bold"
                style={{ fontSize: '0.7rem', color: '#c2ff0b' }}
              >
                {top3[2].usage}%
              </div>
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', marginBottom: 12 }} />

          {/* Ranks 4-10 List */}
          <div className="space-y-1 md:space-y-1.5">
            {list4to10.map((weapon) => (
              <div
                key={weapon.rank}
                className="flex items-center justify-between font-mono text-xs md:text-sm transition-all hover:scale-[1.02]"
                style={{
                  padding: '5px 10px',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.04)',
                  cursor: 'default',
                }}
              >
                <div className="flex items-center gap-2 md:gap-3 min-w-0">
                  <span
                    className="font-bold tabular-nums"
                    style={{
                      color: 'rgba(255,255,255,0.3)',
                      width: 16,
                      textAlign: 'right',
                    }}
                  >
                    {weapon.rank}
                  </span>
                  <div
                    onClick={() => setPreviewWeapon({ name: weapon.name, image: weapon.image })}
                    style={{
                      width: 22,
                      height: 22,
                      position: 'relative',
                      overflow: 'hidden',
                      flexShrink: 0,
                      border: '1px solid rgba(255,255,255,0.08)',
                      cursor: 'pointer',
                    }}
                  >
                    <Image
                      src={weapon.image}
                      alt={weapon.name}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                  <span
                    className="truncate font-sans"
                    style={{ color: '#e5e5e5', cursor: 'pointer' }}
                    onClick={() => setPreviewWeapon({ name: weapon.name, image: weapon.image })}
                  >
                    {weapon.name}
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {/* Usage bar */}
                  <div
                    style={{
                      width: 48,
                      height: 3,
                      background: 'rgba(255,255,255,0.06)',
                      overflow: 'hidden',
                    }}
                    className="hidden sm:block"
                  >
                    <div
                      style={{
                        width: `${(weapon.usage / weaponMetaData[0].usage) * 100}%`,
                        height: '100%',
                        background: 'linear-gradient(90deg, rgba(194,255,11,0.3), rgba(194,255,11,0.6))',
                      }}
                    />
                  </div>
                  <span className="font-bold tabular-nums" style={{ color: '#c2ff0b' }}>
                    {weapon.usage}%
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* See All Meta Button */}
          <button
            onClick={() => setShowModal(true)}
            className="w-full mt-4 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
            style={{
              padding: '8px 16px',
              fontSize: '0.65rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: '#c2ff0b',
              background: 'rgba(194,255,11,0.06)',
              border: '1px solid rgba(194,255,11,0.2)',
              cursor: 'pointer',
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path d="M4 6h16M4 12h16M4 18h16" stroke="#c2ff0b" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            See All Meta
          </button>
        </div>
      </div>

      {/* Full Meta Modal — portaled to body to escape stacking contexts */}
      {mounted && showModal && createPortal(
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)' }}
          onClick={() => setShowModal(false)}
        >
          <div
            className="game-card w-full max-w-lg max-h-[80vh] flex flex-col"
            style={{ border: '1px solid rgba(194,255,11,0.15)' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              className="px-4 md:px-5 py-3 flex items-center justify-between flex-shrink-0"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="#c2ff0b" strokeWidth="1.5" strokeLinejoin="round" />
                  <path d="M2 17l10 5 10-5" stroke="#c2ff0b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M2 12l10 5 10-5" stroke="#c2ff0b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <h2 className="text-base md:text-lg font-semibold" style={{ color: '#e5e5e5' }}>
                  Full Weapon Meta
                </h2>
              </div>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  color: 'rgba(255,255,255,0.4)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 4,
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* Modal List */}
            <div className="p-3 md:p-5 space-y-1 md:space-y-1.5 overflow-y-auto">
              {weaponMetaData.map((weapon) => (
                <div
                  key={weapon.rank}
                  className="flex items-center justify-between font-mono text-xs md:text-sm transition-all hover:scale-[1.02]"
                  style={{
                    padding: '5px 10px',
                    background: weapon.rank <= 3 ? 'rgba(194,255,11,0.04)' : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${weapon.rank <= 3 ? 'rgba(194,255,11,0.12)' : 'rgba(255,255,255,0.04)'}`,
                    cursor: 'default',
                  }}
                >
                  <div className="flex items-center gap-2 md:gap-3 min-w-0">
                    <span
                      className="font-bold tabular-nums"
                      style={{
                        color: weapon.rank <= 3 ? '#c2ff0b' : 'rgba(255,255,255,0.3)',
                        width: 20,
                        textAlign: 'right',
                      }}
                    >
                      {weapon.rank}
                    </span>
                    <div
                      style={{
                        width: 22,
                        height: 22,
                        position: 'relative',
                        overflow: 'hidden',
                        flexShrink: 0,
                        border: `1px solid ${weapon.rank <= 3 ? 'rgba(194,255,11,0.15)' : 'rgba(255,255,255,0.08)'}`,
                      }}
                    >
                      <Image
                        src={weapon.image}
                        alt={weapon.name}
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                    <span className="truncate font-sans" style={{ color: weapon.rank <= 3 ? '#e5e5e5' : '#a1a1a1' }}>
                      {weapon.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div
                      style={{
                        width: 48,
                        height: 3,
                        background: 'rgba(255,255,255,0.06)',
                        overflow: 'hidden',
                      }}
                      className="hidden sm:block"
                    >
                      <div
                        style={{
                          width: `${(weapon.usage / weaponMetaData[0].usage) * 100}%`,
                          height: '100%',
                          background: weapon.rank <= 3
                            ? 'linear-gradient(90deg, rgba(194,255,11,0.4), rgba(194,255,11,0.7))'
                            : 'linear-gradient(90deg, rgba(194,255,11,0.2), rgba(194,255,11,0.5))',
                        }}
                      />
                    </div>
                    <span
                      className="font-bold tabular-nums"
                      style={{ color: weapon.rank <= 3 ? '#c2ff0b' : 'rgba(194,255,11,0.6)' }}
                    >
                      {weapon.usage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Weapon Image Preview */}
      {mounted && previewWeapon && createPortal(
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(6px)' }}
          onClick={() => setPreviewWeapon(null)}
        >
          <div
            className="flex flex-col items-center gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="game-card relative"
              style={{
                width: 'min(500px, 90vw)',
                height: 'min(300px, 50vh)',
                border: '1px solid rgba(194,255,11,0.2)',
                background: '#0a0a0a',
              }}
            >
              <Image
                src={previewWeapon.image}
                alt={previewWeapon.name}
                fill
                style={{ objectFit: 'contain', padding: 20 }}
              />
            </div>
            <div
              className="font-semibold text-center"
              style={{ color: '#e5e5e5', fontSize: '0.85rem', letterSpacing: '0.05em' }}
            >
              {previewWeapon.name}
            </div>
            <button
              onClick={() => setPreviewWeapon(null)}
              style={{
                fontSize: '0.6rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'rgba(255,255,255,0.4)',
                background: 'none',
                border: '1px solid rgba(255,255,255,0.1)',
                padding: '4px 14px',
                cursor: 'pointer',
              }}
            >
              Close
            </button>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
