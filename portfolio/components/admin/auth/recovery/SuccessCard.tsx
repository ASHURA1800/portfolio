'use client';

import { type ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import Link from 'next/link';
import { GlassCard } from '@/components/admin/ui/GlassCard';
import { modalSurface } from '@/components/admin/ui/motion-presets';

interface SuccessCardProps {
  title: string;
  body: ReactNode;
  linkHref: string;
  linkLabel: string;
  /** Optional second line below body */
  footnote?: string;
}

const CHECK_PATH = 'M6 12 L10.5 16.5 L18 8';

/**
 * SuccessCard
 * Animated glass card shown after a successful forgot-password or reset.
 * Signature element: SVG path stroke-dashoffset draw-in for the checkmark
 * — feels more intentional than a simple emoji appearing.
 */
export function SuccessCard({
  title,
  body,
  linkHref,
  linkLabel,
  footnote,
}: SuccessCardProps) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={reduce ? false : 'hidden'}
      animate="show"
      variants={reduce ? undefined : modalSurface}
      className="w-full max-w-sm"
    >
      <GlassCard glow className="p-8 text-center">
        {/* Check circle */}
        <div
          style={{
            width: '3.25rem',
            height: '3.25rem',
            borderRadius: '50%',
            background: 'rgba(52,211,153,0.12)',
            border: '1px solid rgba(52,211,153,0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem',
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" overflow="visible">
            {/* Background circle pulse */}
            {!reduce && (
              <motion.circle
                cx="12"
                cy="12"
                r="11"
                stroke="rgba(52,211,153,0.2)"
                strokeWidth="1"
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1.4, opacity: 0 }}
                transition={{ duration: 1.2, delay: 0.5, repeat: Infinity, ease: 'easeOut' }}
              />
            )}

            {/* Check path draw-in */}
            <motion.path
              d={CHECK_PATH}
              stroke="#34D399"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              initial={reduce ? {} : { pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={
                reduce
                  ? {}
                  : { duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }
              }
            />
          </svg>
        </div>

        <h2
          style={{
            fontSize: 'var(--text-lg)',
            fontWeight: 700,
            color: 'var(--color-ink)',
            letterSpacing: 'var(--tracking-tight)',
            marginBottom: '0.625rem',
          }}
        >
          {title}
        </h2>

        <div
          style={{
            fontSize: 'var(--text-sm)',
            color: 'var(--color-muted)',
            lineHeight: 'var(--leading-relaxed)',
            marginBottom: footnote ? '0.5rem' : '1.5rem',
          }}
        >
          {body}
        </div>

        {footnote && (
          <p
            style={{
              fontSize: 'var(--text-xs)',
              color: 'var(--color-faint)',
              marginBottom: '1.5rem',
            }}
          >
            {footnote}
          </p>
        )}

        <Link
          href={linkHref}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.25rem',
            fontSize: 'var(--text-sm)',
            fontWeight: 500,
            color: 'var(--color-accent-400)',
            textDecoration: 'none',
            transition: 'color 150ms ease',
          }}
          className="hover:text-accent-300"
        >
          {linkLabel}
          <span aria-hidden="true">→</span>
        </Link>
      </GlassCard>
    </motion.div>
  );
}
