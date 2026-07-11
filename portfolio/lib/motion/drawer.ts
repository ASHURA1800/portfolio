import type { Variants } from 'motion/react';
import { DURATION, EASE_IN_OUT } from './tokens';

/**
 * Mobile navigation drawer (the sidebar's collapse/drawer behavior flagged
 * as a gap in the Phase 1 audit — "no hamburger/mobile nav pattern exists
 * at all"). Slides in from the left edge, matching the sidebar's actual
 * screen position. Uses EASE_IN_OUT rather than EASE_OUT since a drawer
 * both enters and exits along the identical path — a symmetric ease
 * reads more natural than an ease-out exit for that motion.
 */
export const drawerAnimation: Variants = {
  initial: { x: '-100%' },
  animate: { x: 0, transition: { duration: DURATION.base, ease: EASE_IN_OUT } },
  exit: { x: '-100%', transition: { duration: DURATION.base, ease: EASE_IN_OUT } },
};

/** Backdrop behind the drawer — dims the page content beneath. */
export const drawerBackdropAnimation: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: DURATION.base } },
  exit: { opacity: 0, transition: { duration: DURATION.fast } },
};
