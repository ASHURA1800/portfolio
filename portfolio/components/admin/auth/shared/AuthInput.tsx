'use client';

import { forwardRef } from 'react';
import { Input, type InputProps } from '@/components/admin/ui/Input';

export type AuthInputProps = InputProps;

/** Re-export of the base Input, scoped to the auth library so auth forms
 *  import everything from one place (`@/components/admin/auth/shared`)
 *  instead of reaching into `admin/ui` directly. No behavior changes —
 *  keeps a single source of truth for the actual input styling. */
export const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(function AuthInput(props, ref) {
  return <Input ref={ref} {...props} />;
});
