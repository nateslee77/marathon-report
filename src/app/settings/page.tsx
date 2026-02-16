'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useApp } from '@/context/AppContext';
import { AVAILABLE_BADGES, getBadgeById } from '@/lib/badges';
import { BadgeIcon } from '@/components/ui/BadgeIcon';

const THEME_COLORS = [
  { name: 'Red', value: '#ff0000' },
  { name: 'Blue', value: '#0066ff' },
  { name: 'Green', value: '#00cc00' },
  { name: 'Yellow', value: '#ffcc00' },
  { name: 'Purple', value: '#8800ff' },
  { name: 'Cyan', value: '#00ccff' },
  { name: 'Orange', value: '#ff6600' },
  { name: 'Pink', value: '#ff0088' },
  { name: 'Lime', value: '#c2ff0b' },
  { name: 'White', value: '#cccccc' },
];

const MONETIZATION_TIERS = [
  {
    name: 'Free',
    price: '$0',
    features: ['Basic stats tracking', 'Match history (last 10)', 'Standard profile'],
    current: true,
  },
  {
    name: 'Pinnacle',
    price: '$9.99',
    priceNote: 'one-time',
    features: ['Get cool customization options', 'Add social links to your profile', 'All Pinnacle badges unlocked', 'Exclusive avatars', 'Card theme customization', 'Animated rank badge', 'Custom profile banner', 'Support the developer :)'],
    accent: '#ffaa00',
  },
];

const AVAILABLE_AVATARS = [
  { id: 'avatar1', src: '/images/avatars/avatar1.png' },
  { id: 'avatar2', src: '/images/avatars/avatar2.png' },
  { id: 'avatar3', src: '/images/avatars/avatar3.png' },
  { id: 'avatar4', src: '/images/avatars/avatar4.png' },
  { id: 'avatar5', src: '/images/avatars/avatar5.png' },
  { id: 'avatar6', src: '/images/avatars/avatar6.png' },
  { id: 'avatar7', src: '/images/avatars/avatar7.png' },
];

const CUSTOMIZATION_OPTIONS = [
  { label: 'Animated Avatar Border', description: 'Choose an animated border effect for your avatar', tier: 'pinnacle' as const, hasSubPicker: true },
  { label: 'Link Social Media', description: 'Link a social media platform to your profile', tier: 'pinnacle' as const },
  { label: 'Custom Bio', description: 'Add a short bio to your player profile', tier: 'pinnacle' as const },
];

const BORDER_STYLES = [
  { id: 'none' as const, name: 'None', description: 'No border animation' },
  { id: 'pulse-glow' as const, name: 'Pulse Glow', description: 'Pulsing glow effect' },
  { id: 'spinning-gradient' as const, name: 'Spinning Gradient', description: 'Rotating gradient border' },
  { id: 'shimmer-sweep' as const, name: 'Shimmer Sweep', description: 'Light shimmer sweeps around' },
  { id: 'breathing-ring' as const, name: 'Breathing Ring', description: 'Fades in/out rhythmically' },
  { id: 'electric-arc' as const, name: 'Electric Arc', description: 'Crackling spark effect' },
];

