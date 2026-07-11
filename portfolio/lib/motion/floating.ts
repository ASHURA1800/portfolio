/**
 * Ambient idle float — a slow, subtle up/down loop for decorative or
 * "alive" elements (e.g. an empty-state icon, an idle status indicator).
 * Not a Variants object: this drives `animate` directly with `repeat:
 * Infinity`, since idle loops don't have a meaningful initial/exit state —
 * they just are, for as long as the element is mounted.
 *
 * Usage:
 *   <motion.div animate={floatingAnimation.animate} transition={floatingAnimation.transition} />
 *
 * Respect prefers-reduced-motion by not rendering this at all (check
 * `useReducedMotion()` and fall back to a static element) rather than
 * trying to "reduce" an infinite loop — an idle animation has no fade-only
 * equivalent worth keeping.
 */
export const floatingAnimation = {
  animate: { y: [0, -6, 0] },
  transition: { duration: 3.2, repeat: Infinity, ease: 'easeInOut' as const },
};
