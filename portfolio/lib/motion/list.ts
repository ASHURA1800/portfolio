import type { Variants } from 'motion/react';
import { STAGGER_DELAY } from './tokens';

/**
 * Container variant for a list/grid whose children should stagger in.
 * Apply to the parent (e.g. the <ul> or list wrapper) with `variants`,
 * `initial="hidden"`, `animate="visible"` — Framer Motion propagates
 * staggerChildren timing to any child that also declares variants
 * (typically `staggerAnimation` below, or `cardAnimation`).
 *
 * Usage:
 *   <motion.ul variants={listAnimation} initial="hidden" animate="visible">
 *     {items.map(item => (
 *       <motion.li key={item.id} variants={staggerAnimation}>...</motion.li>
 *     ))}
 *   </motion.ul>
 */
export const listAnimation: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: STAGGER_DELAY, delayChildren: 0.05 },
  },
};

/**
 * Child variant for use inside a `listAnimation` container. Named
 * separately from `cardAnimation` because it deliberately has no `exit`
 * transition of its own — exit stagger (e.g. reverse-order removal) is
 * opt-in via `staggerDirection: -1` on the parent, not baked into every
 * child, since most delete flows in this app remove one item at a time
 * rather than the whole list at once.
 */
export const staggerAnimation: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};
