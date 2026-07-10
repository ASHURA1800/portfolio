'use client';

import { motion, useScroll, useSpring } from 'motion/react';

/**
 * Thin gradient bar fixed to the very top of the viewport, filling left to
 * right as the page scrolls. Reusable standalone — just mount once.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-50 h-[2px] origin-left bg-gradient-to-r from-accent-500 via-accent2-400 to-accent-500"
    />
  );
}
