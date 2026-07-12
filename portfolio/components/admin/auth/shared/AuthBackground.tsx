'use client';

import { useRef } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform, type MotionValue } from 'motion/react';
import { authBlobFloat } from './auth-motion-presets';

const PARTICLES = [
  { size: 6, top: '15%', left: '20%', delay: 0, duration: 9 },
  { size: 4, top: '65%', left: '12%', delay: 1.2, duration: 11 },
  { size: 8, top: '30%', left: '75%', delay: 0.6, duration: 8 },
  { size: 3, top: '80%', left: '65%', delay: 2, duration: 10 },
  { size: 5, top: '45%', left: '40%', delay: 1.6, duration: 12 },
  { size: 4, top: '10%', left: '55%', delay: 0.3, duration: 9.5 },
] as const;

export interface AuthBackgroundProps {
  /** Disable the mouse-parallax layer (kept on by default, auto-skipped for touch/reduced-motion). */
  parallax?: boolean;
}

/**
 * Decorative gradient mesh + slow-drifting particles + two ambient glow
 * orbs, with a lightweight mouse-parallax layer. Built on the existing
 * .gradient-mesh-bg token (real accent colors, not new ones). Entirely
 * aria-hidden and skipped/flattened when the user prefers reduced motion.
 * All motion is transform/opacity only — GPU-friendly, no layout shift.
 */
export function AuthBackground({ parallax = true }: AuthBackgroundProps) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 40, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 40, damping: 20 });

  const orbAX = useTransform(springX, (v) => v * -14);
  const orbAY = useTransform(springY, (v) => v * -10);
  const orbBX = useTransform(springX, (v) => v * 10);
  const orbBY = useTransform(springY, (v) => v * 8);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!parallax || reduceMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      className="absolute inset-0 overflow-hidden gradient-mesh-bg"
      aria-hidden="true"
    >
      {/* Ambient glow orbs — static gradients, parallax offset via transform only */}
      <ParallaxOrb
        x={orbAX}
        y={orbAY}
        className="absolute -top-24 -left-24 w-96 h-96 rounded-full blur-3xl opacity-30"
        style={{ background: 'radial-gradient(circle, var(--color-accent-500), transparent 70%)' }}
      />
      <ParallaxOrb
        x={orbBX}
        y={orbBY}
        className="absolute bottom-0 right-0 w-[28rem] h-[28rem] rounded-full blur-3xl opacity-20"
        style={{ background: 'radial-gradient(circle, var(--color-accent2-500), transparent 70%)' }}
      />

      {/* Abstract shape — thin rotated ring, purely decorative */}
      <div
        className="absolute top-1/3 right-12 w-40 h-40 rounded-full border opacity-10"
        style={{ borderColor: 'var(--color-accent-300)' }}
      />

      {!reduceMotion &&
        PARTICLES.map((p, i) => {
          const float = authBlobFloat(p.duration, p.delay);
          return (
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
              animate={float.animate}
              transition={float.transition}
            />
          );
        })}
    </div>
  );
}

function ParallaxOrb({
  x,
  y,
  className,
  style,
}: {
  x: MotionValue<number>;
  y: MotionValue<number>;
  className: string;
  style: React.CSSProperties;
}) {
  return <motion.div className={className} style={{ ...style, x, y }} />;
}
