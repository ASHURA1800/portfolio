'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'motion/react';
import { cn } from '@/lib/utils';

export interface StatCardProps {
  label: string;
  value: number;
  icon?: ReactNode;
  href?: string | null;
  suffix?: string;
  className?: string;
}

/** Animates 0 → value once, when scrolled into view. Respects reduced motion via instant set. */
function useCountUp(target: number, active: boolean) {
  const [display, setDisplay] = useState(0);
  const prefersReduced = useRef(
    typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  );

  useEffect(() => {
    if (!active) return;
    if (prefersReduced.current) {
      setDisplay(target);
      return;
    }
    const duration = 600;
    const start = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * target));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, target]);

  return display;
}

export function StatCard({ label, value, icon, href, suffix = '', className }: StatCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10% 0px' });
  const display = useCountUp(value, inView);
  const linked = Boolean(href);

  const content = (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 8 }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className={cn('admin-stat-card', className)}
      data-linked={linked}
    >
      <div className="flex items-center justify-between">
        <span className="admin-stat-label">{label}</span>
        {icon && (
          <span aria-hidden="true" className="text-[var(--color-accent-400)] [&>svg]:w-4 [&>svg]:h-4">
            {icon}
          </span>
        )}
      </div>
      <span className="admin-stat-value">
        {display}
        {suffix}
      </span>
    </motion.div>
  );

  if (href) {
    return (
      <Link href={href} aria-label={`${label}: ${value}${suffix}. View details.`} className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-500)] rounded-[var(--radius-lg)]">
        {content}
      </Link>
    );
  }

  return content;
}
