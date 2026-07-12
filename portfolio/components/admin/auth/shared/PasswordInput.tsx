'use client';

import { forwardRef, useState } from 'react';
import { motion } from 'motion/react';
import { Eye, EyeOff } from 'lucide-react';
import { AuthInput, type AuthInputProps } from './AuthInput';
import { StrengthMeter } from './StrengthMeter';
import { PasswordChecklist } from './PasswordChecklist';

export interface PasswordInputProps extends Omit<AuthInputProps, 'type' | 'trailing'> {
  /** Show the segmented strength bar below the field (new-password contexts). */
  showStrength?: boolean;
  /** Show the live requirements checklist below the field. */
  showChecklist?: boolean;
}

/**
 * Auth password field — show/hide toggle (real button, keyboard + SR
 * accessible) plus opt-in strength meter and requirements checklist for
 * signup/reset/change-password contexts. Login just uses the bare
 * toggle (`showStrength`/`showChecklist` both default off).
 */
export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(function PasswordInput(
  { showStrength = false, showChecklist = false, value, ...props },
  ref
) {
  const [visible, setVisible] = useState(false);
  const pw = typeof value === 'string' ? value : '';

  return (
    <div className="flex flex-col gap-2">
      <AuthInput
        ref={ref}
        value={value}
        type={visible ? 'text' : 'password'}
        autoComplete={props.autoComplete ?? 'current-password'}
        trailing={
          <motion.button
            type="button"
            onClick={() => setVisible((v) => !v)}
            whileTap={{ scale: 0.9 }}
            aria-label={visible ? 'Hide password' : 'Show password'}
            aria-pressed={visible}
            className="text-[var(--color-faint)] hover:text-[var(--color-ink)] transition-colors duration-[var(--admin-duration-fast)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-500)] rounded-sm"
          >
            {visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </motion.button>
        }
        {...props}
      />
      {showStrength && <StrengthMeter password={pw} />}
      {showChecklist && <PasswordChecklist password={pw} />}
    </div>
  );
});
