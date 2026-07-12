'use client';

import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import {
  AuthLayout,
  AuthCard,
  AuthHeader,
  AuthAlert,
  AuthInput,
  AuthButton,
  AuthFooter,
  authSuccessPop,
} from '@/components/admin/auth/shared';

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

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
      <AuthLayout>
        <AuthCard>
          <div className="text-center">
            <motion.div
              initial="hidden"
              animate="show"
              variants={authSuccessPop}
              className="w-12 h-12 rounded-full bg-[var(--color-success-bg)] border border-[var(--color-success)]/30 flex items-center justify-center mx-auto mb-4"
            >
              <CheckCircle2 size={22} className="text-[var(--color-success)]" />
            </motion.div>
            <AuthHeader title="Check your email" className="[&>h2]:text-lg" />
            <p className="text-[var(--color-faint)] text-sm mb-6 mt-2 leading-relaxed">
              If that email is registered, we&apos;ve sent a reset link. Check your inbox and spam folder. The
              link expires in 1 hour.
            </p>
            <AuthFooter start={{ href: '/admin/login', label: 'Back to login' }} />
          </div>
        </AuthCard>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <AuthCard>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5" aria-label="Forgot password">
          <AuthHeader title="Forgot password" subtitle="Enter your email to receive a reset link" />

          <AuthAlert error={error} />

          <AuthInput
            id="email"
            label="Email"
            type="email"
            name="email"
            required
            autoComplete="email"
            disabled={loading}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@example.com"
          />

          <AuthButton loading={loading} loadingLabel="Sending…">
            Send Reset Link
          </AuthButton>

          <AuthFooter start={{ href: '/admin/login', label: 'Back to login' }} />
        </form>
      </AuthCard>
    </AuthLayout>
  );
}
