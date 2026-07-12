'use client';

import { useState } from 'react';
import { AuthAlert, AuthButton, PasswordInput } from '@/components/admin/auth/shared';

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
      try {
        data = await res.json();
      } catch {
        /* non-JSON */
      }

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

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 admin-glass-panel rounded-[var(--radius-lg)] border p-[var(--admin-space-card)]"
      aria-label="Change password"
    >
      <AuthAlert error={error} success={success} />

      <PasswordInput
        id="currentPassword"
        label="Current Password"
        name="currentPassword"
        required
        autoComplete="current-password"
        disabled={loading}
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        placeholder="••••••••"
      />

      <PasswordInput
        id="newPassword"
        label="New Password"
        hint="At least 8 characters"
        name="newPassword"
        required
        autoComplete="new-password"
        disabled={loading}
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
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

      <AuthButton loading={loading} loadingLabel="Updating…">
        Change Password
      </AuthButton>
    </form>
  );
}
