'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';

export default function PaymentSuccessPage() {
  const { refreshPremiumStatus } = useApp();
  const [status, setStatus] = useState<'polling' | 'unlocked' | 'timeout'>('polling');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let attempts = 0;
    const MAX_ATTEMPTS = 8; // ~16 seconds at 2s intervals

    async function poll() {
      attempts++;
      try {
        const res = await fetch('/api/user/preferences');
        if (!res.ok) return;
        const prefs = await res.json();
        if (prefs.is_pinnacle) {
          clearInterval(intervalRef.current!);
          clearTimeout(timeoutRef.current!);
          await refreshPremiumStatus();
          setStatus('unlocked');
          return;
        }
      } catch {
        // keep polling
      }
      if (attempts >= MAX_ATTEMPTS) {
        clearInterval(intervalRef.current!);
        setStatus('timeout');
      }
    }

    intervalRef.current = setInterval(poll, 2000);
    // Also poll immediately
    poll();

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [refreshPremiumStatus]);

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div
        style={{
          maxWidth: 480,
          width: '100%',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          padding: 40,
          textAlign: 'center',
        }}
      >
        {status === 'polling' && (
          <>
            <div
              style={{
                width: 48,
                height: 48,
                border: '3px solid rgba(194,255,11,0.2)',
                borderTop: '3px solid #c2ff0b',
                borderRadius: '50%',
                margin: '0 auto 24px',
                animation: 'spin 0.8s linear infinite',
              }}
            />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            <h1 className="text-xl font-bold text-text-primary mb-2">Payment received</h1>
            <p className="text-sm text-text-secondary">Activating your Pinnacle access&hellip;</p>
          </>
        )}

        {status === 'unlocked' && (
          <>
            <div
              style={{
                width: 56,
                height: 56,
                background: 'rgba(194,255,11,0.12)',
                border: '2px solid rgba(194,255,11,0.4)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px',
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c2ff0b" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-text-primary mb-2">Pinnacle Unlocked</h1>
            <p className="text-sm text-text-secondary mb-6">
              Welcome to Pinnacle. Your exclusive avatars, animated borders, and badge customization are now available.
            </p>
            <Link
              href="/settings"
              style={{
                display: 'inline-block',
                padding: '8px 24px',
                fontSize: '0.75rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: '#c2ff0b',
                background: 'rgba(194,255,11,0.1)',
                border: '1px solid rgba(194,255,11,0.3)',
                textDecoration: 'none',
              }}
            >
              Go to Settings
            </Link>
          </>
        )}

        {status === 'timeout' && (
          <>
            <div
              style={{
                width: 56,
                height: 56,
                background: 'rgba(255,204,0,0.08)',
                border: '2px solid rgba(255,204,0,0.3)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px',
              }}
            >
              <span style={{ color: '#ffcc00', fontSize: '1.4rem', lineHeight: 1 }}>!</span>
            </div>
            <h1 className="text-xl font-bold text-text-primary mb-2">Payment processing</h1>
            <p className="text-sm text-text-secondary mb-2">
              Your payment was received but activation is taking a moment. Please refresh the page in a few seconds.
            </p>
            <p className="text-xs text-text-tertiary mb-6">
              If this persists, contact{' '}
              <a href="mailto:support@marathonintel.com" style={{ color: '#c2ff0b' }}>
                support@marathonintel.com
              </a>
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => window.location.reload()}
                style={{
                  padding: '8px 20px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: '#c2ff0b',
                  background: 'rgba(194,255,11,0.08)',
                  border: '1px solid rgba(194,255,11,0.25)',
                  cursor: 'pointer',
                }}
              >
                Refresh
              </button>
              <Link
                href="/settings"
                style={{
                  display: 'inline-block',
                  padding: '8px 20px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: 'rgba(255,255,255,0.5)',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  textDecoration: 'none',
                }}
              >
                Settings
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
