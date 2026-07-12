'use client';

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import {
  AuthLayout,
  AuthCard,
  AuthHeader,
  AuthAlert,
  AuthButton,
  AuthFooter,
  PasswordInput,
  authSuccessPop,
} from '@/components/admin/auth/shared';

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token') ?? '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!token) {
    return (
      <AuthLayout>
        <AuthCard>
          <div className="text-center">
            <p className="text-[var(--color-error)] text-sm mb-4">No reset token provided.</p>
            <AuthFooter start={{ href: '/admin/forgot-password', label: 'Request a new reset link' }} />
          </div>
        </AuthCard>
      </AuthLayout>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password, confirmPassword }),
      });

      let data: { error?: string } = {};
      try {
        data = await res.json();
      } catch {
        /* non-JSON response body */
      }

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

  if (success) {
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
            <AuthHeader title="Password reset" className="[&>h2]:text-lg" />
            <p className="text-[var(--color-faint)] text-sm mt-2 mb-1">
              Your password has been reset successfully.
            </p>
            <p className="text-[var(--color-faint)]/70 text-sm">Redirecting to login…</p>
          </div>
        </AuthCard>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <AuthCard>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5" aria-label="Reset password">
          <AuthHeader title="Reset password" subtitle="Enter your new password" />

          <AuthAlert error={error} />

          <PasswordInput
            id="password"
            label="New Password"
            hint="At least 8 characters"
            name="password"
            required
            autoComplete="new-password"
            disabled={loading}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            showStrength
            showChecklist
          />

          <PasswordInput
            id="confirmPassword"
            label="Confirm New Password"
            name="confirmPassword"
            required
            autoComplete="new-password"
            disabled={loading}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
          />

          <AuthButton loading={loading} loadingLabel="Resetting…">
            Reset Password
          </AuthButton>

          <AuthFooter start={{ href: '/admin/forgot-password', label: 'Request a new link' }} />
        </form>
      </AuthCard>
    </AuthLayout>
  );
}
