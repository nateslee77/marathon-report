import Link from 'next/link';

export default function PaymentCancelPage() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div
        style={{
          maxWidth: 420,
          width: '100%',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          padding: 40,
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-text-primary mb-2">Payment cancelled</h1>
        <p className="text-sm text-text-secondary mb-6">
          You have not been charged. You can upgrade to Pinnacle whenever you&apos;re ready.
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
            background: 'rgba(194,255,11,0.08)',
            border: '1px solid rgba(194,255,11,0.25)',
            textDecoration: 'none',
          }}
        >
          Back to Settings
        </Link>
      </div>
    </div>
  );
}
