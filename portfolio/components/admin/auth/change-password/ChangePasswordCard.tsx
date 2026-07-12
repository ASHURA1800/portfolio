'use client';

import { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { GlassCard } from '@/components/admin/ui/GlassCard';
import { PasswordField } from '@/components/admin/auth/recovery/PasswordField';
import { PasswordStrengthMeter } from '@/components/admin/auth/recovery/PasswordStrengthMeter';
import { ErrorCard } from '@/components/admin/auth/recovery/ErrorCard';
import { PasswordChecklist } from './PasswordChecklist';
import { SuccessBanner } from './SuccessBanner';

/**
 * ChangePasswordCard
 * Authenticated change-password form. Preserves the exact existing API call
 * (`/api/auth/change-password`) and all state logic — only the UI is new.
 *
 * Features:
 *  - Current password (show/hide)
 *  - New password (show/hide) + strength meter + checklist
 *  - Confirm password (show/hide) + mismatch validation
 *  - Animated success banner + error card
 *  - Loading spinner on submit
 */
export function ChangePasswordCard() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const mismatch = !!confirmPassword && newPassword !== confirmPassword;
  const canSubmit =
    !loading &&
    currentPassword.length > 0 &&
    newPassword.length >= 8 &&
    !mismatch;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
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

  return (
    <GlassCard className="p-6 max-w-md">
      <form
        onSubmit={handleSubmit}
        style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem' }}
      >
        {/* Feedback banners */}
        <AnimatePresence mode="wait">
          {error   && <ErrorCard   key={`err-${error}`}   message={error} />}
          {success && <SuccessBanner key={`ok-${success}`} message={success} />}
        </AnimatePresence>

        {/* ── Section: current ────────────────────────────────── */}
        <div>
          <p
            style={{
              fontSize: 'var(--text-xs)',
              fontWeight: 600,
              letterSpacing: 'var(--tracking-wider)',
              textTransform: 'uppercase',
              color: 'var(--color-faint)',
              marginBottom: '0.625rem',
            }}
          >
            Current
          </p>
          <PasswordField
            id="currentPassword"
            label="Current password"
            value={currentPassword}
            onChange={setCurrentPassword}
            disabled={loading}
            autoComplete="current-password"
          />
        </div>

        {/* Divider */}
        <div
          aria-hidden="true"
          style={{
            height: '1px',
            background: 'rgba(255,255,255,0.06)',
            margin: '0 -0.25rem',
          }}
        />

        {/* ── Section: new ─────────────────────────────────────── */}
        <div>
          <p
            style={{
              fontSize: 'var(--text-xs)',
              fontWeight: 600,
              letterSpacing: 'var(--tracking-wider)',
              textTransform: 'uppercase',
              color: 'var(--color-faint)',
              marginBottom: '0.625rem',
            }}
          >
            New
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            {/* New password + strength + checklist */}
            <div>
              <PasswordField
                id="newPassword"
                label="New password"
                hint="min. 8 characters"
                value={newPassword}
                onChange={setNewPassword}
                disabled={loading}
                autoComplete="new-password"
              />
              <PasswordStrengthMeter password={newPassword} />
              <PasswordChecklist password={newPassword} />
            </div>

            {/* Confirm */}
            <div>
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
                  <p
                    style={{
                      fontSize: 'var(--text-xs)',
                      color: 'rgb(248,113,113)',
                      marginTop: '0.25rem',
                    }}
                  >
                    Passwords don&apos;t match
                  </p>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={!canSubmit}
          className="admin-btn admin-btn-primary"
          style={{ alignSelf: 'flex-start', minWidth: '10rem', justifyContent: 'center' }}
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
              Updating…
            </span>
          ) : (
            'Change password'
          )}
        </button>
      </form>
    </GlassCard>
  );
}
