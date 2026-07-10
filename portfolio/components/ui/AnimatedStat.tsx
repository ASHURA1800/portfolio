'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';

interface AnimatedStatProps {
  value: number;
  label: string;
  suffix?: string;
  duration?: number;
  delay?: number;
}

/**
 * Counts up from 0 to `value` once it scrolls into view. Reusable for any
 * numeric stat block (hero, about, wherever). Respects reduced-motion by
 * rendering the final value immediately.
 */
export function AnimatedStat({
  value,
  label,
  suffix = '',
  duration = 1.4,
  delay = 0,
}: AnimatedStatProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10% 0px' });
  const reduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(reduceMotion ? value : 0);

  useEffect(() => {
    if (!inView || reduceMotion) return;
    let raf: number;
    const start = performance.now() + delay * 1000;

    const tick = (now: number) => {
      const elapsed = (now - start) / 1000;
      if (elapsed < 0) {
        raf = requestAnimationFrame(tick);
        return;
      }
      const t = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(eased * value));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, duration, delay, reduceMotion]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 12 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="text-2xl font-semibold tracking-tight text-ink tabular-nums sm:text-3xl">
        {display}
        <span className="text-accent-400">{suffix}</span>
      </div>
      <div className="mt-1 text-xs text-faint">{label}</div>
    </motion.div>
  );
}
