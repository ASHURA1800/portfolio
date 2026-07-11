'use client';

import {
  useState,
  useRef,
  useId,
  type InputHTMLAttributes,
  type TextareaHTMLAttributes,
  type SelectHTMLAttributes,
  type ReactNode,
} from 'react';

// ─── shared types ────────────────────────────────────────────────────────────

type ValidationState = 'idle' | 'error' | 'success';

interface BaseFieldProps {
  label: string;
  helperText?: string;
  errorText?: string;
  successText?: string;
  /** Overrides auto-derived state */
  validation?: ValidationState;
  /** Shows remaining/max characters */
  maxLength?: number;
  currentLength?: number;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  /** Icon inside the left side of the control */
  leadingIcon?: ReactNode;
  /** Icon/element inside the right side */
  trailingIcon?: ReactNode;
}

// ─── field shell ─────────────────────────────────────────────────────────────

function FieldShell({
  id,
  label,
  helperText,
  errorText,
  successText,
  validation,
  maxLength,
  currentLength,
  required,
  hasValue,
  focused,
  disabled,
  children,
  className,
}: {
  id: string;
  hasValue: boolean;
  focused: boolean;
  children: ReactNode;
} & BaseFieldProps) {
  const state: ValidationState =
    validation ??
    (errorText ? 'error' : successText ? 'success' : 'idle');

  const floated = focused || hasValue;

  const borderColor =
    state === 'error'
      ? 'var(--color-error)'
      : state === 'success'
      ? 'var(--color-success)'
      : focused
      ? 'rgba(124, 77, 255, 0.5)'
      : 'var(--color-border)';

  const glowColor =
    state === 'error'
      ? '0 0 0 3px rgba(255, 92, 113, 0.12)'
      : state === 'success'
      ? '0 0 0 3px rgba(46, 213, 115, 0.12)'
      : focused
      ? '0 0 0 3px rgba(124, 77, 255, 0.12)'
      : 'none';

  return (
    <div className={`relative ${className ?? ''}`}>
      {/* Control wrapper */}
      <div
        style={{
          border: `1px solid ${borderColor}`,
          borderRadius: 'var(--radius-md)',
          boxShadow: glowColor,
          background: disabled
            ? 'rgba(255,255,255,0.02)'
            : 'rgba(255,255,255,0.03)',
          transition:
            'border-color 0.18s ease, box-shadow 0.18s ease, background 0.18s ease',
          position: 'relative',
        }}
      >
        {/* Floating label */}
        <label
          htmlFor={id}
          style={{
            position: 'absolute',
            left: '1rem',
            top: floated ? '0.45rem' : '50%',
            transform: floated ? 'none' : 'translateY(-50%)',
            fontSize: floated
              ? 'var(--text-micro)'
              : 'var(--text-sm)',
            color:
              state === 'error'
                ? 'var(--color-error)'
                : state === 'success'
                ? 'var(--color-success)'
                : focused
                ? 'var(--color-accent-300)'
                : 'var(--color-faint)',
            fontWeight: floated ? 600 : 400,
            letterSpacing: floated ? 'var(--tracking-wide)' : 'normal',
            textTransform: floated ? 'uppercase' : 'none',
            pointerEvents: 'none',
            transition:
              'top 0.16s ease, transform 0.16s ease, font-size 0.16s ease, color 0.16s ease',
            zIndex: 1,
          }}
        >
          {label}
          {required && (
            <span style={{ color: 'var(--color-accent-400)', marginLeft: 2 }}>
              *
            </span>
          )}
        </label>

        {children}
      </div>

      {/* Below-field row */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginTop: '0.375rem',
          minHeight: '1rem',
        }}
      >
        <span
          style={{
            fontSize: 'var(--text-xs)',
            color:
              state === 'error'
                ? 'var(--color-error)'
                : state === 'success'
                ? 'var(--color-success)'
                : 'var(--color-faint)',
            lineHeight: 1.4,
          }}
        >
          {state === 'error' && errorText
            ? errorText
            : state === 'success' && successText
            ? successText
            : helperText ?? ''}
        </span>

        {maxLength != null && currentLength != null && (
          <span
            style={{
              fontSize: 'var(--text-xs)',
              color:
                currentLength > maxLength
                  ? 'var(--color-error)'
                  : currentLength > maxLength * 0.85
                  ? 'var(--color-warning)'
                  : 'var(--color-faint)',
              flexShrink: 0,
              marginLeft: '0.5rem',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {currentLength}/{maxLength}
          </span>
        )}
      </div>
    </div>
  );
}

// ─── shared inner styles ─────────────────────────────────────────────────────

const innerInputStyle = {
  width: '100%',
  background: 'transparent',
  border: 'none',
  outline: 'none',
  color: 'var(--color-ink)',
  fontSize: 'var(--text-sm)',
  fontFamily: 'inherit',
} as const;

// ─── FloatingInput ────────────────────────────────────────────────────────────

type FloatingInputProps = BaseFieldProps &
  Omit<InputHTMLAttributes<HTMLInputElement>, 'id' | 'required' | 'disabled' | 'maxLength'>;

export function FloatingInput({
  label,
  helperText,
  errorText,
  successText,
  validation,
  maxLength,
  currentLength,
  required,
  disabled,
  className,
  leadingIcon,
  trailingIcon,
  value,
  onChange,
  ...rest
}: FloatingInputProps) {
  const id = useId();
  const [focused, setFocused] = useState(false);
  const hasValue = Boolean(value) && String(value).length > 0;
  const len = currentLength ?? (value != null ? String(value).length : 0);

  return (
    <FieldShell
      id={id}
      label={label}
      helperText={helperText}
      errorText={errorText}
      successText={successText}
      validation={validation}
      maxLength={maxLength}
      currentLength={len}
      required={required}
      disabled={disabled}
      hasValue={hasValue}
      focused={focused}
      className={className}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {leadingIcon && (
          <span
            style={{
              paddingLeft: '1rem',
              color: 'var(--color-faint)',
              display: 'flex',
              alignItems: 'center',
              flexShrink: 0,
            }}
          >
            {leadingIcon}
          </span>
        )}
        <input
          id={id}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          maxLength={maxLength}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            ...innerInputStyle,
            padding: `1.625rem 1rem 0.5rem ${leadingIcon ? '0.5rem' : '1rem'}`,
            paddingRight: trailingIcon ? '0.5rem' : '1rem',
            opacity: disabled ? 0.4 : 1,
          }}
          {...rest}
        />
        {trailingIcon && (
          <span
            style={{
              paddingRight: '0.875rem',
              color: 'var(--color-faint)',
              display: 'flex',
              alignItems: 'center',
              flexShrink: 0,
            }}
          >
            {trailingIcon}
          </span>
        )}
      </div>
    </FieldShell>
  );
}

