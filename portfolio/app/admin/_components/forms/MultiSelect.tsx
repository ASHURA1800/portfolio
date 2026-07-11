'use client';

import { useState, useRef, useEffect, useId } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Check, ChevronDown, X, Search } from 'lucide-react';

interface Option {
  value: string;
  label: string;
  group?: string;
}

interface MultiSelectProps {
  label: string;
  options: Option[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  searchable?: boolean;
  helperText?: string;
  disabled?: boolean;
  maxSelected?: number;
  className?: string;
}

/**
 * MultiSelect
 * Floating dropdown with search, grouped options, animated open/close.
 * Keyboard: Enter/Space toggles focused option, Esc closes, Arrow keys navigate.
 */
export default function MultiSelect({
  label,
  options,
  selected,
  onChange,
  placeholder = 'Select…',
  searchable = true,
  helperText,
  disabled,
  maxSelected,
  className,
}: MultiSelectProps) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [focusIdx, setFocusIdx] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => searchRef.current?.focus(), 50);
  }, [open]);

  const filtered = query
    ? options.filter(
        (o) =>
          o.label.toLowerCase().includes(query.toLowerCase()) ||
          o.value.toLowerCase().includes(query.toLowerCase())
      )
    : options;

  const toggle = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      if (maxSelected != null && selected.length >= maxSelected) return;
      onChange([...selected, value]);
    }
  };

  const remove = (value: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(selected.filter((v) => v !== value));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpen(true); }
      return;
    }
    if (e.key === 'Escape') { setOpen(false); setQuery(''); }
    if (e.key === 'ArrowDown') { e.preventDefault(); setFocusIdx((i) => Math.min(i + 1, filtered.length - 1)); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setFocusIdx((i) => Math.max(i - 1, 0)); }
    if (e.key === 'Enter') { e.preventDefault(); if (filtered[focusIdx]) toggle(filtered[focusIdx].value); }
  };

  const selectedLabels = selected
    .map((v) => options.find((o) => o.value === v)?.label ?? v);

  // Group options
  const groups = filtered.reduce<Record<string, Option[]>>((acc, o) => {
    const g = o.group ?? '';
    if (!acc[g]) acc[g] = [];
    acc[g].push(o);
    return acc;
  }, {});

  return (
    <div ref={containerRef} className={`relative ${className ?? ''}`} onKeyDown={handleKeyDown}>
      <label
        htmlFor={id}
        id={`${id}-label`}
        style={{
          display: 'block',
          fontSize: 'var(--text-xs)',
          fontWeight: 600,
          letterSpacing: 'var(--tracking-wide)',
          textTransform: 'uppercase',
          color: open ? 'var(--color-accent-300)' : 'var(--color-faint)',
          marginBottom: '0.5rem',
          transition: 'color 0.16s ease',
        }}
      >
        {label}
        {maxSelected != null && (
          <span style={{ marginLeft: '0.5rem', fontWeight: 400, color: 'var(--color-faint)', textTransform: 'none', letterSpacing: 'normal' }}>
            ({selected.length}/{maxSelected})
          </span>
        )}
      </label>

      {/* Trigger */}
      <button
        id={id}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-labelledby={`${id}-label`}
        onClick={() => { if (!disabled) setOpen((o) => !o); }}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          flexWrap: 'wrap',
          padding: '0.5rem 0.875rem',
          border: `1px solid ${open ? 'rgba(124,77,255,0.5)' : 'var(--color-border)'}`,
          borderRadius: 'var(--radius-md)',
          background: disabled ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.03)',
          boxShadow: open ? '0 0 0 3px rgba(124,77,255,0.12)' : 'none',
          cursor: disabled ? 'not-allowed' : 'pointer',
          textAlign: 'left',
          minHeight: '2.75rem',
          transition: 'border-color 0.18s ease, box-shadow 0.18s ease',
          opacity: disabled ? 0.5 : 1,
        }}
      >
        <AnimatePresence initial={false}>
          {selectedLabels.length > 0 ? (
            selectedLabels.map((label, i) => (
              <motion.span
                key={selected[i]}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.14 }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  padding: '0.2rem 0.5rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(124,77,255,0.15)',
                  border: '1px solid rgba(124,77,255,0.25)',
                  color: 'var(--color-accent-300)',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 500,
                }}
              >
                {label}
                <span
                  onClick={(e) => remove(selected[i], e)}
                  role="button"
                  aria-label={`Remove ${label}`}
                  style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                >
                  <X size={10} strokeWidth={2.5} />
                </span>
              </motion.span>
            ))
          ) : (
            <motion.span
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ fontSize: 'var(--text-sm)', color: 'var(--color-faint)', flex: 1 }}
            >
              {placeholder}
            </motion.span>
          )}
        </AnimatePresence>

        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.18 }}
          style={{ marginLeft: 'auto', flexShrink: 0, color: 'var(--color-faint)' }}
        >
          <ChevronDown size={15} />
        </motion.span>
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
            role="listbox"
            aria-multiselectable="true"
            aria-label={label}
            style={{
              position: 'absolute',
              top: 'calc(100% + 0.375rem)',
              left: 0,
              right: 0,
              zIndex: 'var(--z-admin-dropdown)' as unknown as number,
              background: 'var(--color-card)',
              border: '1px solid var(--color-border-hover)',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-lg)',
              overflow: 'hidden',
              maxHeight: '16rem',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {searchable && (
              <div
                style={{
                  padding: '0.5rem',
                  borderBottom: '1px solid var(--color-border)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <Search size={13} color="var(--color-faint)" />
                <input
                  ref={searchRef}
                  type="text"
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); setFocusIdx(0); }}
                  placeholder="Search…"
                  style={{
                    flex: 1,
                    background: 'none',
                    border: 'none',
                    outline: 'none',
                    color: 'var(--color-ink)',
                    fontSize: 'var(--text-sm)',
                    fontFamily: 'inherit',
                  }}
                />
              </div>
            )}

            <div style={{ overflowY: 'auto', flex: 1 }}>
              {filtered.length === 0 ? (
                <p style={{ padding: '0.875rem 1rem', fontSize: 'var(--text-sm)', color: 'var(--color-faint)', textAlign: 'center' }}>
                  No options found
                </p>
              ) : (
                Object.entries(groups).map(([group, opts]) => (
                  <div key={group}>
                    {group && (
                      <p style={{
                        padding: '0.5rem 0.875rem 0.25rem',
                        fontSize: 'var(--text-micro)',
                        fontWeight: 700,
                        letterSpacing: 'var(--tracking-widest)',
                        textTransform: 'uppercase',
                        color: 'var(--color-faint)',
                      }}>
                        {group}
                      </p>
                    )}
                    {opts.map((opt) => {
                      const isSelected = selected.includes(opt.value);
                      const isFocused = filtered.indexOf(opt) === focusIdx;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          role="option"
                          aria-selected={isSelected}
                          onClick={() => toggle(opt.value)}
                          style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.625rem',
                            padding: '0.5rem 0.875rem',
                            background: isFocused
                              ? 'rgba(255,255,255,0.04)'
                              : 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            textAlign: 'left',
                            color: isSelected ? 'var(--color-accent-300)' : 'var(--color-muted)',
                            fontSize: 'var(--text-sm)',
                            transition: 'background 0.12s ease',
                          }}
                        >
                          <span style={{
                            width: '1rem',
                            height: '1rem',
                            borderRadius: 'var(--radius-xs)',
                            border: `1.5px solid ${isSelected ? 'var(--color-accent-500)' : 'var(--color-border-strong)'}`,
                            background: isSelected ? 'var(--color-accent-500)' : 'transparent',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            transition: 'all 0.15s ease',
                          }}>
                            {isSelected && <Check size={10} color="white" strokeWidth={3} />}
                          </span>
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {helperText && (
        <p style={{ marginTop: '0.375rem', fontSize: 'var(--text-xs)', color: 'var(--color-faint)' }}>
          {helperText}
        </p>
      )}
    </div>
  );
}
