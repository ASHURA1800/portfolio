import type { Variants } from 'motion/react';
import { DURATION, EASE_OUT } from './tokens';

const base = { duration: DURATION.slow, ease: EASE_OUT };

/** Plain opacity fade. The baseline every other preset builds on. */
export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: base },
  exit: { opacity: 0, transition: { duration: DURATION.fast, ease: EASE_OUT } },
};

/** Fades in while translating up from below — the default reveal direction site-wide. */
export const slideUp: Variants = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: base },
  exit: { opacity: 0, y: -12, transition: { duration: DURATION.fast, ease: EASE_OUT } },
};

/** Fades in while translating down from above — used for dropdowns, top-anchored reveals. */
export const slideDown: Variants = {
  initial: { opacity: 0, y: -24 },
  animate: { opacity: 1, y: 0, transition: base },
  exit: { opacity: 0, y: 12, transition: { duration: DURATION.fast, ease: EASE_OUT } },
};

/** Fades in while translating in from the right — panels/drawers anchored right. */
export const slideLeft: Variants = {
  initial: { opacity: 0, x: 24 },
  animate: { opacity: 1, x: 0, transition: base },
  exit: { opacity: 0, x: -12, transition: { duration: DURATION.fast, ease: EASE_OUT } },
};

/** Fades in while translating in from the left — panels/drawers anchored left, back-navigation. */
export const slideRight: Variants = {
  initial: { opacity: 0, x: -24 },
  animate: { opacity: 1, x: 0, transition: base },
  exit: { opacity: 0, x: 12, transition: { duration: DURATION.fast, ease: EASE_OUT } },
};

/** Fades in while scaling up slightly — modals, popovers, anything that should feel like it "arrives". */
export const scale: Variants = {
  initial: { opacity: 0, scale: 0.96 },
  animate: { opacity: 1, scale: 1, transition: base },
  exit: { opacity: 0, scale: 0.96, transition: { duration: DURATION.fast, ease: EASE_OUT } },
};

/** Fades in while unblurring — used for page transitions and hero-weight content. */
export const blur: Variants = {
  initial: { opacity: 0, filter: 'blur(8px)' },
  animate: { opacity: 1, filter: 'blur(0px)', transition: base },
  exit: { opacity: 0, filter: 'blur(8px)', transition: { duration: DURATION.fast, ease: EASE_OUT } },
};
