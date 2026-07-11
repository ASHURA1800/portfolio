import type { Variants } from 'motion/react';
import { DURATION, EASE_OUT } from './tokens';

/**
 * Modal/dialog surface entrance — scale + rise, matching the "arrives"
 * feel of `scale` from variants.ts but tuned with a touch more y-travel
 * so it reads distinctly from a plain popover/dropdown open.
 */
export const modalAnimation: Variants = {
  initial: { opacity: 0, scale: 0.95, y: 12 },
  animate: { opacity: 1, scale: 1, y: 0, transition: { duration: DURATION.base, ease: EASE_OUT } },
  exit: { opacity: 0, scale: 0.96, y: 8, transition: { duration: DURATION.fast, ease: EASE_OUT } },
};

/** Backdrop fade — pair with modalAnimation, mount/unmount together via one AnimatePresence. */
export const modalBackdropAnimation: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: DURATION.base, ease: EASE_OUT } },
  exit: { opacity: 0, transition: { duration: DURATION.fast, ease: EASE_OUT } },
};
