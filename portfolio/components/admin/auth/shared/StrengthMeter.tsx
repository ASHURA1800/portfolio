'use client';

import { motion, useReducedMotion } from 'motion/react';
import { scorePassword } from './password-strength';

export interface StrengthMeterProps {
  password: string;
  className?: string;
}

const SEGMENTS = 4;

/** Segmented strength bar under a password field. Each segment fills and
 *  recolors as the score rises; width/opacity-only transitions so it's
 *  GPU-friendly, no reduced-motion fallback needed since a static filled
 *  bar reads fine without animation. */
export function StrengthMeter({ password, className }: StrengthMeterProps) {
  const reduceMotion = useReducedMotion();
  const { score, label, color } = scorePassword(password);

  if (!password) return null;

  return (
    <div className={className} aria-live="polite">
      <div className="flex gap-1.5" role="img" aria-label={`Password strength: ${label}`}>
        {Array.from({ length: SEGMENTS }).map((_, i) => {
          const filled = i < score;
          return (
            <span key={i} className="h-1 flex-1 rounded-full overflow-hidden bg-[var(--color-border)]">
              <motion.span
                className="block h-full rounded-full"
                style={{ background: color, transformOrigin: 'left' }}
                initial={false}
                animate={{ scaleX: filled ? 1 : 0 }}
                transition={reduceMotion ? { duration: 0 } : { duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              />
            </span>
          );
        })}
      </div>
      <p className="text-xs mt-1.5" style={{ color }}>
        {label}
      </p>
    </div>
  );
}
