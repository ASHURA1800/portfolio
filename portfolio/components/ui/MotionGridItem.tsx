'use client';

import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';

export interface MotionGridItemProps {
  children: ReactNode;
  /** Position in the grid — drives stagger delay */
  index?: number;
  className?: string;
}

const EASE = [0.22, 1, 0.36, 1] as const;
const STEP = 0.06;
const MAX_DELAY = 0.36; // cap so a long grid doesn't feel sluggish

/** Use as the direct child of DashboardGrid in place of a bare fragment —
 *  it IS the grid item (no display:contents trick needed), so grid
 *  placement is unaffected. Delays each item's entrance by `index * STEP`,
 *  capped, for a cascading feel. Renders unanimated when the user has
 *  prefers-reduced-motion set. */
export function MotionGridItem({ children, index = 0, className }: MotionGridItemProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, ease: EASE, delay: Math.min(index * STEP, MAX_DELAY) }}
    >
      {children}
    </motion.div>
  );
}
