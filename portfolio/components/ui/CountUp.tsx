"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Counts a numeric value up when it first scrolls into view. Values often carry
 * a prefix/suffix (e.g. "40%", "2.5k", "$3M"); only the numeric core animates,
 * the surrounding text is preserved. Reduced-motion or non-numeric values render
 * the final string immediately.
 */
export function CountUp({ value, durationMs = 400 }: { value: string; durationMs?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const match = value.match(/^(\D*)([\d.,]+)(.*)$/);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const el = ref.current;
    if (!match || reduced || !el) {
      setDisplay(value);
      return;
    }

    const [, prefix, numStr, suffix] = match;
    const target = parseFloat(numStr.replace(/,/g, ""));
    const decimals = numStr.includes(".") ? numStr.split(".")[1].length : 0;
    if (Number.isNaN(target)) {
      setDisplay(value);
      return;
    }

    let raf = 0;
    let start = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const tick = (t: number) => {
          if (!start) start = t;
          const p = Math.min((t - start) / durationMs, 1);
          const eased = 1 - Math.pow(1 - p, 3); // ease-out cubic
          const current = (target * eased).toFixed(decimals);
          setDisplay(`${prefix}${current}${suffix}`);
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, durationMs]);

  return (
    <span ref={ref} className="tabular-nums">
      {display}
    </span>
  );
}
