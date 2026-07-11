'use client';

import { useState, useId, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X } from 'lucide-react';

interface TagInputProps {
  label: string;
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  helperText?: string;
  disabled?: boolean;
  /** If set, reject tags beyond this count */
  maxTags?: number;
  className?: string;
}

/**
 * TagInput
 * Enter/comma/Tab adds a tag. Click × or Backspace on empty input removes last.
 * Duplicate check is case-insensitive.
 */
export default function TagInput({
  label,
  tags,
  onChange,
  placeholder = 'Type and press Enter…',
  helperText,
  disabled,
  maxTags,
  className,
}: TagInputProps) {
  const id = useId();
  const [draft, setDraft] = useState('');
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const add = () => {
    const v = draft.trim();
    if (!v) return;
    if (maxTags != null && tags.length >= maxTags) return;
    if (tags.some((t) => t.toLowerCase() === v.toLowerCase())) {
      setDraft('');
      return;
    }
    onChange([...tags, v]);
    setDraft('');
  };

  const remove = (tag: string) => onChange(tags.filter((t) => t !== tag));

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',' || e.key === 'Tab') {
      if (draft.trim()) {
        e.preventDefault();
        add();
      }
    }
    if (e.key === 'Backspace' && draft === '' && tags.length > 0) {
      onChange(tags.slice(0, -1));
    }
  };

  const borderColor = focused
    ? 'rgba(124, 77, 255, 0.5)'
    : 'var(--color-border)';
  const boxShadow = focused
    ? '0 0 0 3px rgba(124, 77, 255, 0.12)'
    : 'none';

  return (
    <div className={className}>
      <label
        htmlFor={id}
        style={{
          display: 'block',
          fontSize: 'var(--text-xs)',
          fontWeight: 600,
          letterSpacing: 'var(--tracking-wide)',
          textTransform: 'uppercase',
          color: focused ? 'var(--color-accent-300)' : 'var(--color-faint)',
          marginBottom: '0.5rem',
          transition: 'color 0.16s ease',
        }}
      >
        {label}
        {maxTags != null && (
          <span
            style={{
              marginLeft: '0.5rem',
              fontWeight: 400,
              color: 'var(--color-faint)',
              textTransform: 'none',
              letterSpacing: 'normal',
            }}
          >
            ({tags.length}/{maxTags})
          </span>
        )}
      </label>

      {/* Tag pill container + input */}
      <div
        onClick={() => inputRef.current?.focus()}
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.5rem',
          alignItems: 'center',
          padding: '0.625rem 0.875rem',
          border: `1px solid ${borderColor}`,
          borderRadius: 'var(--radius-md)',
          background: disabled
            ? 'rgba(255,255,255,0.02)'
            : 'rgba(255,255,255,0.03)',
          boxShadow,
          cursor: 'text',
          minHeight: '2.75rem',
          transition: 'border-color 0.18s ease, box-shadow 0.18s ease',
        }}
      >
        <AnimatePresence initial={false}>
          {tags.map((tag) => (
            <motion.span
              key={tag}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.1 } }}
              transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                padding: '0.25rem 0.625rem',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(124, 77, 255, 0.15)',
                border: '1px solid rgba(124, 77, 255, 0.25)',
                color: 'var(--color-accent-300)',
                fontSize: 'var(--text-xs)',
                fontWeight: 500,
                whiteSpace: 'nowrap',
              }}
            >
              {tag}
              {!disabled && (
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); remove(tag); }}
                  aria-label={`Remove ${tag}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    color: 'var(--color-accent-400)',
                    cursor: 'pointer',
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    lineHeight: 1,
                  }}
                >
                  <X size={11} strokeWidth={2.5} />
                </button>
              )}
            </motion.span>
          ))}
        </AnimatePresence>

        <input
          id={id}
          ref={inputRef}
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => { setFocused(false); add(); }}
          disabled={disabled || (maxTags != null && tags.length >= maxTags)}
          placeholder={
            maxTags != null && tags.length >= maxTags ? 'Limit reached' : placeholder
          }
          style={{
            flex: '1 1 120px',
            minWidth: '80px',
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: 'var(--color-ink)',
            fontSize: 'var(--text-sm)',
            fontFamily: 'inherit',
            padding: 0,
          }}
        />
      </div>

      {helperText && (
        <p
          style={{
            marginTop: '0.375rem',
            fontSize: 'var(--text-xs)',
            color: 'var(--color-faint)',
          }}
        >
          {helperText}
        </p>
      )}
    </div>
  );
}
