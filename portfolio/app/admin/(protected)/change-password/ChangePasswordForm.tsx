'use client';

import { useState } from 'react';

export function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
      });

      let data: { error?: string; message?: string } = {};
      try { data = await res.json(); } catch { /* non-JSON */ }

      if (res.status === 429) {
        setError('Too many attempts. Please wait before trying again.');
        return;
      }

      if (!res.ok) {
        setError(data.error ?? 'Failed to change password. Please try again.');
        return;
      }

      setSuccess('Password changed successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full bg-white/5 border border-white/8 rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-violet-500/50 transition-all disabled:opacity-50';

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-white/5 border border-white/8 rounded-2xl p-6"
    >
      {error && (
        <div role="alert" className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}
      {success && (
        <div role="status" className="p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
          {success}
        </div>
      )}

      <div>
        <label htmlFor="currentPassword" className="block text-xs text-gray-500 mb-1.5 font-medium">
          Current Password
        </label>
        <input
          id="currentPassword"
          type="password"
          name="currentPassword"
          required
          autoComplete="current-password"
          disabled={loading}
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className={inputClass}
          placeholder="••••••••"
        />
      </div>

      <div>
        <label htmlFor="newPassword" className="block text-xs text-gray-500 mb-1.5 font-medium">
          New Password <span className="text-gray-600">(min. 8 characters)</span>
        </label>
        <input
          id="newPassword"
          type="password"
          name="newPassword"
          required
          autoComplete="new-password"
          disabled={loading}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className={inputClass}
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
          className={inputClass}
          placeholder="••••••••"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white text-sm font-semibold disabled:opacity-70 hover:opacity-90 transition-opacity"
      >
        {loading ? 'Updating…' : 'Change Password'}
      </button>
    </form>
  );
}
