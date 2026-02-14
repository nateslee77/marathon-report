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
    features: ['Full match history', 'Card theme customization', 'Custom profile banner', 'Priority stat updates', 'Animated rank badge', 'Fireteam analytics', 'Advanced weapon breakdown', 'Heatmaps & trends', 'API access', 'All premium badges unlocked', 'Premium avatars'],
    accent: '#ffaa00',
  },
];

const AVAILABLE_AVATARS = [
  { id: 'sushi', src: '/images/avatars/sushi.svg', name: 'Sushi', premium: false },
  { id: 'voidwalker', src: '/images/avatars/voidwalker.svg', name: 'Voidwalker', premium: false },
  { id: 'ironsight', src: '/images/avatars/ironsight.svg', name: 'Ironsight', premium: false },
  { id: 'novablade', src: '/images/avatars/novablade.svg', name: 'Novablade', premium: true },
  { id: 'phantomedge', src: '/images/avatars/phantomedge.svg', name: 'Phantomedge', premium: true },
  { id: 'quantumfist', src: '/images/avatars/quantumfist.svg', name: 'Quantumfist', premium: true },
  { id: 'shadowreaper', src: '/images/avatars/shadowreaper.svg', name: 'Shadowreaper', premium: true },
];

const CUSTOMIZATION_OPTIONS = [
  { label: 'Profile Banner', description: 'Upload a custom banner for your profile page', premium: true },
  { label: 'Animated Avatar Border', description: 'Add an animated glow effect to your avatar', premium: true },
  { label: 'Custom Bio', description: 'Add a short bio to your player profile', premium: false },
  { label: 'Featured Loadout', description: 'Pin your favorite loadout to your profile', premium: false },
  { label: 'Match Replay Highlights', description: 'Auto-generate highlight clips from your best plays', premium: true },
  { label: 'Stat Widget', description: 'Embeddable stat widget for streams and socials', premium: true },
];

