import type { Variants } from 'motion/react';
import { DURATION, EASE_OUT } from './tokens';

/**
 * Entrance for a single card/list-item (e.g. a manager row mounting after
 * a successful create, or the initial list render before stagger delay is
 * applied by the parent — see stagger.ts). Slightly smaller travel than
 * slideUp since cards read as "settling into place", not "arriving".
 */
export const cardAnimation: Variants = {
  initial: { opacity: 0, y: 16, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: DURATION.base, ease: EASE_OUT } },
  exit: {
    opacity: 0,
    scale: 0.96,
    transition: { duration: DURATION.fast, ease: EASE_OUT },
  },
};

/**
 * Hover/tap micro-interaction for interactive cards (clickable stat cards,
 * clickable list rows). Pair with `whileHover`/`whileTap`, not
 * `animate` — this is a state variant, not an entrance.
 */
export const hoverAnimation = {
  rest: { scale: 1, y: 0 },
  hover: { scale: 1.015, y: -2, transition: { duration: DURATION.fast, ease: EASE_OUT } },
  tap: { scale: 0.985, transition: { duration: DURATION.instant, ease: EASE_OUT } },
};
