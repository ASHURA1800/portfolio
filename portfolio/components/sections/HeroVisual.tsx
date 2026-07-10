'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'motion/react';
import { Cpu, Database, Cloud, Laptop, Braces } from 'lucide-react';

interface OrbitNode {
  Icon: typeof Cpu;
  label: string;
  top: string;
  left: string;
  size: number;
  floatDelay: number;
  floatDuration: number;
  accent: 'violet' | 'cyan';
}

const NODES: OrbitNode[] = [
  { Icon: Braces, label: 'React', top: '8%', left: '18%', size: 52, floatDelay: 0, floatDuration: 5.5, accent: 'cyan' },
  { Icon: Cpu, label: 'Node.js', top: '20%', left: '76%', size: 46, floatDelay: 0.6, floatDuration: 6.2, accent: 'violet' },
  { Icon: Braces, label: 'AI', top: '48%', left: '84%', size: 50, floatDelay: 1.1, floatDuration: 5.8, accent: 'cyan' },
  { Icon: Database, label: 'Database', top: '78%', left: '70%', size: 46, floatDelay: 0.3, floatDuration: 6.6, accent: 'violet' },
  { Icon: Cloud, label: 'Cloud', top: '72%', left: '14%', size: 48, floatDelay: 0.9, floatDuration: 5.2, accent: 'cyan' },
];

const PARTICLE_COUNT = 14;

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export function HeroVisual() {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const [enabled, setEnabled] = useState(false);

  const mvX = useMotionValue(0);
  const mvY = useMotionValue(0);
  const springX = useSpring(mvX, { stiffness: 80, damping: 20, mass: 0.4 });
  const springY = useSpring(mvY, { stiffness: 80, damping: 20, mass: 0.4 });

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    setEnabled(fine && !reduceMotion);
  }, [reduceMotion]);

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!enabled) return;
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      mvX.set(px * 24);
      mvY.set(py * 24);
    },
    [enabled, mvX, mvY],
  );

  const onPointerLeave = useCallback(() => {
    mvX.set(0);
    mvY.set(0);
  }, [mvX, mvY]);

  const particles = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
    left: `${seededRandom(i * 3.1) * 100}%`,
    top: `${seededRandom(i * 7.7 + 1) * 100}%`,
    size: 2 + seededRandom(i * 5.3 + 2) * 3,
    duration: 6 + seededRandom(i * 2.2 + 3) * 6,
    delay: seededRandom(i * 4.4 + 4) * 5,
  }));

  return (
    <div
      ref={containerRef}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className="relative mx-auto aspect-square w-full max-w-[460px] select-none"
      aria-hidden="true"
    >
      {/* Animated background blobs */}
      <motion.div
        className="absolute -left-10 top-4 h-56 w-56 rounded-full bg-accent-500/25 blur-[70px]"
        animate={reduceMotion ? {} : { x: [0, 20, 0], y: [0, -16, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -right-6 bottom-8 h-64 w-64 rounded-full bg-accent2-500/20 blur-[80px]"
        animate={reduceMotion ? {} : { x: [0, -18, 0], y: [0, 22, 0] }}
        transition={{ duration: 10.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
      />

      {/* Parallax layer */}
      <motion.div
        style={enabled ? { x: springX, y: springY } : undefined}
        className="relative h-full w-full"
      >
        {/* Center glass laptop card */}
        <motion.div
          className="absolute left-1/2 top-1/2 flex h-32 w-40 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center gap-2 rounded-2xl border border-border-hover bg-card/80 shadow-glow-accent backdrop-blur-md"
          animate={reduceMotion ? {} : { y: [0, -10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Laptop size={30} className="text-accent-300" strokeWidth={1.5} />
          <span className="text-[10px] font-medium uppercase tracking-widest text-faint">
            Building
          </span>
        </motion.div>

        {/* Orbit ring */}
        <div className="absolute inset-[8%] rounded-full border border-dashed border-border" />

        {/* Floating tech nodes */}
        {NODES.map((node, i) => (
          <motion.div
            key={node.label}
            className="absolute"
            style={{ top: node.top, left: node.left }}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: reduceMotion ? 0 : [0, -12, 0],
            }}
            transition={{
              opacity: { duration: 0.5, delay: 0.15 * i },
              scale: { duration: 0.5, delay: 0.15 * i, ease: [0.22, 1, 0.36, 1] },
              y: {
                duration: node.floatDuration,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: node.floatDelay,
              },
            }}
          >
            <div
              className={`flex items-center justify-center rounded-2xl border backdrop-blur-md ${
                node.accent === 'violet'
                  ? 'border-accent-500/30 bg-accent-500/10 shadow-glow-accent'
                  : 'border-accent2-500/30 bg-accent2-500/10 shadow-glow-cyan'
              }`}
              style={{ width: node.size, height: node.size }}
            >
              <node.Icon
                size={node.size * 0.42}
                strokeWidth={1.5}
                className={node.accent === 'violet' ? 'text-accent-300' : 'text-accent2-400'}
              />
            </div>
          </motion.div>
        ))}

        {/* Floating particles */}
        {!reduceMotion &&
          particles.map((p, i) => (
            <motion.span
              key={i}
              className="absolute rounded-full bg-accent-300/50"
              style={{ left: p.left, top: p.top, width: p.size, height: p.size }}
              animate={{ y: [0, -18, 0], opacity: [0.2, 0.7, 0.2] }}
              transition={{
                duration: p.duration,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: p.delay,
              }}
            />
          ))}
      </motion.div>
    </div>
  );
}
