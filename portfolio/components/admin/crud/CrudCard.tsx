'use client';

import type { ReactNode } from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { staggerItem } from '@/components/admin/ui/motion-presets';

export interface CrudCardProps {
  children: ReactNode;
  className?: string;
  layoutId?: string;
}

/**
 * Drop-in motion wrapper for a single card inside CrudGrid. Participates
 * in the grid's staggerContainer (fades/rises in on mount and on
 * filter/search changes since AnimatePresence re-triggers `hidden`→`show`
 * for new keys), and adds a subtle hover lift so grids don't feel static.
 * Pass `layoutId` (e.g. the record id) to get a smooth FLIP reorder when
 * sort order changes.
 */
export function CrudCard({ children, className, layoutId }: CrudCardProps) {
  return (
    <motion.div
      layout={!!layoutId}
      layoutId={layoutId}
      variants={staggerItem}
      whileHover={{ y: -2 }}
      transition={{ layout: { duration: 0.25, ease: [0.22, 1, 0.36, 1] } }}
      className={cn('h-full', className)}
    >
      {children}
    </motion.div>
  );
}
