import { DURATION, EASE_OUT } from './tokens';

/**
 * Button press micro-interaction. Button.tsx currently applies the tap
 * state via a plain CSS `active:scale-[0.98]` class (cheaper — no JS
 * needed for a state Tailwind already expresses declaratively). This
 * variant exists for motion.button usages elsewhere (e.g. FAB-style
 * action buttons, IconButton wrapped in motion) that want the identical
 * feel driven by Framer Motion's whileTap/whileHover instead.
 */
export const buttonAnimation = {
  rest: { scale: 1 },
  hover: { scale: 1.02, transition: { duration: DURATION.fast, ease: EASE_OUT } },
  tap: { scale: 0.96, transition: { duration: DURATION.instant, ease: EASE_OUT } },
};
