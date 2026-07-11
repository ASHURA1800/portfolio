import type { Variants } from 'motion/react';
import { DURATION, EASE_OUT } from './tokens';

/**
 * Route-change transition for the admin shell. Same shape as the public
 * site's PageTransition.tsx (opacity + y + blur) so navigating between
 * /admin/* and the public site doesn't feel like two different products —
 * just tuned slightly faster since admin navigation is a repeated task,
 * not a first-impression moment.
 */
export const pageTransition: Variants = {
  initial: { opacity: 0, y: 8, filter: 'blur(4px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: DURATION.slow, ease: EASE_OUT } },
  exit: { opacity: 0, y: -8, filter: 'blur(4px)', transition: { duration: DURATION.fast, ease: EASE_OUT } },
};
