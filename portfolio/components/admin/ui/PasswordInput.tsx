'use client';

import { forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Input, type InputProps } from './Input';

export type PasswordInputProps = Omit<InputProps, 'type' | 'trailing'>;

/** Input with a show/hide toggle. Toggle is a real button — keyboard + SR accessible. */
export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(function PasswordInput(
  props,
  ref
) {
  const [visible, setVisible] = useState(false);

  return (
    <Input
      ref={ref}
      type={visible ? 'text' : 'password'}
      autoComplete={props.autoComplete ?? 'current-password'}
      trailing={
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? 'Hide password' : 'Show password'}
          aria-pressed={visible}
          className="text-[var(--color-faint)] hover:text-[var(--color-ink)] transition-colors duration-[var(--admin-duration-fast)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-500)] rounded-sm"
        >
          {visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      }
      {...props}
    />
  );
});
