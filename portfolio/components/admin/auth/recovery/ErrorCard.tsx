'use client';

import { motion, useReducedMotion } from 'motion/react';

interface ErrorCardProps {
  message: string;
}

/**
 * ErrorCard
 * Inline error alert with a translate-x shake on mount. AnimatePresence
 * is handled by the parent (RecoveryForm / ResetForm) so this stays simple.
 * Shake uses a keyframe sequence — deliberate, not frantic.
 */
export function ErrorCard({ message }: ErrorCardProps) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      role="alert"
      aria-live="assertive"
      initial={reduce ? { opacity: 0 } : { opacity: 0, x: -4 }}
      animate={
        reduce
          ? { opacity: 1 }
          : {
              opacity: 1,
              x: [0, -6, 5, -4, 3, 0],
              transition: { duration: 0.35, ease: 'easeInOut' },
            }
      }
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.5rem',
        padding: '0.625rem 0.75rem',
        borderRadius: 'var(--radius-md)',
        background: 'rgba(239,68,68,0.08)',
        border: '1px solid rgba(239,68,68,0.2)',
      }}
    >
      {/* Icon */}
      <span
        aria-hidden="true"
        style={{
          fontSize: '0.75rem',
          lineHeight: '1.5rem',
          flexShrink: 0,
          color: 'rgb(248,113,113)',
        }}
      >
        ⚠
      </span>
      <p
        style={{
          fontSize: 'var(--text-sm)',
          color: 'rgb(248,113,113)',
          lineHeight: 'var(--leading-snug)',
        }}
      >
        {message}
      </p>
    </motion.div>
  );
}
