'use client';

import { useReducedMotion } from 'motion/react';
import { motion } from 'motion/react';

/**
 * HeroBackground
 * Ambient animated backdrop for the DashboardHero.
 *
 * Signature element: a slowly-rotating conic gradient anchored at the
 * top-left + a radial bloom behind the greeting text. No physics blobs,
 * no generic particle field — this is deliberately restrained.
 *
 * Two layers:
 *  1. Rotating conic mesh (very low opacity — sets mood without shouting)
 *  2. Static radial bloom (violet → cyan, matches the brand gradient)
 *
 * Both respect prefers-reduced-motion — motion stops, the gradient stays.
 */
export default function HeroBackground() {
  const reduceMotion = useReducedMotion();

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        borderRadius: 'inherit',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    >
      {/* Layer 1: Rotating conic gradient mesh */}
      <motion.div
        animate={reduceMotion ? {} : { rotate: 360 }}
        transition={{
          duration: 40,
          repeat: Infinity,
          ease: 'linear',
        }}
        style={{
          position: 'absolute',
          inset: '-60%',
          background: `conic-gradient(
            from 0deg at 30% 40%,
            rgba(124, 77, 255, 0.07) 0deg,
            rgba(34, 197, 245, 0.05) 90deg,
            rgba(124, 77, 255, 0.03) 180deg,
            rgba(34, 197, 245, 0.07) 270deg,
            rgba(124, 77, 255, 0.07) 360deg
          )`,
          transformOrigin: '50% 50%',
        }}
      />

      {/* Layer 2: Static radial bloom — primary focal glow */}
      <div
        style={{
          position: 'absolute',
          top: '-20%',
          left: '-5%',
          width: '55%',
          height: '160%',
          background:
            'radial-gradient(ellipse at 30% 40%, rgba(124, 77, 255, 0.14) 0%, rgba(34, 197, 245, 0.06) 50%, transparent 70%)',
          filter: 'blur(1px)',
        }}
      />

      {/* Layer 3: Edge vignette — keeps text readable over the gradient */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(135deg, rgba(8,9,13,0.0) 0%, rgba(8,9,13,0.55) 100%)',
        }}
      />

      {/* Layer 4: Floating geometry — 3 translucent accent shapes */}
      <FloatingShape
        size={160}
        top="10%"
        right="8%"
        color="rgba(124, 77, 255, 0.06)"
        delay={0}
        reduceMotion={reduceMotion ?? false}
      />
      <FloatingShape
        size={90}
        bottom="15%"
        right="22%"
        color="rgba(34, 197, 245, 0.05)"
        delay={2.5}
        reduceMotion={reduceMotion ?? false}
      />
      <FloatingShape
        size={50}
        top="55%"
        right="5%"
        color="rgba(124, 77, 255, 0.08)"
        delay={1.2}
        reduceMotion={reduceMotion ?? false}
      />
    </div>
  );
}

interface FloatingShapeProps {
  size: number;
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  color: string;
  delay: number;
  reduceMotion: boolean;
}

function FloatingShape({
  size,
  top,
  bottom,
  left,
  right,
  color,
  delay,
  reduceMotion,
}: FloatingShapeProps) {
  return (
    <motion.div
      animate={
        reduceMotion
          ? {}
          : {
              y: [0, -12, 0],
              rotate: [0, 8, 0],
              opacity: [0.6, 1, 0.6],
            }
      }
      transition={{
        duration: 7 + delay,
        repeat: Infinity,
        ease: 'easeInOut',
        delay,
      }}
      style={{
        position: 'absolute',
        top,
        bottom,
        left,
        right,
        width: size,
        height: size,
        borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
        background: color,
        border: `1px solid ${color.replace(/[\d.]+\)$/, '0.15)')}`,
        backdropFilter: 'blur(2px)',
        WebkitBackdropFilter: 'blur(2px)',
      }}
    />
  );
}
