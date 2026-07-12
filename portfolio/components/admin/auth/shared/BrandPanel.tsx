'use client';

import type { ComponentType, ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { AuthBackground } from './AuthBackground';

const EASE = [0.22, 1, 0.36, 1] as const;

export interface BrandFeature {
  icon: ComponentType<{ size?: number; className?: string }>;
  label: string;
}

export interface BrandPanelProps {
  /** Logo initial shown in the gradient badge. Falls back to `name`'s first letter. */
  name: string;
  /** Optional subtitle under the name (e.g. profile title). */
  title?: string;
  heading: ReactNode;
  features?: BrandFeature[];
  /** Disable the mouse-parallax layer on the background. */
  parallax?: boolean;
  children?: ReactNode;
}

/**
 * Left-panel shell for split-screen auth pages: decorative background +
 * fade/rise entrance for branding content (logo, heading, feature list).
 * Hidden below `lg` — form panel takes over full-width on mobile/tablet.
 * Generalized from the login page's hero so forgot/reset/change-password
 * routes can share the same premium panel.
 */
export function BrandPanel({ name, title, heading, features = [], parallax = true, children }: BrandPanelProps) {
  const reduceMotion = useReducedMotion();
  const initial = name.trim().charAt(0).toUpperCase() || 'A';
  const displayName = name.trim() || 'Portfolio Admin';

  return (
    <div className="relative flex-1 hidden lg:flex items-center justify-center p-16 overflow-hidden">
      <AuthBackground parallax={parallax} />
      <motion.div
        className="relative z-10 flex flex-col gap-10 max-w-md"
        initial={reduceMotion ? false : { opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
      >
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[var(--color-accent-500)] to-[var(--color-accent2-500)] flex items-center justify-center shadow-[var(--shadow-glow-accent)]">
            <span className="text-white font-bold text-lg">{initial}</span>
          </div>
          <span className="text-[var(--color-ink)] font-semibold text-lg">{displayName}</span>
        </div>

        <div className="flex flex-col gap-3">
          <h1 className="text-3xl font-bold text-[var(--color-ink)] leading-tight">{heading}</h1>
          {title && <p className="text-[var(--color-faint)] text-sm leading-relaxed">{title}</p>}
        </div>

        {features.length > 0 && (
          <ul className="flex flex-col gap-4">
            {features.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-start gap-3">
                <span className="mt-0.5 w-8 h-8 rounded-lg bg-[var(--color-accent-500)]/10 border border-[var(--color-accent-500)]/20 flex items-center justify-center shrink-0">
                  <Icon size={15} className="text-[var(--color-accent-400)]" />
                </span>
                <span className="text-sm text-[var(--color-muted)] leading-snug pt-1">{label}</span>
              </li>
            ))}
          </ul>
        )}

        {children}
      </motion.div>
    </div>
  );
}
