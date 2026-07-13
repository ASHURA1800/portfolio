'use client';

import type { ReactNode } from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { staggerContainer } from '@/components/admin/ui/motion-presets';

export interface CrudListProps {
  children: ReactNode;
  className?: string;
}

/** Vertical row-list layout — matches the existing pattern used by
 *  Projects and similar managers (full-width items, stacked). Renders a
 *  real <ul> since items are enumerable, discrete records. Children
 *  stagger in on mount/filter-change via `staggerContainer`. */
export function CrudList({ children, className }: CrudListProps) {
  return (
    <motion.ul
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className={cn('flex flex-col gap-3', className)}
    >
      {children}
    </motion.ul>
  );
}
