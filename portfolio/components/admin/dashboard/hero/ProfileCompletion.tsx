'use client';

import { motion, useReducedMotion } from 'motion/react';

interface CompletionItem {
  key: string;
  label: string;
  done: boolean;
}

interface ProfileCompletionProps {
  items: CompletionItem[];
  /** Label shown in center of ring */
  centerLabel?: string;
}

const RADIUS = 28;
const STROKE = 3.5;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/**
 * ProfileCompletion
 * Radial SVG ring showing portfolio completeness, with an animated stroke
 * dashoffset transition on mount.
 *
 * Pure display — receives pre-computed completion data from server component.
 */
export default function ProfileCompletion({
  items,
  centerLabel = 'complete',
}: ProfileCompletionProps) {
  const reduceMotion = useReducedMotion();
  const done = items.filter((i) => i.done).length;
  const total = items.length;
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
  const dash = (pct / 100) * CIRCUMFERENCE;

  const allDone = done === total;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        padding: '0.875rem 1rem',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 'var(--radius-lg)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        minWidth: 0,
      }}
    >
      {/* Ring */}
      <div style={{ flexShrink: 0, position: 'relative' }}>
        <svg
          width={RADIUS * 2 + STROKE * 2 + 4}
          height={RADIUS * 2 + STROKE * 2 + 4}
          viewBox={`0 0 ${RADIUS * 2 + STROKE * 2 + 4} ${RADIUS * 2 + STROKE * 2 + 4}`}
          aria-hidden="true"
        >
          <circle
            cx={RADIUS + STROKE + 2}
            cy={RADIUS + STROKE + 2}
            r={RADIUS}
            fill="none"
            stroke="rgba(255,255,255,0.07)"
            strokeWidth={STROKE}
          />
          <motion.circle
            cx={RADIUS + STROKE + 2}
            cy={RADIUS + STROKE + 2}
            r={RADIUS}
            fill="none"
            stroke={
              allDone
                ? 'var(--color-success)'
                : 'url(#heroRingGradient)'
            }
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            initial={{ strokeDashoffset: CIRCUMFERENCE }}
            animate={{ strokeDashoffset: reduceMotion ? CIRCUMFERENCE - dash : CIRCUMFERENCE - dash }}
            transition={{ duration: reduceMotion ? 0 : 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
            transform={`rotate(-90 ${RADIUS + STROKE + 2} ${RADIUS + STROKE + 2})`}
          />
          <defs>
            <linearGradient id="heroRingGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--color-accent-400)" />
              <stop offset="100%" stopColor="var(--color-accent2-400)" />
            </linearGradient>
          </defs>
        </svg>

        {/* Percentage in ring center */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 0,
          }}
        >
          <span
            style={{
              fontSize: '0.8125rem',
              fontWeight: 700,
              color: allDone ? 'var(--color-success)' : 'var(--color-ink)',
              lineHeight: 1,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {pct}%
          </span>
        </div>
      </div>

      {/* Text */}
      <div style={{ minWidth: 0 }}>
        <div
          style={{
            fontSize: 'var(--text-xs)',
            fontWeight: 600,
            color: 'var(--color-muted)',
            letterSpacing: 'var(--tracking-tight)',
            marginBottom: '0.125rem',
          }}
        >
          Portfolio {centerLabel}
        </div>
        <div
          style={{
            fontSize: 'var(--text-xs)',
            color: 'var(--color-faint)',
            lineHeight: 'var(--leading-snug)',
          }}
        >
          {allDone ? (
            <span style={{ color: 'var(--color-success)' }}>All sections filled ✓</span>
          ) : (
            <>
              {done}/{total} sections filled
              {total - done > 0 && (
                <span style={{ color: 'var(--color-warning)', marginLeft: '0.25rem' }}>
                  · {total - done} to go
                </span>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
