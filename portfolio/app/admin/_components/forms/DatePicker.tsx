'use client';

import { useState, useId } from 'react';
import { Calendar } from 'lucide-react';

interface DatePickerProps {
  label: string;
  value: string; // ISO date string YYYY-MM-DD
  onChange: (value: string) => void;
  helperText?: string;
  errorText?: string;
  min?: string;
  max?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

/**
 * DatePicker
 * Styled wrapper around <input type="date">.
 * Calendar icon triggers the native picker (no third-party dependency).
 * Floating label animates up when a value is present.
 */
export default function DatePicker({
  label,
  value,
  onChange,
  helperText,
  errorText,
  min,
  max,
  required,
  disabled,
  className,
}: DatePickerProps) {
  const id = useId();
  const [focused, setFocused] = useState(false);

  const hasValue = Boolean(value);
  const floated = focused || hasValue;
  const isError = Boolean(errorText);

  const borderColor = isError
    ? 'var(--color-error)'
    : focused
    ? 'rgba(124, 77, 255, 0.5)'
    : 'var(--color-border)';

  const boxShadow = isError
    ? '0 0 0 3px rgba(255, 92, 113, 0.12)'
    : focused
    ? '0 0 0 3px rgba(124, 77, 255, 0.12)'
    : 'none';

  return (
    <div className={className}>
      <div
        style={{
          position: 'relative',
          border: `1px solid ${borderColor}`,
          borderRadius: 'var(--radius-md)',
          background: disabled ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.03)',
          boxShadow,
          transition: 'border-color 0.18s ease, box-shadow 0.18s ease',
        }}
      >
        <label
          htmlFor={id}
          style={{
            position: 'absolute',
            left: '1rem',
            top: floated ? '0.45rem' : '50%',
            transform: floated ? 'none' : 'translateY(-50%)',
            fontSize: floated ? 'var(--text-micro)' : 'var(--text-sm)',
            color: isError
              ? 'var(--color-error)'
              : focused
              ? 'var(--color-accent-300)'
              : 'var(--color-faint)',
            fontWeight: floated ? 600 : 400,
            letterSpacing: floated ? 'var(--tracking-wide)' : 'normal',
            textTransform: floated ? 'uppercase' : 'none',
            pointerEvents: 'none',
            transition: 'all 0.16s ease',
            zIndex: 1,
          }}
        >
          {label}
          {required && <span style={{ color: 'var(--color-accent-400)', marginLeft: 2 }}>*</span>}
        </label>

        <div style={{ display: 'flex', alignItems: 'center' }}>
          <input
            id={id}
            type="date"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            min={min}
            max={max}
            required={required}
            disabled={disabled}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: hasValue ? 'var(--color-ink)' : 'transparent',
              fontSize: 'var(--text-sm)',
              fontFamily: 'inherit',
              padding: '1.625rem 1rem 0.5rem',
              cursor: disabled ? 'not-allowed' : 'pointer',
              opacity: disabled ? 0.4 : 1,
              colorScheme: 'dark',
            }}
          />
          <span style={{ paddingRight: '1rem', color: 'var(--color-faint)', display: 'flex', alignItems: 'center' }}>
            <Calendar size={15} />
          </span>
        </div>
      </div>

      <p
        style={{
          marginTop: '0.375rem',
          fontSize: 'var(--text-xs)',
          color: isError ? 'var(--color-error)' : 'var(--color-faint)',
          minHeight: '1rem',
        }}
      >
        {isError ? errorText : helperText ?? ''}
      </p>
    </div>
  );
}
