'use client';

import { memo, type ReactNode } from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { staggerItem, EASE } from '@/components/admin/ui/motion-presets';
import { useMotionVariants } from '@/lib/motion/use-motion-variants';
import { useReducedMotion } from 'motion/react';

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
function CrudCardImpl({ children, className, layoutId }: CrudCardProps) {
  const variants = useMotionVariants(staggerItem);
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      layout={!!layoutId}
      layoutId={layoutId}
      variants={variants}
      whileHover={reduceMotion ? undefined : { y: -2 }}
      transition={{ layout: { duration: 0.25, ease: EASE } }}
      className={cn('h-full', className)}
    >
      {children}
    </motion.div>
  );
}

export const CrudCard = memo(CrudCardImpl);
