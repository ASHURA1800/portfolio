import type { Variants } from 'motion/react';

// Same easing curve used site-wide (MotionReveal, PageTransition) — kept
// consistent so admin and public-site motion feel like one product.
const EASE = [0.22, 1, 0.36, 1] as const;

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

/** Stagger container — apply to a parent with `initial="hidden" animate="show"`;
 *  children using `staggerItem` (or any variant with hidden/show keys) will
 *  cascade in one after another instead of all popping at once. Used for
 *  stat/chart/widget grids so the dashboard reads as a sequence, not a dump. */
export const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06, delayChildren: 0.04 },
  },
};

/** Paired child variant for staggerContainer — fade + rise, same curve as
 *  the rest of the admin's card entrances. */
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.32, ease: EASE } },
};
