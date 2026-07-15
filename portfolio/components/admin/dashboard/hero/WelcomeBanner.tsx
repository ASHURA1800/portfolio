'use client';

import { useEffect, useState } from 'react';
import { motion, useReducedMotion, type Variants } from 'motion/react';

interface WelcomeBannerProps {
  /** Admin's display name, e.g. "Sigríður" */
  name: string;
  /** Job title, e.g. "Full-Stack Developer" */
  title: string;
}

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 5) return 'Good night';
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  if (h < 21) return 'Good evening';
  return 'Good night';
}

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.09, delayChildren: 0.1 },
  },
};

const lineVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

/**
 * WelcomeBanner
 * Staggered entrance animation for the greeting headline + sub-title.
 * Greeting is computed post-mount (useEffect), not during initial render —
 * a client component's first render pass still runs during SSR, so
 * calling getGreeting() directly in the function body doesn't actually
 * avoid a server/client clock mismatch (only moving it to useEffect does).
 * 'Good afternoon' is a neutral SSR/first-paint fallback, swapped for the
 * real greeting immediately on mount before it's perceptible.
 */
export default function WelcomeBanner({ name, title }: WelcomeBannerProps) {
  const reduceMotion = useReducedMotion();
  const [greeting, setGreeting] = useState('Good afternoon');

  useEffect(() => {
    setGreeting(getGreeting());
  }, []);

  const displayName = name?.trim() || 'Admin';

  return (
    <motion.div
      variants={containerVariants}
      initial={reduceMotion ? 'visible' : 'hidden'}
      animate="visible"
    >
      {/* Eyebrow */}
      <motion.p
        variants={lineVariants}
        style={{
          fontSize: 'var(--text-xs)',
          fontWeight: 600,
          letterSpacing: 'var(--tracking-wider)',
          textTransform: 'uppercase',
          color: 'var(--color-accent-400)',
          marginBottom: '0.375rem',
          lineHeight: 1,
        }}
      >
        {greeting}
      </motion.p>

      {/* Primary heading */}
      <motion.h1
        variants={lineVariants}
        style={{
          fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
          fontWeight: 700,
          letterSpacing: 'var(--tracking-tightest)',
          color: 'var(--color-ink)',
          lineHeight: 'var(--leading-tight)',
          marginBottom: '0.5rem',
        }}
      >
        {displayName}
      </motion.h1>

      {/* Sub-title / role */}
      {title && (
        <motion.p
          variants={lineVariants}
          style={{
            fontSize: 'var(--text-sm)',
            color: 'var(--color-muted)',
            letterSpacing: 'var(--tracking-tight)',
            lineHeight: 'var(--leading-snug)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.375rem',
          }}
        >
          <span
            aria-hidden="true"
            style={{
              display: 'inline-block',
              width: '0.3125rem',
              height: '0.3125rem',
              borderRadius: '50%',
              background:
                'linear-gradient(135deg, var(--color-accent-400), var(--color-accent2-400))',
              flexShrink: 0,
            }}
          />
          {title}
        </motion.p>
      )}
    </motion.div>
  );
}
