'use client';

import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { cn } from '@/lib/utils';
import { authPageTransition } from './auth-motion-presets';

export interface AuthLayoutProps {
  /** Left brand/hero panel — pass a `<BrandPanel />`. Omit for centered single-column layouts. */
  hero?: ReactNode;
  children: ReactNode;
  className?: string;
}

/**
 * Split-screen shell shared by every auth route (login, forgot-password,
 * reset-password, change-password). Hero panel is optional — routes that
 * don't need branding (e.g. change-password inside the dashboard shell)
 * can omit it and get a centered single column instead.
 */
export function AuthLayout({ hero, children, className }: AuthLayoutProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? false : 'hidden'}
      animate="show"
      exit="exit"
      variants={reduceMotion ? undefined : authPageTransition}
      className={cn('min-h-screen flex bg-[var(--color-bg)]', className)}
    >
      {hero}
      <div className="flex-1 flex items-center justify-center px-4 py-12 sm:px-8">
        {children}
      </div>
    </motion.div>
  );
}
