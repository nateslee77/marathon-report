'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <div className="text-text-tertiary text-sm mb-4">Something went wrong.</div>
        <button
          onClick={reset}
          className="text-sm font-mono"
          style={{
            color: '#c2ff0b',
            background: 'rgba(194,255,11,0.08)',
            border: '1px solid rgba(194,255,11,0.2)',
            padding: '8px 20px',
            cursor: 'pointer',
          }}
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