export default function SettingsPage() {
  const { user, cardThemeColor, setCardThemeColor, equippedBadges, setEquippedBadges, selectedAvatar, setSelectedAvatar, avatarBorderStyle, setAvatarBorderStyle } = useApp();
  const [selectedColor, setSelectedColor] = useState(cardThemeColor || '#8844ff');
  const [replacingSlot, setReplacingSlot] = useState<number | null>(null);
  const [borderPickerOpen, setBorderPickerOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync selectedColor when cardThemeColor changes (e.g. after hydration)
  useEffect(() => {
    if (cardThemeColor) setSelectedColor(cardThemeColor);
  }, [cardThemeColor]);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-text-tertiary text-sm">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="text-text-tertiary text-sm mb-4">You must be signed in to access settings.</div>
          <Link href="/" className="text-sm font-mono" style={{ color: '#c2ff0b' }}>
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in max-w-[1000px] mx-auto px-4 md:px-0 py-4 md:py-0">
      {/* Back */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm transition-colors duration-150 hover:opacity-80"
        style={{ color: '#c2ff0b' }}
      >
        <span style={{ fontSize: '0.75rem' }}>&larr;</span>
        Back to Home
      </Link>

      {/* Page title */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Settings</h1>
        <p className="text-sm text-text-secondary mt-1">Customize your profile and manage your account</p>
      </div>

      {/* ── Profile Section ── */}
      <div className="game-card">
        <div className="px-5 py-3.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <h2 className="text-lg font-semibold" style={{ color: '#e5e5e5' }}>Profile</h2>
        </div>
        <div className="p-5">
          <div className="flex items-center gap-5 mb-5">
            <Image
              src={user.avatar}
              alt={user.name}
              width={64}
              height={64}
              style={{ width: 64, height: 64, border: `2px solid ${selectedColor}55`, objectFit: 'cover' }}
            />
            <div>
              <div className="font-bold text-lg text-text-primary">{user.name}</div>
              <div className="font-mono text-sm text-text-tertiary">{user.tag}</div>
            </div>
          </div>

          {/* Avatar Picker */}
          <div>
            <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
              Choose Avatar
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-3">
              {AVAILABLE_AVATARS.map((avatar) => {
                const isSelected = selectedAvatar === avatar.src;
                return (
                  <button
                    key={avatar.id}
                    onClick={() => setSelectedAvatar(avatar.src)}
                    style={{
                      position: 'relative',
                      width: '100%',
                      aspectRatio: '1',
                      background: isSelected ? 'rgba(194,255,11,0.08)' : 'rgba(255,255,255,0.03)',
                      border: isSelected
                        ? `2px solid ${selectedColor}88`
                        : '1px solid rgba(255,255,255,0.08)',
                      cursor: 'pointer',
                      padding: 6,
                      transition: 'all 150ms',
                    }}
                  >
                    {isSelected && (
                      <div
                        style={{
                          position: 'absolute',
                          top: 3,
                          right: 3,
                          width: 16,
                          height: 16,
                          background: selectedColor,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          zIndex: 2,
                        }}
                      >
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                    )}
                    <Image
                      src={avatar.src}
                      alt={avatar.id}
                      width={72}
                      height={72}
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── Card Theme Color ── */}
      <div className="game-card">
        <div className="px-5 py-3.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <h2 className="text-lg font-semibold" style={{ color: '#e5e5e5' }}>Card Theme Color</h2>
          <p className="text-xs text-text-tertiary mt-1">Change the accent color of your player card</p>
        </div>
        <div className="p-5">
          <div className="flex flex-wrap gap-3">
            {THEME_COLORS.map((color) => (
              <button
                key={color.value}
                onClick={() => {
                  setSelectedColor(color.value);
                  setCardThemeColor(color.value);
                }}
                style={{
                  width: 40,
                  height: 40,
                  background: color.value,
                  border: selectedColor === color.value
                    ? '3px solid #fff'
                    : '2px solid rgba(255,255,255,0.1)',
                  cursor: 'pointer',
                  transition: 'all 150ms',
                  position: 'relative',
                }}
                title={color.name}
              >
                {selectedColor === color.value && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </button>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-3" style={{ position: 'relative' }}>
            <label className="text-xs text-text-tertiary uppercase tracking-wide flex items-center gap-2">
              Custom hex:
              <span
                style={{
                  fontSize: '0.55rem',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: '#ffcc00',
                  border: '1px solid rgba(255,204,0,0.3)',
                  padding: '1px 6px',
                  background: 'rgba(255,204,0,0.08)',
                }}
              >
                Pinnacle
              </span>
            </label>
            <input
              type="text"
              value={selectedColor}
              disabled
              className="font-mono text-sm px-3 py-1.5"
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.06)',
                color: 'rgba(255,255,255,0.3)',
                width: 120,
                cursor: 'not-allowed',
              }}
            />
            <div style={{ width: 24, height: 24, background: selectedColor, border: '1px solid rgba(255,255,255,0.1)', opacity: 0.4 }} />
          </div>
        </div>
      </div>

      {/* ── Customization Options ── */}
      <div className="game-card">
        <div className="px-5 py-3.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <h2 className="text-lg font-semibold" style={{ color: '#e5e5e5' }}>Customization</h2>
        </div>
        <div className="p-5 space-y-3">
          {CUSTOMIZATION_OPTIONS.map((option) => (
            <div key={option.label}>
              <div
                className="flex items-center justify-between"
                style={{
                  padding: '10px 14px',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.04)',
                }}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-text-primary">{option.label}</span>
                    <span
                      style={{
                        fontSize: '0.55rem',
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: '#ffcc00',
                        border: '1px solid rgba(255,204,0,0.3)',
                        padding: '1px 6px',
                        background: 'rgba(255,204,0,0.08)',
                      }}
                    >
                      Pinnacle
                    </span>
                  </div>
                  <p className="text-xs text-text-tertiary mt-0.5">{option.description}</p>
                </div>
                <button
                  onClick={() => {
                    if (option.hasSubPicker) setBorderPickerOpen(!borderPickerOpen);
                  }}
                  style={{
                    padding: '4px 14px',
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    color: '#c2ff0b',
                    background: 'rgba(194,255,11,0.08)',
                    border: '1px solid rgba(194,255,11,0.2)',
                    cursor: 'pointer',
                  }}
                >
                  Edit
                </button>
              </div>

              {/* Animated Border Picker sub-section */}
              {option.hasSubPicker && borderPickerOpen && (
                <div
                  style={{
                    padding: '12px 14px',
                    background: 'rgba(255,255,255,0.01)',
                    borderLeft: '1px solid rgba(255,255,255,0.04)',
                    borderRight: '1px solid rgba(255,255,255,0.04)',
                    borderBottom: '1px solid rgba(255,255,255,0.04)',
                  }}
                >
                  <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                    Border Style
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {BORDER_STYLES.map((style) => {
                      const isActive = avatarBorderStyle === style.id;
                      return (
                        <button
                          key={style.id}
                          onClick={() => setAvatarBorderStyle(style.id)}
                          style={{
                            padding: '8px 10px',
                            background: isActive ? `${selectedColor}15` : 'rgba(255,255,255,0.03)',
                            border: isActive ? `1.5px solid ${selectedColor}66` : '1px solid rgba(255,255,255,0.06)',
                            cursor: 'pointer',
                            textAlign: 'left',
                            transition: 'all 150ms',
                          }}
                        >
                          <div style={{ fontSize: '0.7rem', fontWeight: 600, color: isActive ? selectedColor : '#e5e5e5', marginBottom: 2 }}>
                            {style.name}
                          </div>
                          <div style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.35)' }}>
                            {style.description}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Badges ── */}
      <div className="game-card">
        <div className="px-5 py-3.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <h2 className="text-lg font-semibold" style={{ color: '#e5e5e5' }}>Badges</h2>
          <p className="text-xs text-text-tertiary mt-1">Collect and display badges on your profile</p>
        </div>
        <div className="p-5">
          {/* Equipped badges slots */}
          <div className="mb-5">
            <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
              Equipped ({equippedBadges.length}/5) — Click a slot to replace
            </div>
            <div className="flex items-center gap-3">
              {Array.from({ length: 5 }).map((_, i) => {
                const badgeId = equippedBadges[i];
                const badge = badgeId ? getBadgeById(badgeId) : null;
                const isSelected = replacingSlot === i;
                return (
                  <button
                    key={i}
                    onClick={() => setReplacingSlot(isSelected ? null : i)}
                    style={{
                      width: 48,
                      height: 48,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: isSelected ? 'rgba(194,255,11,0.08)' : 'rgba(255,255,255,0.03)',
                      border: isSelected ? '2px solid rgba(194,255,11,0.5)' : badge ? `1.5px solid ${badge.color}33` : '1.5px dashed rgba(255,255,255,0.1)',
                      cursor: 'pointer',
                      position: 'relative',
                      transition: 'all 150ms',
                    }}
                  >
                    {badge ? (
                      <BadgeIcon badge={badge} size="md" showNumber={i + 1} />
                    ) : (
                      <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.15)' }}>{i + 1}</span>
                    )}
                  </button>
                );
              })}
              {equippedBadges.length > 0 && (
                <button
                  onClick={() => { setEquippedBadges([]); setReplacingSlot(null); }}
                  style={{
                    padding: '4px 10px',
                    fontSize: '0.6rem',
                    color: '#ff4444',
                    background: 'rgba(255,68,68,0.06)',
                    border: '1px solid rgba(255,68,68,0.15)',
                    cursor: 'pointer',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  Clear
                </button>
              )}
            </div>
            {replacingSlot !== null && (
              <div style={{ fontSize: '0.6rem', color: '#c2ff0b', marginTop: 6 }}>
                Select a badge below to place in slot {replacingSlot + 1}
              </div>
            )}
          </div>

          {/* Category legend */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-1.5">
              <span style={{ width: 8, height: 8, background: '#888', display: 'inline-block' }} />
              <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Free</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span style={{ width: 8, height: 8, background: '#ffcc00', display: 'inline-block' }} />
              <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Pinnacle</span>
            </div>
          </div>

          {/* All available badges — shown as tags (same as on banner) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {AVAILABLE_BADGES.map((badge) => {
              const equippedIndex = equippedBadges.indexOf(badge.id);
              const isEquipped = equippedIndex >= 0;

              function handleClick() {
                if (replacingSlot !== null) {
                  const newBadges = [...equippedBadges];
                  const existingIdx = newBadges.indexOf(badge.id);
                  if (existingIdx >= 0) {
                    newBadges.splice(existingIdx, 1);
                  }
                  while (newBadges.length < replacingSlot) {
                    newBadges.push('');
                  }
                  if (replacingSlot < newBadges.length) {
                    newBadges[replacingSlot] = badge.id;
                  } else {
                    newBadges.push(badge.id);
                  }
                  setEquippedBadges(newBadges.filter(Boolean));
                  setReplacingSlot(null);
                } else if (isEquipped) {
                  setEquippedBadges(equippedBadges.filter((id) => id !== badge.id));
                } else if (equippedBadges.length < 5) {
                  setEquippedBadges([...equippedBadges, badge.id]);
                }
              }

              return (
                <button
                  key={badge.id}
                  onClick={handleClick}
                  style={{
                    padding: '10px',
                    background: isEquipped ? `${badge.color}15` : 'rgba(255,255,255,0.03)',
                    border: isEquipped
                      ? `2px solid ${badge.color}55`
                      : '1px solid rgba(255,255,255,0.06)',
                    position: 'relative',
                    cursor: 'pointer',
                    transition: 'all 200ms',
                    textAlign: 'left' as const,
                  }}
                >
                  {/* Equipped number */}
                  {isEquipped && (
                    <div
                      style={{
                        position: 'absolute',
                        top: 4,
                        right: 4,
                        width: 14,
                        height: 14,
                        background: badge.color,
                        color: '#000',
                        fontSize: '0.5rem',
                        fontWeight: 800,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '50%',
                      }}
                    >
                      {equippedIndex + 1}
                    </div>
                  )}

                  {/* Pinnacle crown indicator */}
                  {badge.pinnacleExclusive && (
                    <div
                      style={{
                        position: 'absolute',
                        top: 4,
                        left: 4,
                        fontSize: '0.55rem',
                        color: '#ffcc00',
                        lineHeight: 1,
                      }}
                      title="Pinnacle Exclusive"
                    >
                      ★
                    </div>
                  )}

                  {/* Badge shown as tag (same as on banner) */}
                  <div style={{ marginBottom: 6, marginTop: badge.pinnacleExclusive ? 4 : 0 }}>
                    <BadgeIcon badge={badge} size="md" variant="tag" />
                  </div>

                  {/* Description */}
                  <div
                    style={{
                      fontSize: '0.55rem',
                      color: 'rgba(255,255,255,0.3)',
                      lineHeight: 1.3,
                    }}
                  >
                    {badge.description}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Monetization Tiers ── */}
      <div>
        <h2 className="text-lg font-semibold text-text-primary mb-4">Plans</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {MONETIZATION_TIERS.map((tier) => (
            <div
              key={tier.name}
              className="game-card flex flex-col"
              style={{
                border: tier.accent
                  ? `1px solid ${tier.accent}33`
                  : '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <div className="px-5 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-text-primary">{tier.name}</span>
                  {tier.current && (
                    <span
                      style={{
                        fontSize: '0.55rem',
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: '#c2ff0b',
                        border: '1px solid rgba(194,255,11,0.3)',
                        padding: '1px 6px',
                        background: 'rgba(194,255,11,0.08)',
                      }}
                    >
                      Current
                    </span>
                  )}
                </div>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="font-mono text-xl font-bold" style={{ color: tier.accent || '#888' }}>
                    {tier.price}
                  </span>
                  {'priceNote' in tier && (
                    <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {(tier as any).priceNote}
                    </span>
                  )}
                </div>
              </div>
              <div className="p-5 flex-1">
                <ul className="space-y-2">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-xs text-text-secondary">
                      <span style={{ color: tier.accent || '#555', marginTop: 1 }}>+</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              {!tier.current && (
                <div className="px-5 pb-5">
                  <button
                    style={{
                      width: '100%',
                      padding: '8px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      color: tier.accent,
                      background: `${tier.accent}11`,
                      border: `1px solid ${tier.accent}44`,
                      cursor: 'pointer',
                      transition: 'all 150ms',
                    }}
                  >
                    Upgrade
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Spacer */}
      <div style={{ height: 24 }} />
    </div>
  );
}
