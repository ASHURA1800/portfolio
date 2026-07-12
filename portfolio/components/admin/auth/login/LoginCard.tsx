'use client';

import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { GlassCard } from '@/components/admin/ui/GlassCard';
import { modalSurface } from '@/components/admin/ui/motion-presets';

export interface LoginCardProps {
  children: ReactNode;
}

/** Glass card shell for the right-panel form. Reuses the existing
 *  GlassCard surface + modalSurface entrance variant rather than a new
 *  bespoke animation, so it matches the rest of the admin's motion
 *  language (modals, drawers). */
export function LoginCard({ children }: LoginCardProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? false : 'hidden'}
      animate="show"
      variants={reduceMotion ? undefined : modalSurface}
      className="w-full max-w-sm"
    >
      <GlassCard glow className="p-8">
        {children}
      </GlassCard>
    </motion.div>
  );
}
