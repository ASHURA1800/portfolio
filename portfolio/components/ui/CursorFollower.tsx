'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

/**
 * Subtle cursor-follower dot + trailing glow. Mounted once globally.
 * Disabled entirely on touch/coarse-pointer devices and under
 * prefers-reduced-motion — this is pure decoration, never required for
 * usability, so it's the first thing to skip when it'd cost more than it's
 * worth.
 */
export function CursorFollower() {
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [interactive, setInteractive] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { stiffness: 400, damping: 40, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 400, damping: 40, mass: 0.4 });
  const glowX = useSpring(x, { stiffness: 120, damping: 26, mass: 0.6 });
  const glowY = useSpring(y, { stiffness: 120, damping: 26, mass: 0.6 });

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setEnabled(fine && !reduced);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      if (!visible) setVisible(true);
      const target = e.target as HTMLElement;
      setInteractive(!!target.closest('a, button, [role="button"], input, textarea, select'));
    };
    const onLeave = () => setVisible(false);

    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    return () => {
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
    };
  }, [enabled, visible, x, y]);

  if (!enabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[60]" aria-hidden="true">
      {/* Soft trailing glow */}
      <motion.div
        style={{ x: glowX, y: glowY }}
        animate={{ opacity: visible ? 1 : 0 }}
        transition={{ opacity: { duration: 0.3 } }}
        className="absolute h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-500/20 blur-2xl"
      />
      {/* Precise follower dot */}
      <motion.div
        style={{ x: springX, y: springY }}
        animate={{
          opacity: visible ? 1 : 0,
          scale: interactive ? 2.2 : 1,
        }}
        transition={{ opacity: { duration: 0.2 }, scale: { duration: 0.2, ease: [0.22, 1, 0.36, 1] } }}
        className="absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-300 mix-blend-difference"
      />
    </div>
  );
}
