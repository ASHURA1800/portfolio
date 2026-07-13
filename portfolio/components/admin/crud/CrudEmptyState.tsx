'use client';

import type { ReactNode } from 'react';
import { motion } from 'motion/react';
import { Inbox } from 'lucide-react';
import { EmptyState } from '@/components/admin/ui/EmptyState';
import { fadeIn } from '@/components/admin/ui/motion-presets';

export interface CrudEmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  /** Typically a "+ New X" button, so the empty state doubles as a call to action */
  action?: ReactNode;
}

/** Empty state for a CRUD list with zero items (or zero matches for the
 *  current search/filter). Fades in rather than popping in — noticeable
 *  since it usually replaces a populated grid right after a filter
 *  change. Reuses the existing EmptyState primitive for layout. */
export function CrudEmptyState({ title, description, icon, action }: CrudEmptyStateProps) {
  return (
    <motion.div variants={fadeIn} initial="hidden" animate="show">
      <EmptyState icon={icon ?? <Inbox />} title={title} description={description} action={action} />
    </motion.div>
  );
}
