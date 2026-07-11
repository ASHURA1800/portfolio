import type { Variants, Variant, Transition } from 'motion/react';

/**
 * Strips transform-based motion (x, y, scale, rotate, filter) from a
 * Variants object, leaving only opacity. Used to build a reduced-motion
 * counterpart of every preset below without hand-writing two versions of
 * each animation. Opacity is kept — content still needs to appear/
 * disappear, it just shouldn't move or blur to get there.
 */
export function toReducedMotion(variants: Variants): Variants {
  const reduced: Variants = {};
  for (const [key, value] of Object.entries(variants)) {
    if (typeof value !== 'object' || value === null) {
      reduced[key] = value;
      continue;
    }
    const record = value as Record<string, unknown>;
    const next: Variant = {
      ...(record.opacity !== undefined ? { opacity: record.opacity as number } : {}),
      ...(record.transition !== undefined ? { transition: record.transition as Transition } : {}),
    };
    reduced[key] = next;
  }
  return reduced;
}

/**
 * Picks the full-motion or reduced-motion version of a variants object
 * based on the user's OS-level preference. Call with the boolean from
 * `useReducedMotion()` (motion/react) at the top of a component.
 *
 * Usage:
 *   const reduceMotion = useReducedMotion();
 *   <motion.div variants={withReducedMotion(fadeIn, reduceMotion)} />
 */
export function withReducedMotion(variants: Variants, reduceMotion: boolean | null): Variants {
  return reduceMotion ? toReducedMotion(variants) : variants;
}
