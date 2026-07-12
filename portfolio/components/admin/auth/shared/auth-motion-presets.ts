import type { Variants } from 'motion/react';

// Same easing curve used site-wide — kept consistent w/ base motion-presets.ts.
const EASE = [0.22, 1, 0.36, 1] as const;

/** Full-page entrance for an auth route (login/reset/forgot/change). */
export const authPageTransition: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.35, ease: EASE, when: 'beforeChildren', staggerChildren: 0.06 } },
  exit: { opacity: 0, transition: { duration: 0.2, ease: EASE } },
};

/** Card entrance — scale + rise, slightly more pronounced than modalSurface
 *  since auth cards are the sole focal point of the page. */
export const authCardEntrance: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 16 },
  show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.4, ease: EASE } },
  exit: { opacity: 0, scale: 0.97, y: 10, transition: { duration: 0.2, ease: EASE } },
};

/** Staggered reveal for form fields — each field rises in slightly after the last. */
export const authFieldStagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};

export const authFieldItem: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: EASE } },
};

/** Success checkmark pop — used by AuthButton + success panels. */
export const authSuccessPop: Variants = {
  hidden: { opacity: 0, scale: 0.6 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.35, ease: [0.34, 1.56, 0.64, 1] } },
};

/** Error shake — attach as `animate` w/ a toggled key, not a variant pair,
 *  since it's a one-shot attention cue rather than enter/exit state. */
export const authErrorShake = {
  x: [0, -6, 6, -4, 4, 0],
  transition: { duration: 0.4, ease: EASE },
};

/** Slow ambient float for background blobs — long duration, GPU-only props
 *  (transform + opacity), infinite yoyo. */
export const authBlobFloat = (duration = 10, delay = 0) => ({
  animate: {
    y: [0, -20, 0],
    x: [0, 10, 0],
    opacity: [0.25, 0.4, 0.25],
  },
  transition: {
    duration,
    delay,
    repeat: Infinity,
    ease: 'easeInOut',
  },
});
