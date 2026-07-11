/**
 * Config for numeric count-up transitions (dashboard StatCard, any future
 * animated metric). Framer Motion doesn't tween integers meaningfully on
 * its own, so StatCard drives the number via requestAnimationFrame — this
 * file centralizes that easing/duration so every count-up in the app uses
 * the same feel instead of each component picking its own numbers.
 */
export const countAnimation = {
  duration: 600, // ms
  /** Cubic ease-out: fast start, settles gently on the final value. */
  ease: (t: number) => 1 - Math.pow(1 - t, 3),
};

/**
 * Runs a count-up from `from` to `to`, calling `onUpdate` on each frame.
 * Returns a cleanup function to cancel the animation frame. Respects
 * reduced motion by jumping straight to the final value.
 *
 * Usage (inside a useEffect):
 *   const cancel = runCountUp({ from: 0, to: value, reduceMotion, onUpdate: setDisplay });
 *   return cancel;
 */
export function runCountUp({
  from,
  to,
  reduceMotion,
  onUpdate,
}: {
  from: number;
  to: number;
  reduceMotion: boolean | null;
  onUpdate: (value: number) => void;
}): () => void {
  if (reduceMotion) {
    onUpdate(to);
    return () => {};
  }

  const start = performance.now();
  let raf: number;

  const tick = (now: number) => {
    const progress = Math.min(1, (now - start) / countAnimation.duration);
    const eased = countAnimation.ease(progress);
    onUpdate(Math.round(from + (to - from) * eased));
    if (progress < 1) raf = requestAnimationFrame(tick);
  };

  raf = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(raf);
}
