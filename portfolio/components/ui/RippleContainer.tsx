'use client';

import { useState, useCallback } from 'react';
import type { MouseEvent, ReactNode } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';

interface RippleInstance {
  id: number;
  x: number;
  y: number;
  size: number;
}

/**
 * Wraps an interactive element and renders an expanding, fading ripple from
 * the click point. Purely additive — spread the returned onClick handler
 * onto the wrapped element's own onClick alongside this. The wrapper must
 * be position:relative + overflow:hidden, which this provides via a div;
 * pass a className to match the wrapped element's shape/radius.
 */
export function RippleContainer({
  children,
  className = '',
  onClick,
}: {
  children: ReactNode;
  className?: string;
  onClick?: (e: MouseEvent<HTMLDivElement>) => void;
}) {
  const [ripples, setRipples] = useState<RippleInstance[]>([]);
  const reduceMotion = useReducedMotion();

  const addRipple = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      onClick?.(e);
      if (reduceMotion) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 1.6;
      const id = Date.now();
      setRipples((prev) => [
        ...prev,
        { id, x: e.clientX - rect.left, y: e.clientY - rect.top, size },
      ]);
      window.setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id));
      }, 650);
    },
    [onClick, reduceMotion],
  );

  return (
    <div
      onClick={addRipple}
      className={`relative overflow-hidden ${className}`}
    >
      {children}
      <AnimatePresence>
        {ripples.map((r) => (
          <motion.span
            key={r.id}
            initial={{ opacity: 0.35, scale: 0 }}
            animate={{ opacity: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-none absolute rounded-full bg-white/40"
            style={{
              left: r.x,
              top: r.y,
              width: r.size,
              height: r.size,
              translateX: '-50%',
              translateY: '-50%',
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