// ─── FloatingTextarea ─────────────────────────────────────────────────────────

type FloatingTextareaProps = BaseFieldProps &
  Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'id' | 'required' | 'disabled' | 'maxLength'> & {
    /** Enable auto-grow (height expands with content) */
    autoResize?: boolean;
    rows?: number;
  };

export function FloatingTextarea({
  label,
  helperText,
  errorText,
  successText,
  validation,
  maxLength,
  currentLength,
  required,
  disabled,
  className,
  autoResize = false,
  rows = 4,
  value,
  onChange,
  ...rest
}: FloatingTextareaProps) {
  const id = useId();
  const ref = useRef<HTMLTextAreaElement>(null);
  const [focused, setFocused] = useState(false);
  const hasValue = Boolean(value) && String(value).length > 0;
  const len = currentLength ?? (value != null ? String(value).length : 0);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (autoResize && ref.current) {
      ref.current.style.height = 'auto';
      ref.current.style.height = `${ref.current.scrollHeight}px`;
    }
    onChange?.(e);
  };

  return (
    <FieldShell
      id={id}
      label={label}
      helperText={helperText}
      errorText={errorText}
      successText={successText}
      validation={validation}
      maxLength={maxLength}
      currentLength={len}
      required={required}
      disabled={disabled}
      hasValue={hasValue}
      focused={focused}
      className={className}
    >
      <textarea
        id={id}
        ref={ref}
        value={value}
        onChange={handleChange}
        required={required}
        disabled={disabled}
        maxLength={maxLength}
        rows={rows}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          ...innerInputStyle,
          display: 'block',
          padding: '1.75rem 1rem 0.625rem',
          resize: autoResize ? 'none' : 'vertical',
          lineHeight: 'var(--leading-normal)',
          opacity: disabled ? 0.4 : 1,
          overflow: autoResize ? 'hidden' : undefined,
          minHeight: autoResize ? 0 : undefined,
        }}
        {...rest}
      />
    </FieldShell>
  );
}

// ─── FloatingSelect ───────────────────────────────────────────────────────────

type FloatingSelectProps = BaseFieldProps &
  Omit<SelectHTMLAttributes<HTMLSelectElement>, 'id' | 'required' | 'disabled'> & {
    options: { value: string; label: string }[];
    placeholder?: string;
  };

export function FloatingSelect({
  label,
  helperText,
  errorText,
  successText,
  validation,
  required,
  disabled,
  className,
  options,
  placeholder,
  value,
  onChange,
  ...rest
}: FloatingSelectProps) {
  const id = useId();
  const [focused, setFocused] = useState(false);
  const hasValue = Boolean(value) && String(value).length > 0;

  return (
    <FieldShell
      id={id}
      label={label}
      helperText={helperText}
      errorText={errorText}
      successText={successText}
      validation={validation}
      required={required}
      disabled={disabled}
      hasValue={hasValue}
      focused={focused}
      className={className}
    >
      <select
        id={id}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          ...innerInputStyle,
          padding: '1.625rem 2.5rem 0.5rem 1rem',
          appearance: 'none',
          WebkitAppearance: 'none',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.4 : 1,
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23686F7F' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 1rem center',
        }}
        {...rest}
      >
        {placeholder && (
          <option value="" style={{ background: '#12141C' }}>
            {placeholder}
          </option>
        )}
        {options.map((o) => (
          <option key={o.value} value={o.value} style={{ background: '#12141C' }}>
            {o.label}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}
