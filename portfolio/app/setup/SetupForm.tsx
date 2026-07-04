'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function SetupForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, confirmPassword }),
      });

      let data: { error?: string } = {};
      try { data = await res.json(); } catch { /* non-JSON */ }

      if (!res.ok) {
        setError(data.error ?? 'Setup failed. Please try again.');
        setLoading(false);
        return;
      }

      router.push('/admin');
      router.refresh();
    } catch {
      setError('Network error. Please check your connection.');
      setLoading(false);
    }
  };

  const inputClass =
    'w-full bg-white/5 border border-white/8 rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-violet-500/50 transition-all disabled:opacity-50';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">✦</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Portfolio Setup</h1>
          <p className="text-gray-500 text-sm mt-1">Create your owner account to get started</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 bg-white/5 border border-white/8 rounded-2xl p-6"
        >
          {error && (
            <div
              role="alert"
              className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
            >
              {error}
            </div>
          )}

          <div>
            <label htmlFor="setup-email" className="block text-xs text-gray-500 mb-1.5 font-medium">
              Email
            </label>
            <input
              id="setup-email"
              type="email"
              required
              autoComplete="email"
              disabled={loading}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="setup-password" className="block text-xs text-gray-500 mb-1.5 font-medium">
              Password <span className="text-gray-600">(min. 8 characters)</span>
            </label>
            <input
              id="setup-password"
              type="password"
              required
              autoComplete="new-password"
              disabled={loading}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
              placeholder="••••••••"
            />
          </div>

          <div>
            <label htmlFor="setup-confirm" className="block text-xs text-gray-500 mb-1.5 font-medium">
              Confirm Password
            </label>
            <input
              id="setup-confirm"
              type="password"
              required
              autoComplete="new-password"
              disabled={loading}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={inputClass}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white text-sm font-semibold disabled:opacity-70 hover:opacity-90 transition-opacity"
          >
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-xs text-gray-700 mt-4">
          This page is only visible before your first login.
        </p>
      </div>
    </div>
  );
}
