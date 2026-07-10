'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';

/**
 * Cycles through a list of words with a vertical slide + blur transition.
 * Reusable anywhere a "rotating label" is needed, not just the hero.
 */
export function RotatingText({
  words,
  interval = 2200,
  className = '',
}: {
  words: string[];
  interval?: number;
  className?: string;
}) {
  const [index, setIndex] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (words.length <= 1) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % words.length);
    }, interval);
    return () => clearInterval(id);
  }, [words.length, interval]);

  if (words.length === 0) return null;

  if (reduceMotion) {
    return <span className={className}>{words[index]}</span>;
  }

  return (
    <span className={`relative inline-grid ${className}`}>
      <span className="invisible" aria-hidden="true">
        {words.reduce((a, b) => (a.length > b.length ? a : b))}
      </span>
      <AnimatePresence mode="wait">
        <motion.span
          key={words[index]}
          initial={{ y: 16, opacity: 0, filter: 'blur(6px)' }}
          animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
          exit={{ y: -16, opacity: 0, filter: 'blur(6px)' }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
