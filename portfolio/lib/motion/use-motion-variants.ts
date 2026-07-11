'use client';

import { useReducedMotion, type Variants } from 'motion/react';
import { withReducedMotion } from './reduced-motion';

/**
 * One-line reduced-motion-safe variant selection. Wraps
 * `useReducedMotion()` + `withReducedMotion()` so components don't need
 * both imports every time.
 *
 * Usage:
 *   const variants = useMotionVariants(slideUp);
 *   <motion.div variants={variants} initial="initial" animate="animate" exit="exit" />
 */
export function useMotionVariants(variants: Variants): Variants {
  const reduceMotion = useReducedMotion();
  return withReducedMotion(variants, reduceMotion);
}
