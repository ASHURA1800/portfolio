import type { ReactNode } from 'react';
import { LoginBackground } from '@/components/admin/auth/login/LoginBackground';

interface PasswordRecoveryLayoutProps {
  children: ReactNode;
}

/**
 * PasswordRecoveryLayout
 * Full-screen shell shared by ForgotPasswordPage and ResetPasswordPage.
 * Matches the LoginLayout split-screen aesthetic: decorative hero column
 * on the left (hidden at mobile), form column on the right.
 *
 * Reuses LoginBackground directly — keeps all auth pages visually cohesive
 * without duplicating the gradient/particle system.
 */
export function PasswordRecoveryLayout({ children }: PasswordRecoveryLayoutProps) {
  return (
    <div
      className="min-h-screen flex"
      style={{ background: 'var(--color-bg)' }}
    >
      {/* ── Decorative left panel (desktop only) ─────────────── */}
      <div className="hidden lg:flex relative flex-1 items-center justify-center overflow-hidden">
        <LoginBackground />

        {/* Centered lock glyph */}
        <div
          className="relative z-10 flex flex-col items-center gap-5 select-none"
          aria-hidden="true"
        >
          {/* Orbital ring */}
          <div
            style={{
              position: 'relative',
              width: '7rem',
              height: '7rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* SVG orbital */}
            <svg
              width="112"
              height="112"
              viewBox="0 0 112 112"
              fill="none"
              style={{
                position: 'absolute',
                inset: 0,
                animation: 'recoveryOrbit 12s linear infinite',
              }}
            >
              <circle
                cx="56"
                cy="56"
                r="50"
                stroke="url(#recoveryOrbitalGrad)"
                strokeWidth="1"
                strokeDasharray="8 6"
                opacity="0.4"
              />
              <defs>
                <linearGradient id="recoveryOrbitalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="var(--color-accent-400)" />
                  <stop offset="100%" stopColor="var(--color-accent2-400)" />
                </linearGradient>
              </defs>
            </svg>

            {/* Lock icon */}
            <div
              style={{
                width: '3.5rem',
                height: '3.5rem',
                borderRadius: 'var(--radius-xl)',
                background:
                  'linear-gradient(135deg, var(--color-accent-500) 0%, var(--color-accent2-500) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 32px rgba(124,77,255,0.35)',
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect x="5" y="11" width="14" height="10" rx="2.5" fill="white" opacity="0.9" />
                <path
                  d="M8 11V7.5a4 4 0 0 1 8 0V11"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  opacity="0.75"
                />
                <circle cx="12" cy="16" r="1.25" fill="var(--color-accent-400)" />
              </svg>
            </div>
          </div>

          {/* Brand text */}
          <div className="text-center">
            <p
              style={{
                fontSize: 'var(--text-xs)',
                fontWeight: 600,
                letterSpacing: 'var(--tracking-widest)',
                textTransform: 'uppercase',
                color: 'var(--color-faint)',
                marginBottom: '0.25rem',
              }}
            >
              Account security
            </p>
            <p
              style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--color-muted)',
                maxWidth: '14rem',
                textAlign: 'center',
                lineHeight: 'var(--leading-snug)',
              }}
            >
              Your workspace is protected with secure password recovery.
            </p>
          </div>
        </div>
      </div>

      {/* ── Form column ──────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 sm:px-8">
        {children}
      </div>

      <style>{`
        @keyframes recoveryOrbit {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          svg[style*="recoveryOrbit"] { animation: none !important; }
        }
      `}</style>
    </div>
  );
}
