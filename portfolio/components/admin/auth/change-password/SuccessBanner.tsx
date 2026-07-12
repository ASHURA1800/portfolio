'use client';

import { motion, useReducedMotion } from 'motion/react';

interface SuccessBannerProps {
  message: string;
}

/**
 * SuccessBanner
 * Inline success notification for the change-password card. Slides down
 * from above + fades in. Uses the same draw-in check approach as SuccessCard
 * but in a compact horizontal banner format.
 */
export function SuccessBanner({ message }: SuccessBannerProps) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      role="status"
      aria-live="polite"
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.625rem',
        padding: '0.625rem 0.75rem',
        borderRadius: 'var(--radius-md)',
        background: 'rgba(52,211,153,0.08)',
        border: '1px solid rgba(52,211,153,0.2)',
      }}
    >
      {/* Animated check */}
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden="true"
        style={{ flexShrink: 0 }}
      >
        <motion.path
          d="M3.5 8 L6.5 11 L12.5 5"
          stroke="rgb(52,211,153)"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={reduce ? {} : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.4, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <p
        style={{
          fontSize: 'var(--text-sm)',
          color: 'rgb(110,231,183)',
          fontWeight: 500,
        }}
      >
        {message}
      </p>
    </motion.div>
  );
}
