'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PasswordFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  autoComplete?: string;
  placeholder?: string;
  /** Shown below the label in a muted style */
  hint?: string;
  /** Red border + aria-invalid when set */
  error?: boolean;
}

/**
 * PasswordField
 * Password input with a show/hide toggle. The eye icon sits inside the input
 * right edge, matching the LoginForm input style. Focus ring uses the admin
 * accent token, not a browser default.
 */
export function PasswordField({
  id,
  label,
  value,
  onChange,
  disabled = false,
  autoComplete = 'new-password',
  placeholder = '••••••••',
  hint,
  error = false,
}: PasswordFieldProps) {
  const [show, setShow] = useState(false);

  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          marginBottom: '0.375rem',
        }}
      >
        <label
          htmlFor={id}
          style={{
            fontSize: 'var(--text-xs)',
            fontWeight: 600,
            color: error ? 'rgb(248,113,113)' : 'var(--color-muted)',
            letterSpacing: 'var(--tracking-tight)',
          }}
        >
          {label}
        </label>
        {hint && (
          <span
            style={{
              fontSize: '0.625rem',
              color: 'var(--color-faint)',
              letterSpacing: 'var(--tracking-tight)',
            }}
          >
            {hint}
          </span>
        )}
      </div>

      <div style={{ position: 'relative' }}>
        <input
          id={id}
          type={show ? 'text' : 'password'}
          name={id}
          required
          autoComplete={autoComplete}
          disabled={disabled}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={error}
          placeholder={placeholder}
          style={{
            width: '100%',
            paddingRight: '2.75rem', // room for toggle
            boxSizing: 'border-box',
          }}
          className={cn(
            'admin-input',
            error && 'border-red-500/50 focus:border-red-500/70'
          )}
        />

        {/* Show/hide toggle */}
        <button
          type="button"
          aria-label={show ? 'Hide password' : 'Show password'}
          onClick={() => setShow((s) => !s)}
          disabled={disabled}
          style={{
            position: 'absolute',
            right: '0.75rem',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--color-faint)',
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            transition: 'color 150ms ease',
          }}
          className="hover:text-muted"
          tabIndex={-1}
        >
          {show ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      </div>
    </div>
  );
}
