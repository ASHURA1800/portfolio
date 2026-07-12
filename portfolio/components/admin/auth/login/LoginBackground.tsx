'use client';

import { motion, useReducedMotion } from 'motion/react';

const PARTICLES = [
  { size: 6, top: '15%', left: '20%', delay: 0, duration: 9 },
  { size: 4, top: '65%', left: '12%', delay: 1.2, duration: 11 },
  { size: 8, top: '30%', left: '75%', delay: 0.6, duration: 8 },
  { size: 3, top: '80%', left: '65%', delay: 2, duration: 10 },
  { size: 5, top: '45%', left: '40%', delay: 1.6, duration: 12 },
  { size: 4, top: '10%', left: '55%', delay: 0.3, duration: 9.5 },
] as const;

/** Decorative gradient mesh + slow-drifting particles for the left panel.
 *  Built on the existing .gradient-mesh-bg token (real accent colors, not
 *  new ones) with a floating-dot layer added on top. Entirely aria-hidden
 *  and skipped when the user prefers reduced motion. */
export function LoginBackground() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="absolute inset-0 overflow-hidden gradient-mesh-bg" aria-hidden="true">
      {/* Soft glow orbs — static gradients, no motion needed for these */}
      <div
        className="absolute -top-24 -left-24 w-96 h-96 rounded-full blur-3xl opacity-30"
        style={{ background: 'radial-gradient(circle, var(--color-accent-500), transparent 70%)' }}
      />
      <div
        className="absolute bottom-0 right-0 w-[28rem] h-[28rem] rounded-full blur-3xl opacity-20"
        style={{ background: 'radial-gradient(circle, var(--color-accent2-500), transparent 70%)' }}
      />

      {/* Abstract shape — thin rotated ring, purely decorative */}
      <div
        className="absolute top-1/3 right-12 w-40 h-40 rounded-full border opacity-10"
        style={{ borderColor: 'var(--color-accent-300)' }}
      />

      {!reduceMotion &&
        PARTICLES.map((p, i) => (
          <motion.span
            key={i}
            className="absolute rounded-full"
            style={{
              width: p.size,
              height: p.size,
              top: p.top,
              left: p.left,
              background: i % 2 === 0 ? 'var(--color-accent-400)' : 'var(--color-accent2-400)',
              opacity: 0.5,
            }}
            animate={{ y: [0, -18, 0], opacity: [0.3, 0.6, 0.3] }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
    </div>
  );
}
