'use client';

import { motion } from 'motion/react';
import { useReducedMotion } from 'motion/react';

interface WorkspaceStatusProps {
  /** Shown alongside the status indicator */
  label?: string;
}

/**
 * WorkspaceStatus
 * Small "system online" indicator with a pulsing dot. Communicates that
 * the admin workspace is live and connected — a trust signal, not decoration.
 */
export default function WorkspaceStatus({
  label = 'Workspace active',
}: WorkspaceStatusProps) {
  const reduceMotion = useReducedMotion();

  return (
    <div
      role="status"
      aria-label={label}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.4375rem',
        padding: '0.25rem 0.625rem 0.25rem 0.4375rem',
        borderRadius: 'var(--radius-full)',
        background: 'rgba(46, 213, 115, 0.08)',
        border: '1px solid rgba(46, 213, 115, 0.18)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        userSelect: 'none',
      }}
    >
      {/* Pulsing dot */}
      <span
        style={{ position: 'relative', width: '0.5rem', height: '0.5rem', flexShrink: 0 }}
      >
        {/* Ping ring */}
        {!reduceMotion && (
          <motion.span
            animate={{ scale: [1, 2], opacity: [0.6, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              background: 'var(--color-success)',
            }}
          />
        )}
        {/* Solid dot */}
        <span
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            background: 'var(--color-success)',
          }}
        />
      </span>

      <span
        style={{
          fontSize: 'var(--text-xs)',
          fontWeight: 500,
          color: 'var(--color-success)',
          letterSpacing: 'var(--tracking-tight)',
          lineHeight: 1,
        }}
      >
        {label}
      </span>
    </div>
  );
}
