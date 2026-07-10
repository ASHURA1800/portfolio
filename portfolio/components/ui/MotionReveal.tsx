'use client';

import { useRef } from 'react';
import type { ReactNode } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';

const EASE = [0.22, 1, 0.36, 1] as const;

interface MotionRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Entry style the element animates in from. */
  from?: 'up' | 'down' | 'left' | 'right' | 'scale' | 'blur' | 'rotate';
  /** Enables a subtle scroll-linked parallax translate on top of the reveal. */
  parallax?: number;
}

/**
 * Scroll-triggered reveal built on motion's `whileInView`, with an optional
 * parallax offset driven by `useScroll`. Reusable anywhere a section needs
 * richer entrance choreography than the plain IntersectionObserver `Reveal`.
 */
export function MotionReveal({
  children,
  className = '',
  delay = 0,
  from = 'up',
  parallax = 0,
}: MotionRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], [parallax, -parallax]);

  const variants: Record<NonNullable<MotionRevealProps['from']>, Record<string, number | string>> = {
    up: { y: 28 },
    down: { y: -28 },
    left: { x: 28 },
    right: { x: -28 },
    scale: { scale: 0.94 },
    blur: { filter: 'blur(10px)', y: 12 },
    rotate: { rotate: -4, y: 16, scale: 0.97 },
  };

  const initial = { opacity: 0, filter: 'blur(0px)', ...variants[from] };
  const animate = { opacity: 1, x: 0, y: 0, scale: 1, rotate: 0, filter: 'blur(0px)' };

  return (
    <motion.div
      ref={ref}
      initial={initial}
      whileInView={animate}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: 0.65, delay, ease: EASE }}
      style={!reduceMotion && parallax ? { y } : undefined}
      className={className}
    >
      {children}
    </motion.div>
  );
}
