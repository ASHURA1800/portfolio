'use client';

import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

const PULL = 10; // max px pull, desktop pointer-fine only

/**
 * Wraps a single interactive child and nudges it toward the cursor on hover
 * (magnetic effect), spring-smoothed via motion. No-op on touch/coarse-
 * pointer devices and when the user prefers reduced motion.
 */
export function MagneticButton({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 260, damping: 18, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 260, damping: 18, mass: 0.4 });

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setEnabled(fine && !reduced);
  }, []);

  if (!enabled) return <>{children}</>;

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set(((e.clientX - rect.left) / rect.width - 0.5) * 2 * PULL);
    y.set(((e.clientY - rect.top) / rect.height - 0.5) * 2 * PULL);
  };

  const onPointerLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      style={{ x: springX, y: springY }}
      className="inline-block will-change-transform"
    >
      {children}
    </motion.div>
  );
}
