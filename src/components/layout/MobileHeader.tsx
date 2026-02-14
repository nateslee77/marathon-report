'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';

export function MobileHeader() {
  const { user, signIn, signOut } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header
      className="md:hidden sticky top-0 z-50 flex items-center"
      style={{
        height: 48,
        padding: '0 16px',
        background: 'rgba(10,10,10,0.92)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        position: 'relative',
      }}
    >
      {/* Center logo — positioned relative to viewport center */}
      <Link
        href="/"
        className="flex items-center gap-1.5"
        style={{ position: 'fixed', left: '47.5%', transform: 'translateX(-50%)', height: 48, zIndex: 51 }}
      >
        <span className="text-sm font-bold tracking-tight text-text-primary">
          MARATHON
        </span>
        <Image
          src="/images/Marathon_Bungie_Icon.svg"
          alt="Marathon Report"
          width={20}
          height={20}
        />
        <span className="text-sm font-bold tracking-tight text-text-tertiary">
          REPORT
        </span>
      </Link>

      {/* Spacer to push profile button to the right */}
      <div style={{ flex: 1 }} />

      {/* Right: profile / sign-in */}
      <div style={{ width: 44, display: 'flex', justifyContent: 'flex-end' }}>
        {!user ? (
          <button
            onClick={signIn}
            style={{
              width: 44,
              height: 44,
              padding: 0,
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.08)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#a1a1a1',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </button>
        ) : (
          <div ref={menuRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              style={{
                width: 44,
                height: 44,
                padding: 5,
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                overflow: 'hidden',
              }}
            >
              <div style={{
                width: 32,
                height: 32,
                border: '1px solid rgba(194,255,11,0.3)',
                overflow: 'hidden',
              }}>
                <Image
                  src={user.avatar}
                  alt={user.name}
                  width={32}
                  height={32}
                  style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            </button>

            {menuOpen && (
              <div
                className="animate-slide-down"
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 6px)',
                  right: 0,
                  width: 200,
                  background: 'rgba(14,14,14,0.98)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  boxShadow: '0 12px 32px rgba(0,0,0,0.7)',
                  zIndex: 50,
                }}
              >
                <div style={{ padding: '12px 14px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="font-semibold text-sm" style={{ color: '#e5e5e5' }}>
                    {user.name}
                  </div>
                  <div className="font-mono text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
                    {user.tag}
                  </div>
                </div>
                <div style={{ padding: '4px 0' }}>
                  <Link
                    href={`/player/${user.id}/details`}
                    onClick={() => setMenuOpen(false)}
                    className="block"
                    style={{ padding: '10px 14px', fontSize: '0.8rem', color: '#a1a1a1', textDecoration: 'none' }}
                  >
                    Profile
                  </Link>
                  <Link
                    href="/settings"
                    onClick={() => setMenuOpen(false)}
                    className="block"
                    style={{ padding: '10px 14px', fontSize: '0.8rem', color: '#a1a1a1', textDecoration: 'none' }}
                  >
                    Settings
                  </Link>
                </div>
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '4px 0' }}>
                  <button
                    onClick={() => { signOut(); setMenuOpen(false); }}
                    className="block w-full text-left"
                    style={{ padding: '10px 14px', fontSize: '0.8rem', color: '#ff4444', background: 'transparent', border: 'none', cursor: 'pointer' }}
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
