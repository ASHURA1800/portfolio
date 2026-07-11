/**
 * Shared timing tokens for the admin animation system. Values mirror the
 * public site's EASE constant (see PageTransition.tsx / MotionReveal.tsx)
 * and the CSS timing vars in app/admin/admin-theme.css — one set of
 * numbers, referenced from both stylesheets and motion variants, so a
 * CSS transition and a Framer Motion transition never drift apart.
 */

/** Standard "ease out" cubic bezier — used for anything entering/settling. */
export const EASE_OUT = [0.22, 1, 0.36, 1] as const;
/** Symmetric ease — used for anything that both enters and exits the same way. */
export const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const;

export const DURATION = {
  instant: 0.12,
  fast: 0.18,
  base: 0.25,
  slow: 0.4,
  slower: 0.6,
} as const;

/** Per-item delay for staggered list/grid entrances. */
export const STAGGER_DELAY = 0.045;

export const SPRING_SNAPPY = { type: 'spring', stiffness: 500, damping: 32 } as const;
export const SPRING_SOFT = { type: 'spring', stiffness: 260, damping: 26 } as const;
