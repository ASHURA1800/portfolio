'use client';

import { useId, useState } from 'react';
import { motion } from 'motion/react';

const EASE = [0.22, 1, 0.36, 1] as const;

interface FloatingFieldProps {
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
  required?: boolean;
  multiline?: boolean;
  rows?: number;
  error?: string;
}

/**
 * Text input / textarea with a label that floats above the field once it has
 * focus or content. Reusable for any form in the app, not just Contact.
 */
export function FloatingField({
  label,
  name,
  type = 'text',
  autoComplete,
  required,
  multiline,
  rows = 5,
  error,
}: FloatingFieldProps) {
  const id = useId();
  const [focused, setFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);
  const floated = focused || hasValue;

  const sharedProps = {
    id,
    name,
    required,
    autoComplete,
    'aria-invalid': !!error,
    'aria-describedby': error ? `${id}-error` : undefined,
    onFocus: () => setFocused(true),
    onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFocused(false);
      setHasValue(e.target.value.trim().length > 0);
    },
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setHasValue(e.target.value.trim().length > 0),
    className: `input peer ${error ? 'input-error' : ''} ${multiline ? 'resize-none' : ''}`,
  };

  return (
    <div className="relative">
      <motion.label
        htmlFor={id}
        initial={false}
        animate={
          floated
            ? { top: multiline ? 10 : 0, y: multiline ? 0 : '-100%', fontSize: '0.6875rem' }
            : { top: multiline ? 14 : '50%', y: multiline ? 0 : '-50%', fontSize: '0.875rem' }
        }
        transition={{ duration: 0.18, ease: EASE }}
        className={`pointer-events-none absolute left-4 z-10 origin-left font-medium tracking-wide ${
          floated ? 'text-accent-300' : 'text-faint'
        } ${multiline ? '' : ''}`}
        style={{ backgroundColor: floated ? 'var(--color-bg)' : 'transparent', padding: floated ? '0 0.3rem' : 0, marginLeft: floated ? '-0.3rem' : 0 }}
      >
        {label}
        {required && <span className="text-accent-400"> *</span>}
      </motion.label>

      {multiline ? (
        <textarea rows={rows} {...sharedProps} className={`${sharedProps.className} pt-5`} />
      ) : (
        <input type={type} {...sharedProps} className={`${sharedProps.className} h-[52px] pt-2`} />
      )}

      {error && (
        <motion.p
          id={`${id}-error`}
          role="alert"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1.5 text-xs text-error"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}
