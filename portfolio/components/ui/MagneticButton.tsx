"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

const PULL = 4; // max px pull, desktop pointer-fine only

/**
 * Wraps a single interactive child and nudges it toward the cursor on hover
 * (magnetic effect). No-op on touch/coarse-pointer devices and when the user
 * prefers reduced motion.
 */
export function MagneticButton({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setEnabled(fine && !reduced);
  }, []);

  if (!enabled) return <>{children}</>;

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2 * PULL;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2 * PULL;
    el.style.transform = `translate(${x}px, ${y}px)`;
  };

  const onMouseLeave = () => {
    const el = ref.current;
    if (el) el.style.transform = "translate(0, 0)";
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className="inline-block transition-transform duration-200 ease-out will-change-transform"
    >
      {children}
    </div>
  );
}
