'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { useSearchParams, useRouter } from 'next/navigation';
import { GlassCard } from '@/components/admin/ui/GlassCard';
import { modalSurface } from '@/components/admin/ui/motion-presets';
import { PasswordField } from './PasswordField';
import { PasswordStrengthMeter } from './PasswordStrengthMeter';
import { SuccessCard } from './SuccessCard';
import { ErrorCard } from './ErrorCard';

/**
 * ResetForm
 * Reset-password form. Preserves exact existing API call
 * (`/api/auth/reset-password`) and token/router logic.
 */
export function ResetForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token') ?? '';
  const reduce = useReducedMotion();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const mismatch = !!confirmPassword && password !== confirmPassword;

  // No token — show inline error state
  if (!token) {
    return (
      <motion.div
        initial={reduce ? false : 'hidden'}
        animate="show"
        variants={reduce ? undefined : modalSurface}
        className="w-full max-w-sm"
      >
        <GlassCard className="p-8 text-center">
          <div
            aria-hidden="true"
            style={{
              width: '3rem',
              height: '3rem',
              borderRadius: '50%',
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              fontSize: '1.25rem',
            }}
          >
            ⚠
          </div>
          <h2
            style={{
              fontSize: 'var(--text-lg)',
              fontWeight: 700,
              color: 'var(--color-ink)',
              marginBottom: '0.5rem',
            }}
          >
            Invalid link
          </h2>
          <p
            style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--color-muted)',
              marginBottom: '1.5rem',
              lineHeight: 'var(--leading-snug)',
            }}
          >
            No reset token found. This link may have expired.
          </p>
          <Link
            href="/admin/forgot-password"
            style={{
              fontSize: 'var(--text-sm)',
              fontWeight: 500,
              color: 'var(--color-accent-400)',
              textDecoration: 'none',
            }}
          >
            Request a new link →
          </Link>
        </GlassCard>
      </motion.div>
    );
  }

  if (success) {
    return (
      <SuccessCard
        title="Password reset"
        body="Your password has been reset successfully."
        footnote="Redirecting to login…"
        linkHref="/admin/login"
        linkLabel="Go to login"
      />
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || mismatch) return;
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password, confirmPassword }),
      });
      let data: { error?: string } = {};
      try { data = await res.json(); } catch { /* non-JSON */ }

      if (res.status === 429) {
        setError('Too many attempts. Please wait before trying again.');
        setLoading(false);
        return;
      }
      if (!res.ok) {
        setError(data.error ?? 'Failed to reset password. Please try again.');
        setLoading(false);
        return;
      }
      setSuccess(true);
      setTimeout(() => router.push('/admin/login'), 2500);
    } catch {
      setError('Network error. Please try again.');
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={reduce ? false : 'hidden'}
      animate="show"
      variants={reduce ? undefined : modalSurface}
      className="w-full max-w-sm"
    >
      <GlassCard glow className="p-8">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div
            aria-hidden="true"
            style={{
              width: '3rem',
              height: '3rem',
              borderRadius: 'var(--radius-xl)',
              background:
                'linear-gradient(135deg, var(--color-accent-500) 0%, var(--color-accent2-500) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              boxShadow: '0 0 24px rgba(124,77,255,0.3)',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1
            style={{
              fontSize: 'var(--text-xl)',
              fontWeight: 700,
              color: 'var(--color-ink)',
              letterSpacing: 'var(--tracking-tight)',
              marginBottom: '0.3rem',
            }}
          >
            Reset password
          </h1>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-faint)' }}>
            Choose a strong new password
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
        >
          <AnimatePresence mode="wait">
            {error && <ErrorCard key={error} message={error} />}
          </AnimatePresence>

          {/* New password + strength */}
          <div>
            <PasswordField
              id="password"
              label="New password"
              hint="min. 8 characters"
              value={password}
              onChange={setPassword}
              disabled={loading}
              autoComplete="new-password"
            />
            <PasswordStrengthMeter password={password} />
          </div>

          {/* Confirm */}
          <PasswordField
            id="confirmPassword"
            label="Confirm new password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            disabled={loading}
            autoComplete="new-password"
            error={mismatch}
          />
          <AnimatePresence>
            {mismatch && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                style={{
                  fontSize: 'var(--text-xs)',
                  color: 'rgb(248,113,113)',
                  marginTop: '-0.5rem',
                }}
              >
                Passwords don&apos;t match
              </motion.p>
            )}
          </AnimatePresence>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || mismatch || password.length < 8}
            className="admin-btn admin-btn-primary"
            style={{ width: '100%', justifyContent: 'center', marginTop: '0.25rem' }}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span
                  style={{
                    width: '0.875rem',
                    height: '0.875rem',
                    borderRadius: '50%',
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderTopColor: 'white',
                    animation: 'spin 0.7s linear infinite',
                    display: 'inline-block',
                    flexShrink: 0,
                  }}
                />
                Resetting…
              </span>
            ) : (
              'Reset password'
            )}
          </button>

          <div style={{ textAlign: 'center', paddingTop: '0.125rem' }}>
            <Link
              href="/admin/forgot-password"
              style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--color-faint)',
                textDecoration: 'none',
              }}
              className="hover:text-muted"
            >
              Request a new link
            </Link>
          </div>
        </form>
      </GlassCard>
    </motion.div>
  );
}
