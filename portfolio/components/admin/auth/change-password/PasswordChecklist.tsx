'use client';

import { motion, AnimatePresence } from 'motion/react';
import { Check, X } from 'lucide-react';

interface Rule {
  key: string;
  label: string;
  test: (pw: string) => boolean;
}

const RULES: Rule[] = [
  { key: 'len',     label: 'At least 8 characters',          test: (pw) => pw.length >= 8 },
  { key: 'upper',   label: 'Uppercase letter',                test: (pw) => /[A-Z]/.test(pw) },
  { key: 'lower',   label: 'Lowercase letter',                test: (pw) => /[a-z]/.test(pw) },
  { key: 'number',  label: 'Number',                          test: (pw) => /[0-9]/.test(pw) },
  { key: 'special', label: 'Special character (!@#$…)',        test: (pw) => /[^A-Za-z0-9]/.test(pw) },
];

interface PasswordChecklistProps {
  password: string;
}

/**
 * PasswordChecklist
 * Rule-by-rule checklist that transitions each item green as the password
 * satisfies it. Uses icon swap (X → Check) with a quick scale pop.
 * Only renders when the password field is non-empty.
 */
export function PasswordChecklist({ password }: PasswordChecklistProps) {
  if (!password) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Password requirements"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.3125rem',
        padding: '0.75rem',
        borderRadius: 'var(--radius-md)',
        background: 'rgba(255,255,255,0.025)',
        border: '1px solid rgba(255,255,255,0.06)',
        marginTop: '0.5rem',
      }}
    >
      {RULES.map(({ key, label, test }) => {
        const ok = test(password);
        return (
          <div
            key={key}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            {/* Icon */}
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={ok ? 'check' : 'x'}
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.6, opacity: 0 }}
                transition={{ duration: 0.15 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  color: ok ? 'rgb(52,211,153)' : 'rgba(255,255,255,0.2)',
                  flexShrink: 0,
                }}
              >
                {ok ? <Check size={12} strokeWidth={2.5} /> : <X size={12} strokeWidth={2.5} />}
              </motion.span>
            </AnimatePresence>

            {/* Label */}
            <motion.span
              animate={{ color: ok ? 'rgb(110,231,183)' : 'var(--color-faint)' }}
              transition={{ duration: 0.2 }}
              style={{
                fontSize: 'var(--text-xs)',
                lineHeight: 1,
              }}
            >
              {label}
            </motion.span>
          </div>
        );
      })}
    </div>
  );
}
