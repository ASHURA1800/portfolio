/**
 * The Skeleton component (components/admin/ui/Skeleton.tsx) uses the
 * public site's `.skeleton` CSS class, which drives its shimmer via a
 * `::after` pseudo-element and a CSS `@keyframes shimmer` — not Framer
 * Motion. That's intentional: a looping shimmer on every loading row is
 * pure CSS-animation territory (GPU-composited, no JS per frame, keeps
 * working even if a route's JS bundle is still loading).
 *
 * This constant exists so any *new* skeleton-like loading treatment built
 * with Framer Motion (e.g. a pulsing placeholder inside an interactive
 * widget, rather than a static list row) shares the same timing as the
 * CSS version instead of inventing a different loading rhythm.
 */
export const skeletonAnimation = {
  animate: { opacity: [0.5, 0.85, 0.5] },
  transition: { duration: 1.6, repeat: Infinity, ease: 'easeInOut' as const },
};
