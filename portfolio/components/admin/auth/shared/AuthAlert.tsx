'use client';

import type { ReactNode } from 'react';
import { AnimatePresence } from 'motion/react';
import { Alert } from '@/components/admin/ui/Alert';

export interface AuthAlertProps {
  error?: string | null;
  success?: string | null;
  children?: ReactNode;
}

/**
 * Form-level feedback slot for auth forms. Wraps the existing Alert
 * primitive in an AnimatePresence so callers don't have to re-wire the
 * mount/unmount animation on every route. Pass either `error` or
 * `success` (or raw `children` for a custom variant/message).
 */
export function AuthAlert({ error, success, children }: AuthAlertProps) {
  return (
    <AnimatePresence mode="wait">
      {error && (
        <Alert variant="error" key="auth-error">
          {error}
        </Alert>
      )}
      {!error && success && (
        <Alert variant="success" key="auth-success">
          {success}
        </Alert>
      )}
      {!error && !success && children}
    </AnimatePresence>
  );
}
