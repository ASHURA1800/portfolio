'use client';

import { memo, type ReactNode } from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { staggerItem, EASE } from '@/components/admin/ui/motion-presets';
import { useMotionVariants } from '@/lib/motion/use-motion-variants';

export interface CrudListItemProps {
  children: ReactNode;
  className?: string;
  layoutId?: string;
}

/** Drop-in motion wrapper for a single row inside CrudList. Same
 *  stagger/layout behavior as CrudCard, rendered as <motion.li> since
 *  CrudList renders a real <ul>. */
function CrudListItemImpl({ children, className, layoutId }: CrudListItemProps) {
  const variants = useMotionVariants(staggerItem);
  return (
    <motion.li
      layout={!!layoutId}
      layoutId={layoutId}
      variants={variants}
      transition={{ layout: { duration: 0.25, ease: EASE } }}
      className={cn(className)}
    >
      {children}
    </motion.li>
  );
}

export const CrudListItem = memo(CrudListItemImpl);
