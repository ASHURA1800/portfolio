'use client';

import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { GlassCard } from '@/components/admin/ui/GlassCard';
import { cn } from '@/lib/utils';
import { authCardEntrance } from './auth-motion-presets';

export interface AuthCardProps {
  children: ReactNode;
  /** Tailwind max-width class. Defaults to `max-w-sm` (matches login). */
  maxWidth?: string;
  glow?: boolean;
  className?: string;
}

/** Glass card shell for auth forms. Reuses GlassCard + a shared entrance
 *  variant so every auth route (login, forgot/reset/change-password)
 *  animates in identically. */
export function AuthCard({ children, maxWidth = 'max-w-sm', glow = true, className }: AuthCardProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? false : 'hidden'}
      animate="show"
      exit="exit"
      variants={reduceMotion ? undefined : authCardEntrance}
      className={cn('w-full', maxWidth)}
    >
      <GlassCard glow={glow} className={cn('p-8', className)}>
        {children}
      </GlassCard>
    </motion.div>
  );
}
