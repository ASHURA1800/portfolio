'use client';

import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { fadeIn } from '@/components/admin/ui/motion-presets';

export interface CrudPageProps {
  children: ReactNode;
}

/** Outermost shell for a manager page — responsive spacing + a fade-in on
 *  mount. Every manager page wraps its content in this so the "page
 *  animation" and "responsive spacing" requirements are automatic rather
 *  than re-implemented per manager. */
export function CrudPage({ children }: CrudPageProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? false : 'hidden'}
      animate="show"
      variants={reduceMotion ? undefined : fadeIn}
      className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8"
    >
      {children}
    </motion.div>
  );
}
