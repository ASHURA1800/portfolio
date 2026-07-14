import type { Variants } from 'motion/react';

// Same easing curve used site-wide (MotionReveal, PageTransition) — kept
// consistent so admin and public-site motion feel like one product.
/** Single easing curve used across the entire app (admin + public site)
 *  so every animation — modals, cards, page transitions, hovers — reads
 *  as one motion language rather than several similar-but-different ones.
 *  Exported so call sites that build ad-hoc `transition` objects (layout
 *  animations, one-off delays) can reference the same curve instead of
 *  re-typing the literal. */
export const EASE = [0.22, 1, 0.36, 1] as const;

/** Backdrop/scrim fade for modals, drawers, and dropdowns. */
export const backdropFade: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.2, ease: EASE } },
  exit: { opacity: 0, transition: { duration: 0.15, ease: EASE } },
};

/** Simple opacity fade — loading overlays, generic content swaps. */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.2, ease: EASE } },
  exit: { opacity: 0, transition: { duration: 0.15, ease: EASE } },
};

/** Slides down from above and fades — toasts, inline alerts. */
export const slideDown: Variants = {
  hidden: { opacity: 0, y: -12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: EASE } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2, ease: EASE } },
};

/** Centered modal surface — scale + blur + rise, matches the public site's card entrances. */
export const modalSurface: Variants = {
  hidden: { opacity: 0, scale: 0.96, y: 12 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.3, ease: EASE },
  },
  exit: {
    opacity: 0,
    scale: 0.97,
    y: 8,
    transition: { duration: 0.18, ease: EASE },
  },
};

/** Small scale-in pop — context menus, dropdowns, tooltips. */
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.16, ease: EASE } },
  exit: { opacity: 0, scale: 0.96, transition: { duration: 0.12, ease: EASE } },
};

/** Slide-in panel from the right — the Drawer surface. */
export const drawerSlide: Variants = {
  hidden: { opacity: 0, x: 32 },
  show: { opacity: 1, x: 0, transition: { duration: 0.32, ease: EASE } },
  exit: { opacity: 0, x: 24, transition: { duration: 0.2, ease: EASE } },
};


/** Stagger wrapper for card/list grids — each child using `staggerItem`
 *  fades/rises in sequence on mount instead of popping in as a block. */
export const staggerContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.045, delayChildren: 0.02 } },
};

/** Individual item within a `staggerContainer` — pairs with CrudGrid/CrudList. */
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.28, ease: EASE } },
  exit: { opacity: 0, y: -6, transition: { duration: 0.15, ease: EASE } },
};


/** Toast entrance/exit — rises and settles on enter, slides sideways to
 *  dismiss so it doesn't compete visually with newer toasts stacking
 *  above it. Kept on the shared EASE curve rather than a spring so it
 *  reads consistently with every other admin animation. */
export const toastSlide: Variants = {
  hidden: { opacity: 0, y: 16, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.25, ease: EASE } },
  exit: { opacity: 0, x: 40, transition: { duration: 0.2, ease: EASE } },
};


/** Reduced-motion counterpart of staggerContainer — same variant shape
 *  but with stagger/delay collapsed to 0, so children still fade in via
 *  staggerItem's opacity-only reduced form, just all at once instead of
 *  sequentially. Exists because toReducedMotion() only strips transforms;
 *  it can't know that a timing-only variant like staggerContainer should
 *  also lose its choreography under reduced motion. */
export const staggerContainerReduced: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0, delayChildren: 0 } },
};
