'use client';

import { memo, type ReactNode } from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { staggerItem } from '@/components/admin/ui/motion-presets';

export interface CrudListItemProps {
  children: ReactNode;
  className?: string;
  layoutId?: string;
}

/** Drop-in motion wrapper for a single row inside CrudList. Same
 *  stagger/layout behavior as CrudCard, rendered as <motion.li> since
 *  CrudList renders a real <ul>. */
function CrudListItemImpl({ children, className, layoutId }: CrudListItemProps) {
  return (
    <motion.li
      layout={!!layoutId}
      layoutId={layoutId}
      variants={staggerItem}
      transition={{ layout: { duration: 0.25, ease: [0.22, 1, 0.36, 1] } }}
      className={cn(className)}
    >
      {children}
    </motion.li>
  );
}

export const CrudListItem = memo(CrudListItemImpl);
