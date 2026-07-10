'use client';

import Image from 'next/image';
import { useRef } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from 'motion/react';
import { Sparkles, Code2, Layers } from 'lucide-react';

/**
 * Portrait card for the About section: subtle 3D tilt on pointer move, a
 * background glow, a couple of floating accent shapes, and a glass frame.
 * Falls back to a static frame when reduced motion is preferred or on
 * touch devices.
 */
export function AboutPortrait({ src, alt }: { src: string; alt: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const mvX = useMotionValue(0);
  const mvY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mvY, [-0.5, 0.5], [8, -8]), {
    stiffness: 150,
    damping: 18,
  });
  const rotateY = useSpring(useTransform(mvX, [-0.5, 0.5], [-8, 8]), {
    stiffness: 150,
    damping: 18,
  });

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduceMotion) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mvX.set((e.clientX - rect.left) / rect.width - 0.5);
    mvY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const onPointerLeave = () => {
    mvX.set(0);
    mvY.set(0);
  };

  return (
    <div className="relative mx-auto w-full max-w-[340px]">
      {/* Background glow */}
      <motion.div
        aria-hidden="true"
        className="absolute -inset-8 -z-10 rounded-[2.5rem] bg-accent-500/20 blur-[60px]"
        animate={reduceMotion ? {} : { opacity: [0.5, 0.85, 0.5] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Floating shapes */}
      <motion.div
        aria-hidden="true"
        className="absolute -left-6 -top-6 z-10 flex h-14 w-14 items-center justify-center rounded-2xl border border-accent-500/30 bg-accent-500/10 shadow-glow-accent backdrop-blur-md"
        animate={reduceMotion ? {} : { y: [0, -10, 0], rotate: [0, 6, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Sparkles size={20} className="text-accent-300" strokeWidth={1.5} />
      </motion.div>
      <motion.div
        aria-hidden="true"
        className="absolute -right-5 top-10 z-10 flex h-12 w-12 items-center justify-center rounded-xl border border-accent2-500/30 bg-accent2-500/10 shadow-glow-cyan backdrop-blur-md"
        animate={reduceMotion ? {} : { y: [0, 8, 0], rotate: [0, -8, 0] }}
        transition={{ duration: 6.2, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
      >
        <Code2 size={17} className="text-accent2-400" strokeWidth={1.5} />
      </motion.div>
      <motion.div
        aria-hidden="true"
        className="absolute -bottom-5 -left-4 z-10 flex h-11 w-11 items-center justify-center rounded-xl border border-accent-500/30 bg-accent-500/10 shadow-glow-accent backdrop-blur-md"
        animate={reduceMotion ? {} : { y: [0, -8, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
      >
        <Layers size={16} className="text-accent-300" strokeWidth={1.5} />
      </motion.div>

      {/* Portrait, tilts toward the pointer */}
      <motion.div
        ref={ref}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        style={
          reduceMotion
            ? undefined
            : { rotateX, rotateY, transformPerspective: 800 }
        }
        initial={{ opacity: 0, scale: 0.92 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative aspect-[4/5] w-full overflow-hidden rounded-[1.75rem] border border-border-hover shadow-lg"
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 400px) 90vw, 340px"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg/40 via-transparent to-transparent" />
      </motion.div>
    </div>
  );
}
