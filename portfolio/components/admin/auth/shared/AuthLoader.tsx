'use client';

import { motion } from 'motion/react';
import { Spinner } from '@/components/admin/ui/Spinner';
import { cn } from '@/lib/utils';

export interface AuthLoaderProps {
  label?: string;
  className?: string;
}

/** Full-page loading state for auth routes — used as Suspense fallback
 *  (e.g. reset-password reading a search param) so the loading screen
 *  matches the page it's about to reveal, instead of a bare spinner on
 *  flat gray. Fades in to avoid a hard flash. */
export function AuthLoader({ label = 'Loading…', className }: AuthLoaderProps) {
  return (
    <div className={cn('min-h-screen flex items-center justify-center bg-[var(--color-bg)]', className)}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25 }}
        className="flex flex-col items-center gap-3 text-[var(--color-faint)]"
      >
        <Spinner size="lg" className="text-[var(--color-accent-500)]" label={label} />
        <p aria-hidden="true" className="text-sm">
          {label}
        </p>
      </motion.div>
    </div>
  );
}
