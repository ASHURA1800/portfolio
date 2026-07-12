'use client';

import type { ReactNode } from 'react';
import { motion } from 'motion/react';
import { Button, type ButtonProps } from '@/components/admin/ui/Button';
import { authSuccessPop } from './auth-motion-presets';

export interface AuthButtonProps extends Omit<ButtonProps, 'children'> {
  loading?: boolean;
  /** Show the success state — swaps content for an animated checkmark + label. */
  success?: boolean;
  successLabel?: ReactNode;
  loadingLabel?: ReactNode;
  children: ReactNode;
}

/**
 * Primary submit button for auth forms. Generalizes the loading → success
 * swap every form (login, reset, change-password) reimplements: idle
 * label, "Signing in…" while loading, then a checkmark pop before
 * navigating away. Disabled once `success` is true so it can't be
 * re-submitted during the brief redirect delay.
 */
export function AuthButton({
  loading = false,
  success = false,
  successLabel = '✓ Success',
  loadingLabel,
  children,
  disabled,
  icon,
  ...rest
}: AuthButtonProps) {
  return (
    <Button
      type="submit"
      variant="primary"
      fullWidth
      loading={loading}
      disabled={disabled || success}
      icon={success ? undefined : icon}
      {...rest}
    >
      {success ? (
        <motion.span
          initial="hidden"
          animate="show"
          variants={authSuccessPop}
          className="inline-flex items-center gap-1.5"
        >
          {successLabel}
        </motion.span>
      ) : loading ? (
        loadingLabel ?? children
      ) : (
        children
      )}
    </Button>
  );
}
