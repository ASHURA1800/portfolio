'use client';

import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';

const EASE = [0.22, 1, 0.36, 1] as const;

export interface MotionSectionProps {
  children: ReactNode;
}

/** Fades + rises a dashboard section in as it scrolls into view. A thin
 *  client wrapper around section content — doesn't replace the shared
 *  server-rendered DashboardSection, just animates what's inside it, so
 *  other admin pages using DashboardSection are unaffected. */
export function MotionSection({ children }: MotionSectionProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <>{children}</>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: 0.4, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
