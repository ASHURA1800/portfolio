'use client';

import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { LoginBackground } from './LoginBackground';

const EASE = [0.22, 1, 0.36, 1] as const;

export interface LoginHeroProps {
  children: ReactNode;
}

/** Left-panel shell: background layer + fade/rise entrance for whatever
 *  branding content is passed in. Kept separate from LoginBranding so the
 *  branding content itself can stay a plain server component. */
export function LoginHero({ children }: LoginHeroProps) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="relative flex-1 hidden lg:flex items-center justify-center p-16 overflow-hidden">
      <LoginBackground />
      <motion.div
        className="relative z-10"
        initial={reduceMotion ? false : { opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
      >
        {children}
      </motion.div>
    </div>
  );
}
