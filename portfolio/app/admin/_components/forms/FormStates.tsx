'use client';

import { AnimatePresence, motion } from 'motion/react';
import { AlertCircle, CheckCircle2, Info, Loader2 } from 'lucide-react';
import type { ReactNode } from 'react';

// ─── shared animation ─────────────────────────────────────────────────────────

const slideIn = {
  initial: { opacity: 0, y: -4 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
  transition: { duration: 0.18, ease: [0.22, 1, 0.36, 1] as const },
};

// ─── HelperText ───────────────────────────────────────────────────────────────

export function HelperText({ children }: { children: ReactNode }) {
  return (
    <p
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.375rem',
        fontSize: 'var(--text-xs)',
        color: 'var(--color-faint)',
        lineHeight: 1.4,
        marginTop: '0.375rem',
      }}
    >
      <Info size={12} />
      {children}
    </p>
  );
}

// ─── ValidationMessage ────────────────────────────────────────────────────────

interface ValidationMessageProps {
  message?: string;
  type?: 'error' | 'success' | 'warning';
}

export function ValidationMessage({ message, type = 'error' }: ValidationMessageProps) {
  const colors = {
    error: 'var(--color-error)',
    success: 'var(--color-success)',
    warning: 'var(--color-warning)',
  };
  const icons = {
    error: AlertCircle,
    success: CheckCircle2,
    warning: AlertCircle,
  };
  const Icon = icons[type];

  return (
    <AnimatePresence>
      {message && (
        <motion.p
          {...slideIn}
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.375rem',
            fontSize: 'var(--text-xs)',
            color: colors[type],
            marginTop: '0.375rem',
            lineHeight: 1.4,
          }}
        >
          <Icon size={12} style={{ marginTop: '0.125rem', flexShrink: 0 }} />
          {message}
        </motion.p>
      )}
    </AnimatePresence>
  );
}

// ─── CharacterCounter ─────────────────────────────────────────────────────────

export function CharacterCounter({
  current,
  max,
}: {
  current: number;
  max: number;
}) {
  const pct = current / max;
  const color =
    pct > 1
      ? 'var(--color-error)'
      : pct > 0.85
      ? 'var(--color-warning)'
      : 'var(--color-faint)';

  return (
    <span
      style={{
        fontSize: 'var(--text-xs)',
        color,
        fontVariantNumeric: 'tabular-nums',
        transition: 'color 0.2s ease',
      }}
    >
      {current}/{max}
    </span>
  );
}

// ─── ErrorState ───────────────────────────────────────────────────────────────

interface BannerProps {
  message: string;
  onDismiss?: () => void;
}

export function ErrorState({ message, onDismiss }: BannerProps) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          {...slideIn}
          role="alert"
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.75rem',
            padding: '0.875rem 1rem',
            borderRadius: 'var(--radius-md)',
            background: 'var(--color-error-bg)',
            border: '1px solid rgba(255, 92, 113, 0.2)',
          }}
        >
          <AlertCircle
            size={16}
            color="var(--color-error)"
            style={{ flexShrink: 0, marginTop: '0.125rem' }}
          />
          <p
            style={{
              flex: 1,
              fontSize: 'var(--text-sm)',
              color: 'var(--color-error)',
              lineHeight: 1.5,
            }}
          >
            {message}
          </p>
          {onDismiss && (
            <button
              type="button"
              onClick={onDismiss}
              aria-label="Dismiss error"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--color-error)',
                padding: 0,
                flexShrink: 0,
                opacity: 0.7,
              }}
            >
              ✕
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── SuccessState ─────────────────────────────────────────────────────────────

export function SuccessState({ message, onDismiss }: BannerProps) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          {...slideIn}
          role="status"
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.75rem',
            padding: '0.875rem 1rem',
            borderRadius: 'var(--radius-md)',
            background: 'var(--color-success-bg)',
            border: '1px solid rgba(46, 213, 115, 0.2)',
          }}
        >
          <CheckCircle2
            size={16}
            color="var(--color-success)"
            style={{ flexShrink: 0, marginTop: '0.125rem' }}
          />
          <p
            style={{
              flex: 1,
              fontSize: 'var(--text-sm)',
              color: 'var(--color-success)',
              lineHeight: 1.5,
            }}
          >
            {message}
          </p>
          {onDismiss && (
            <button
              type="button"
              onClick={onDismiss}
              aria-label="Dismiss"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--color-success)',
                padding: 0,
                flexShrink: 0,
                opacity: 0.7,
              }}
            >
              ✕
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── LoadingOverlay (for whole-form disable while saving) ─────────────────────

export function FormLoadingOverlay({ saving }: { saving: boolean }) {
  return (
    <AnimatePresence>
      {saving && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 'var(--radius-lg)',
            background: 'rgba(8, 9, 13, 0.55)',
            backdropFilter: 'blur(2px)',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Loader2
            size={24}
            color="var(--color-accent-300)"
            style={{ animation: 'spin 0.8s linear infinite' }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