export default function SettingsPage() {
  const { user, cardThemeColor, setCardThemeColor, equippedBadges, setEquippedBadges, selectedAvatar, setSelectedAvatar } = useApp();
  const [selectedColor, setSelectedColor] = useState(cardThemeColor || '#8844ff');
  const [replacingSlot, setReplacingSlot] = useState<number | null>(null);
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
              style={{ border: `2px solid ${selectedColor}55` }}
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
                    onClick={() => {
                      if (!avatar.premium) {
                        setSelectedAvatar(avatar.src);
                      }
                    }}
                    style={{
                      position: 'relative',
                      width: '100%',
                      aspectRatio: '1',
                      background: isSelected ? 'rgba(194,255,11,0.08)' : 'rgba(255,255,255,0.03)',
                      border: isSelected
                        ? '2px solid rgba(194,255,11,0.5)'
                        : avatar.premium
                          ? '1px solid rgba(255,170,0,0.25)'
                          : '1px solid rgba(255,255,255,0.08)',
                      cursor: avatar.premium ? 'not-allowed' : 'pointer',
                      padding: 6,
                      transition: 'all 150ms',
                    }}
                  >
                    {/* Lock icon for premium */}
                    {avatar.premium && (
                      <div
                        style={{
                          position: 'absolute',
                          top: 3,
                          left: 3,
                          width: 16,
                          height: 16,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: 'rgba(0,0,0,0.7)',
                          zIndex: 2,
                        }}
                      >
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#ffaa00" strokeWidth="2.5">
                          <rect x="3" y="11" width="18" height="11" rx="2" />
                          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                      </div>
                    )}
                    {/* Check mark for selected */}
                    {isSelected && (
                      <div
                        style={{
                          position: 'absolute',
                          top: 3,
                          right: 3,
                          width: 16,
                          height: 16,
                          background: '#c2ff0b',
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
                      alt={avatar.name}
                      width={72}
                      height={72}
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    />
                  </button>
                );
              })}
            </div>
            <div className="flex items-center gap-3 mt-3">
              <div className="flex items-center gap-1.5">
                <span style={{ width: 8, height: 8, background: '#888', display: 'inline-block' }} />
                <span style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Free</span>
              </div>
              <div className="flex items-center gap-1.5">
                <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#ffaa00" strokeWidth="3">
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <span style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Pinnacle</span>
              </div>
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
          <div className="mt-4 flex items-center gap-3">
            <label className="text-xs text-text-tertiary uppercase tracking-wide">Custom hex:</label>
            <input
              type="text"
              value={selectedColor}
              onChange={(e) => {
                const v = e.target.value;
                setSelectedColor(v);
                if (/^#[0-9a-fA-F]{6}$/.test(v)) {
                  setCardThemeColor(v);
                }
              }}
              className="font-mono text-sm px-3 py-1.5"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#e5e5e5',
                width: 120,
              }}
            />
            <div style={{ width: 24, height: 24, background: selectedColor, border: '1px solid rgba(255,255,255,0.1)' }} />
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
            <div
              key={option.label}
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
                  {option.premium && (
                    <span
                      style={{
                        fontSize: '0.55rem',
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: '#ffaa00',
                        border: '1px solid rgba(255,170,0,0.3)',
                        padding: '1px 6px',
                        background: 'rgba(255,170,0,0.08)',
                      }}
                    >
                      Premium
                    </span>
                  )}
                </div>
                <p className="text-xs text-text-tertiary mt-0.5">{option.description}</p>
              </div>
              <button
                style={{
                  padding: '4px 14px',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: option.premium ? '#555' : '#c2ff0b',
                  background: option.premium ? 'rgba(255,255,255,0.03)' : 'rgba(194,255,11,0.08)',
                  border: `1px solid ${option.premium ? 'rgba(255,255,255,0.06)' : 'rgba(194,255,11,0.2)'}`,
                  cursor: option.premium ? 'not-allowed' : 'pointer',
                }}
              >
                {option.premium ? 'Upgrade' : 'Edit'}
              </button>
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
              <span style={{ width: 8, height: 8, background: '#00ccff', display: 'inline-block' }} />
              <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Runner</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span style={{ width: 8, height: 8, background: '#c2ff0b', display: 'inline-block' }} />
              <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Premium Pass</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span style={{ width: 8, height: 8, background: '#888', display: 'inline-block' }} />
              <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Free</span>
            </div>
          </div>

          {/* All available badges */}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
            {AVAILABLE_BADGES.map((badge) => {
              const isPremium = badge.category === 'premium';
              const isRunner = badge.category === 'runner';
              const equippedIndex = equippedBadges.indexOf(badge.id);
              const isEquipped = equippedIndex >= 0;

              function handleClick() {
                if (replacingSlot !== null) {
                  // Replace the badge in the selected slot
                  const newBadges = [...equippedBadges];
                  // Remove this badge if already equipped elsewhere
                  const existingIdx = newBadges.indexOf(badge.id);
                  if (existingIdx >= 0) {
                    newBadges.splice(existingIdx, 1);
                  }
                  // Pad array if needed
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
                  // Remove badge
                  setEquippedBadges(equippedBadges.filter((id) => id !== badge.id));
                } else if (equippedBadges.length < 5) {
                  // Add badge to next available slot
                  setEquippedBadges([...equippedBadges, badge.id]);
                }
              }

              return (
                <button
                  key={badge.id}
                  onClick={handleClick}
                  className="text-center group"
                  style={{
                    padding: '14px 8px 10px',
                    background: isEquipped ? `${badge.color}18` : replacingSlot !== null ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.04)',
                    border: isEquipped
                      ? `2px solid ${badge.color}55`
                      : `1px solid ${isPremium ? badge.color + '33' : isRunner ? badge.color + '25' : 'rgba(255,255,255,0.06)'}`,
                    position: 'relative',
                    cursor: replacingSlot !== null || !isEquipped && equippedBadges.length < 5 || isEquipped ? 'pointer' : 'default',
                    transition: 'all 200ms',
                    textAlign: 'center' as const,
                  }}
                >
                  {/* Equipped number indicator */}
                  {isEquipped && (
                    <div
                      style={{
                        position: 'absolute',
                        top: 4,
                        left: 4,
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

                  {/* Category tag */}
                  <div
                    style={{
                      position: 'absolute',
                      top: 4,
                      right: 4,
                      fontSize: '0.4rem',
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      color: isRunner ? '#00ccff' : isPremium ? '#c2ff0b' : 'rgba(255,255,255,0.2)',
                    }}
                  >
                    {isRunner ? 'RUNNER' : isPremium ? 'PASS' : ''}
                  </div>

                  {/* Badge icon */}
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
                    <BadgeIcon badge={badge} size="lg" />
                  </div>

                  {/* Badge name */}
                  <div
                    style={{
                      fontSize: '0.65rem',
                      fontWeight: 600,
                      color: '#e5e5e5',
                      marginBottom: 2,
                    }}
                  >
                    {badge.name}
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
