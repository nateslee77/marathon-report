'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';

export function DesktopAuthButton() {
  const { data: session } = useSession();
  const { selectedAvatar } = useApp();
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
    <div className="hidden md:block absolute top-6 right-6 z-50">
      {!session ? (
        <button
          onClick={() => signIn('bungie')}
          style={{
            padding: '10px 20px',
            background: 'rgba(194,255,11,0.08)',
            border: '1px solid rgba(194,255,11,0.2)',
            color: '#c2ff0b',
            fontSize: '0.75rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            cursor: 'pointer',
            transition: 'all 150ms',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(194,255,11,0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(194,255,11,0.08)';
          }}
        >
          Sign in
        </button>
      ) : (
        <div ref={menuRef} style={{ position: 'relative' }}>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            style={{
              width: 44,
              height: 44,
              padding: 0,
              background: 'transparent',
              border: '1px solid rgba(194,255,11,0.3)',
              cursor: 'pointer',
              overflow: 'hidden',
            }}
          >
            <Image
              src={selectedAvatar}
              alt={session.user.name || 'User'}
              width={44}
              height={44}
              style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover' }}
            />
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
                  {session.user.name}
                </div>
                <div className="font-mono text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
                  #{session.user.bungieMembershipId?.slice(-4)}
                </div>
              </div>
              <div style={{ padding: '4px 0' }}>
                <Link
                  href={`/player/${session.user.bungieMembershipId}/details`}
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
  );
}
