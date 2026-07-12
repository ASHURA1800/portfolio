'use client';

import { motion } from 'motion/react';
import { Check, X } from 'lucide-react';
import { PASSWORD_CRITERIA } from './password-strength';

export interface PasswordChecklistProps {
  password: string;
  className?: string;
}

/** Live checklist of password requirements — each item flips to a check
 *  the moment its criterion passes. Pairs with StrengthMeter; both read
 *  from the same PASSWORD_CRITERIA source so they can't disagree. */
export function PasswordChecklist({ password, className }: PasswordChecklistProps) {
  return (
    <ul className={className} aria-label="Password requirements">
      {PASSWORD_CRITERIA.map((c) => {
        const met = c.test(password);
        return (
          <li key={c.id} className="flex items-center gap-2 text-xs py-0.5">
            <motion.span
              initial={false}
              animate={{
                scale: met ? [1, 1.15, 1] : 1,
                backgroundColor: met ? 'var(--color-success-bg)' : 'transparent',
                borderColor: met ? 'var(--color-success)' : 'var(--color-border)',
              }}
              transition={{ duration: 0.2 }}
              className="w-4 h-4 rounded-full border flex items-center justify-center shrink-0"
            >
              {met ? (
                <Check size={10} className="text-[var(--color-success)]" />
              ) : (
                <X size={9} className="text-[var(--color-faint)]" />
              )}
            </motion.span>
            <span className={met ? 'text-[var(--color-muted)]' : 'text-[var(--color-faint)]'}>{c.label}</span>
          </li>
        );
      })}
    </ul>
  );
}
