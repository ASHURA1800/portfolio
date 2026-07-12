export interface PasswordCriterion {
  id: string;
  label: string;
  test: (pw: string) => boolean;
}

/** Same criteria set used by both StrengthMeter and PasswordChecklist so
 *  the two never drift out of sync. Kept deliberately simple (no
 *  external zxcvbn dep) — length + character-class coverage. */
export const PASSWORD_CRITERIA: PasswordCriterion[] = [
  { id: 'length', label: 'At least 8 characters', test: (pw) => pw.length >= 8 },
  { id: 'upper', label: 'One uppercase letter', test: (pw) => /[A-Z]/.test(pw) },
  { id: 'lower', label: 'One lowercase letter', test: (pw) => /[a-z]/.test(pw) },
  { id: 'number', label: 'One number', test: (pw) => /[0-9]/.test(pw) },
  { id: 'symbol', label: 'One special character', test: (pw) => /[^A-Za-z0-9]/.test(pw) },
];

export type StrengthLabel = 'Empty' | 'Weak' | 'Fair' | 'Good' | 'Strong';

const LABELS: StrengthLabel[] = ['Empty', 'Weak', 'Fair', 'Good', 'Strong'];
const COLORS = [
  'var(--color-border)',
  'var(--color-error)',
  'var(--color-warning)',
  'var(--color-accent2-500)',
  'var(--color-success)',
] as const;

/** Score 0–4. Length bonus at 12+ chars on top of the five base criteria
 *  keeps long-but-simple passphrases from scoring as "Weak". */
export function scorePassword(pw: string): { score: number; label: StrengthLabel; color: string } {
  if (!pw) return { score: 0, label: 'Empty', color: COLORS[0] };

  let hits = PASSWORD_CRITERIA.reduce((n, c) => n + (c.test(pw) ? 1 : 0), 0);
  if (pw.length >= 12) hits += 1;

  const score = Math.min(4, Math.max(1, Math.round((hits / 6) * 4)));
  return { score, label: LABELS[score], color: COLORS[score] };
}
