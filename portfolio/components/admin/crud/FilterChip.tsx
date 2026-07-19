'use client';

import { memo, type ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { cn } from '@/lib/utils';
import { EASE } from '@/components/admin/ui/motion-presets';

export interface FilterChipProps {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
  className?: string;
}

/** Single filter pill with press feedback and an animated active-state
 *  transition. Replaces the raw `<button className="...">` markup that
 *  was copy-pasted across Roadmap status filters —
 *  one implementation instead of three. */
function FilterChipImpl({ active, onClick, children, className }: FilterChipProps) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={reduceMotion ? undefined : { scale: 0.94 }}
      animate={{ backgroundColor: active ? 'var(--color-accent-500)' : 'var(--color-surface)' }}
      transition={{ duration: 0.15, ease: EASE }}
      className={cn(
        'px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border transition-[border-color]',
        active
          ? 'text-white border-[var(--color-accent-500)]'
          : 'text-[var(--color-muted)] border-[var(--color-border)] hover:border-[var(--color-border-hover)]',
        className
      )}
    >
      {children}
    </motion.button>
  );
}

export const FilterChip = memo(FilterChipImpl);
