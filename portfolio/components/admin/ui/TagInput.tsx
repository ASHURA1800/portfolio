'use client';

import { useId, useState, type KeyboardEvent } from 'react';
import { Chip } from './Chip';
import { cn } from '@/lib/utils';

export interface TagInputProps {
  label?: string;
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  max?: number;
  hint?: string;
  error?: string;
  /** Case-insensitive dedupe on add. Default true. */
  dedupe?: boolean;
}

/**
 * Canonical chip-list input for string[] fields (tags, tech stack,
 * deliverables, project learnings, challenges). Enter or comma commits the
 * current text as a chip; Backspace on an empty field removes the last
 * chip. This replaces the two near-duplicate implementations that existed
 * before (ProjectTags, crud/TagListInput) — both now wrap this.
 */
export function TagInput({ label, values, onChange, placeholder, max = 30, hint, error, dedupe = true }: TagInputProps) {
  const [draft, setDraft] = useState('');
  const fieldId = useId();

  const commit = (raw: string) => {
    const value = raw.trim();
    if (!value || values.length >= max) return;
    if (dedupe && values.some((v) => v.toLowerCase() === value.toLowerCase())) {
      setDraft('');
      return;
    }
    onChange([...values, value]);
    setDraft('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      commit(draft);
    } else if (e.key === 'Backspace' && draft === '' && values.length > 0) {
      onChange(values.slice(0, -1));
    }
  };

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={fieldId} className="text-sm font-medium text-[var(--color-ink)]">
          {label}
        </label>
      )}
      <div
        className={cn(
          'flex flex-wrap items-center gap-1.5 min-h-10 w-full bg-[var(--color-surface)] border rounded-[var(--radius-md)] px-2.5 py-1.5',
          'focus-within:ring-2 focus-within:ring-[var(--color-accent-500)]/40 focus-within:border-[var(--color-accent-500)] transition-colors',
          error ? 'border-[var(--color-error)]' : 'border-[var(--color-border)]'
        )}
      >
        {values.map((v) => (
          <Chip key={v} size="sm" onRemove={() => onChange(values.filter((x) => x !== v))}>
            {v}
          </Chip>
        ))}
        <input
          id={fieldId}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => commit(draft)}
          placeholder={values.length === 0 ? placeholder : ''}
          className="flex-1 min-w-[6rem] bg-transparent text-sm text-[var(--color-ink)] placeholder:text-[var(--color-faint)] focus:outline-none py-0.5"
        />
      </div>
      {error ? (
        <p role="alert" className="text-xs text-[var(--color-error)]">{error}</p>
      ) : hint ? (
        <p className="text-xs text-[var(--color-faint)]">{hint}</p>
      ) : null}
    </div>
  );
}
