'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';

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
      <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
        <div className="w-full max-w-sm text-center bg-white/5 border border-white/8 rounded-2xl p-8">
          <p className="text-red-400 text-sm mb-4">No reset token provided.</p>
          <Link href="/admin/forgot-password" className="text-violet-400 text-sm hover:text-violet-300 transition-colors">
            Request a new reset link
          </Link>
        </div>
      </div>
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

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
        <div className="w-full max-w-sm">
          <div className="text-center bg-white/5 border border-white/8 rounded-2xl p-8">
            <div className="w-12 h-12 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mx-auto mb-4">
              <span className="text-green-400 text-xl">✓</span>
            </div>
            <h2 className="text-white font-bold text-lg mb-2">Password Reset</h2>
            <p className="text-gray-400 text-sm mb-1">
              Your password has been reset successfully.
            </p>
            <p className="text-gray-600 text-sm">Redirecting to login…</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">A</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Reset Password</h1>
          <p className="text-gray-500 text-sm mt-1">Enter your new password</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 bg-white/5 border border-white/8 rounded-2xl p-6"
        >
          {error && (
            <div role="alert" className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="password" className="block text-xs text-gray-500 mb-1.5 font-medium">
              New Password <span className="text-gray-600">(min. 8 characters)</span>
            </label>
            <input
              id="password"
              type="password"
              name="password"
              required
              autoComplete="new-password"
              disabled={loading}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/8 rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-violet-500/50 transition-all disabled:opacity-50"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-xs text-gray-500 mb-1.5 font-medium">
              Confirm New Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              required
              autoComplete="new-password"
              disabled={loading}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/8 rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-violet-500/50 transition-all disabled:opacity-50"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white text-sm font-semibold disabled:opacity-70 hover:opacity-90 transition-opacity"
          >
            {loading ? 'Resetting…' : 'Reset Password'}
          </button>

          <div className="text-center pt-1">
            <Link
              href="/admin/forgot-password"
              className="text-gray-500 text-sm hover:text-gray-400 transition-colors"
            >
              Request a new link
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
