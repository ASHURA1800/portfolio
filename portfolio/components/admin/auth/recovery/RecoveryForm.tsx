'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { GlassCard } from '@/components/admin/ui/GlassCard';
import { modalSurface } from '@/components/admin/ui/motion-presets';
import { ErrorCard } from './ErrorCard';
import { SuccessCard } from './SuccessCard';

/**
 * RecoveryForm
 * Forgot-password form. Preserves the exact existing API call
 * (`/api/auth/forgot-password`) and state logic — only the UI changes.
 */
export function RecoveryForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const reduce = useReducedMotion();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.status === 429) {
        setError('Too many requests. Please wait before trying again.');
        return;
      }
      setSubmitted(true);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <SuccessCard
        title="Check your email"
        body="If that email is registered, we've sent a reset link. Check your inbox and spam folder."
        footnote="The link expires in 1 hour."
        linkHref="/admin/login"
        linkLabel="Back to login"
      />
    );
  }

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
              <rect x="5" y="11" width="14" height="10" rx="2.5" fill="white" opacity="0.9" />
              <path d="M8 11V7.5a4 4 0 0 1 8 0V11" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.75" />
              <circle cx="12" cy="16" r="1.25" fill="var(--color-accent-400)" />
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
            Forgot password?
          </h1>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-faint)' }}>
            Enter your email to receive a reset link
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <AnimatePresence mode="wait">
            {error && <ErrorCard key={error} message={error} />}
          </AnimatePresence>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              style={{
                display: 'block',
                fontSize: 'var(--text-xs)',
                fontWeight: 600,
                color: 'var(--color-muted)',
                letterSpacing: 'var(--tracking-tight)',
                marginBottom: '0.375rem',
              }}
            >
              Email address
            </label>
            <input
              id="email"
              type="email"
              name="email"
              required
              autoComplete="email"
              disabled={loading}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              className="admin-input"
              style={{ width: '100%', boxSizing: 'border-box' }}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="admin-btn admin-btn-primary"
            style={{ width: '100%', justifyContent: 'center', position: 'relative' }}
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
                Sending…
              </span>
            ) : (
              'Send reset link'
            )}
          </button>

          <div style={{ textAlign: 'center', paddingTop: '0.25rem' }}>
            <Link
              href="/admin/login"
              style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--color-faint)',
                textDecoration: 'none',
                transition: 'color 150ms ease',
              }}
              className="hover:text-muted"
            >
              ← Back to login
            </Link>
          </div>
        </form>
      </GlassCard>
    </motion.div>
  );
}
