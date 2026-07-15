'use client';

import { useEffect } from 'react';

/**
 * Catches errors thrown by the root layout itself — the one place
 * app/error.tsx can't reach, since that boundary lives *inside* the root
 * layout and depends on it having rendered successfully. Deliberately
 * minimal: no ThemeProvider, no imported fonts, no site chrome — those are
 * exactly the things that might be broken if this ever renders. Inline
 * styles only, since app/globals.css may not be safely loadable either.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[Root Layout Error]', error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#08090D',
          color: '#F7F8FA',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          padding: '1.5rem',
        }}
      >
        <div style={{ textAlign: 'center', maxWidth: 420 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background: 'rgba(255, 92, 113, 0.1)',
              border: '1px solid rgba(255, 92, 113, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
              fontSize: 24,
              color: '#FF5C71',
            }}
          >
            ⚠
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 500, marginBottom: '0.5rem' }}>
            Something went wrong
          </h1>
          <p style={{ color: '#A0A6B5', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
            The site hit an unexpected error. Reloading usually fixes this.
          </p>
          <button
            onClick={reset}
            style={{
              padding: '0.625rem 1.5rem',
              borderRadius: 8,
              background: '#6633EE',
              color: 'white',
              fontSize: '0.875rem',
              fontWeight: 500,
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
