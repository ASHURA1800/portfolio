"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

/**
 * Wraps a vertical timeline and paints an accent line that fills top-to-bottom
 * as the section scrolls through the viewport. The fill sits on the same x-axis
 * as the TimelineItem connectors (left: 5px). Reduced-motion users get the fill
 * fully painted (no scroll coupling).
 */
export function TimelineProgress({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setProgress(1);
      return;
    }

    let raf = 0;
    const compute = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 when the top hits mid-viewport, 1 when the bottom passes mid-viewport.
      const anchor = vh * 0.5;
      const total = rect.height;
      const scrolled = anchor - rect.top;
      setProgress(Math.max(0, Math.min(1, scrolled / total)));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(compute);
    };
    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={ref} className="relative">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-[5px] top-2 w-px origin-top bg-accent-500"
        style={{ height: `calc((100% - 1rem) * ${progress})` }}
      />
      {children}
    </div>
  );
}
