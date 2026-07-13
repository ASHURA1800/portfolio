'use client';

import type { ReactNode } from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { staggerContainer } from '@/components/admin/ui/motion-presets';

export interface CrudGridProps {
  children: ReactNode;
  /** Columns at the md breakpoint and up. Default 3, matching existing managers. */
  cols?: 2 | 3 | 4;
  className?: string;
}

const COLS: Record<NonNullable<CrudGridProps['cols']>, string> = {
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-3',
  4: 'md:grid-cols-4',
};

/** Card-grid layout for CRUD items — one column on mobile, `cols` columns
 *  from md up. Children stagger in on mount/filter-change; wrap each card
 *  in a `motion.div` using the `staggerItem` variant (or CrudCard, which
 *  already does) to participate. */
export function CrudGrid({ children, cols = 3, className }: CrudGridProps) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className={cn('grid grid-cols-1 gap-4', COLS[cols], className)}
    >
      {children}
    </motion.div>
  );
}
