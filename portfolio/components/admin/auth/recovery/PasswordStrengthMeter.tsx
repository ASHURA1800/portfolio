'use client';

import { motion } from 'motion/react';

export type StrengthLevel = 0 | 1 | 2 | 3 | 4;

/** Score a password → 0–4 */
export function scorePassword(pw: string): StrengthLevel {
  if (!pw) return 0;
  let score = 0;
  if (pw.length >= 8)  score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return Math.min(score, 4) as StrengthLevel;
}

const LABELS: Record<StrengthLevel, string> = {
  0: '',
  1: 'Weak',
  2: 'Fair',
  3: 'Good',
  4: 'Strong',
};

const COLORS: Record<StrengthLevel, string> = {
  0: 'rgba(255,255,255,0.08)',
  1: 'rgb(239,68,68)',
  2: 'rgb(251,146,60)',
  3: 'rgb(250,204,21)',
  4: 'rgb(52,211,153)',
};

interface PasswordStrengthMeterProps {
  password: string;
}

/**
 * PasswordStrengthMeter
 * Four equal-width segments that fill left→right as strength increases.
 * Uses animated background colour transitions instead of a width bar —
 * more visually distinctive, avoids the generic "thin bar" look.
 */
export function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
  const score = scorePassword(password);
  const label = LABELS[score];
  const activeColor = COLORS[score];

  if (!password) return null;

  return (
    <div style={{ marginTop: '0.5rem' }}>
      {/* Segment row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '0.25rem',
          marginBottom: '0.3125rem',
        }}
      >
        {([1, 2, 3, 4] as StrengthLevel[]).map((seg) => (
          <motion.div
            key={seg}
            animate={{
              background: seg <= score ? activeColor : 'rgba(255,255,255,0.08)',
            }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            style={{
              height: '0.1875rem',
              borderRadius: 'var(--radius-full)',
            }}
          />
        ))}
      </div>

      {/* Label */}
      {label && (
        <motion.p
          key={label}
          initial={{ opacity: 0, y: 2 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          style={{
            fontSize: 'var(--text-xs)',
            color: activeColor,
            fontWeight: 500,
            lineHeight: 1,
          }}
        >
          {label}
        </motion.p>
      )}
    </div>
  );
}
