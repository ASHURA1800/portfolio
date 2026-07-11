'use client';

import { useState, useRef, useId, useCallback } from 'react';
import {
  Bold,
  Italic,
  Link2,
  List,
  ListOrdered,
  Heading2,
  Code,
  Quote,
  Eye,
  Edit3,
} from 'lucide-react';
import { CharacterCounter } from './FormStates';

interface RichTextEditorProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  helperText?: string;
  placeholder?: string;
  maxLength?: number;
  rows?: number;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

type ToolItem =
  | { type: 'button'; icon: React.ElementType; label: string; action: () => void }
  | { type: 'separator' };

/**
 * RichTextEditor
 * Markdown-flavored textarea with a toolbar for common formatting.
 * No external Slate/Tiptap dep — works with any text/markdown backend.
 * Preview mode renders a basic markdown preview (bold, italic, code, links).
 * Toolbar wraps on narrow viewports.
 */
export default function RichTextEditor({
  label,
  value,
  onChange,
  helperText,
  placeholder = 'Write something…',
  maxLength,
  rows = 10,
  required,
  disabled,
  className,
}: RichTextEditorProps) {
  const id = useId();
  const ref = useRef<HTMLTextAreaElement>(null);
  const [focused, setFocused] = useState(false);
  const [preview, setPreview] = useState(false);

  // ── Wrap/insert helpers ──────────────────────────────────────────────────

  const wrap = useCallback(
    (before: string, after: string, placeholder: string) => {
      const ta = ref.current;
      if (!ta) return;
      const { selectionStart: s, selectionEnd: e } = ta;
      const selected = value.slice(s, e) || placeholder;
      const next = value.slice(0, s) + before + selected + after + value.slice(e);
      onChange(next);
      // Restore selection after React re-render
      requestAnimationFrame(() => {
        ta.selectionStart = s + before.length;
        ta.selectionEnd = s + before.length + selected.length;
        ta.focus();
      });
    },
    [value, onChange]
  );

  const insertLine = useCallback(
    (prefix: string) => {
      const ta = ref.current;
      if (!ta) return;
      const { selectionStart: s } = ta;
      const lineStart = value.lastIndexOf('\n', s - 1) + 1;
      const line = value.slice(lineStart, s);
      const alreadyHas = line.startsWith(prefix);
      const next = alreadyHas
        ? value.slice(0, lineStart) + line.slice(prefix.length) + value.slice(s)
        : value.slice(0, lineStart) + prefix + value.slice(lineStart);
      onChange(next);
      requestAnimationFrame(() => {
        const offset = alreadyHas ? -prefix.length : prefix.length;
        ta.selectionStart = ta.selectionEnd = s + offset;
        ta.focus();
      });
    },
    [value, onChange]
  );

  const insertLink = useCallback(() => {
    const ta = ref.current;
    if (!ta) return;
    const { selectionStart: s, selectionEnd: e } = ta;
    const selected = value.slice(s, e) || 'link text';
    const next = value.slice(0, s) + `[${selected}](url)` + value.slice(e);
    onChange(next);
    requestAnimationFrame(() => {
      const urlStart = s + selected.length + 3;
      ta.selectionStart = urlStart;
      ta.selectionEnd = urlStart + 3;
      ta.focus();
    });
  }, [value, onChange]);

  // ── Toolbar definition ───────────────────────────────────────────────────

  const tools: ToolItem[] = [
    { type: 'button', icon: Heading2, label: 'Heading', action: () => insertLine('## ') },
    { type: 'separator' },
    { type: 'button', icon: Bold, label: 'Bold', action: () => wrap('**', '**', 'bold text') },
    { type: 'button', icon: Italic, label: 'Italic', action: () => wrap('*', '*', 'italic text') },
    { type: 'button', icon: Code, label: 'Inline code', action: () => wrap('`', '`', 'code') },
    { type: 'separator' },
    { type: 'button', icon: List, label: 'Bullet list', action: () => insertLine('- ') },
    { type: 'button', icon: ListOrdered, label: 'Numbered list', action: () => insertLine('1. ') },
    { type: 'button', icon: Quote, label: 'Blockquote', action: () => insertLine('> ') },
    { type: 'separator' },
    { type: 'button', icon: Link2, label: 'Link', action: insertLink },
  ];

  // ── Minimal markdown → HTML for preview ─────────────────────────────────

  const renderPreview = (md: string) => {
    return md
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/`(.+?)`/g, '<code style="background:rgba(255,255,255,0.08);padding:0.1em 0.35em;border-radius:4px;font-size:0.85em">$1</code>')
      .replace(/^## (.+)$/gm, '<h2 style="font-size:1.1em;font-weight:700;margin:1em 0 0.5em;color:var(--color-ink)">$1</h2>')
      .replace(/^> (.+)$/gm, '<blockquote style="border-left:2px solid var(--color-accent-500);padding-left:0.75em;color:var(--color-muted);margin:0.5em 0">$1</blockquote>')
      .replace(/^\d+\. (.+)$/gm, (_, t) => `<li style="list-style-type:decimal;margin-left:1.25em">${t}</li>`)
      .replace(/^- (.+)$/gm, (_, t) => `<li style="list-style-type:disc;margin-left:1.25em">${t}</li>`)
      .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" style="color:var(--color-accent-300);text-decoration:underline" target="_blank" rel="noopener">$1</a>')
      .replace(/\n\n/g, '<br><br>')
      .replace(/\n/g, '<br>');
  };

  const floated = focused || Boolean(value);
  const borderColor = focused ? 'rgba(124,77,255,0.5)' : 'var(--color-border)';

  return (
    <div className={className}>
      {/* Label row */}
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
        <label
          htmlFor={id}
          style={{
            fontSize: 'var(--text-xs)',
            fontWeight: 600,
            letterSpacing: 'var(--tracking-wide)',
            textTransform: 'uppercase',
            color: focused ? 'var(--color-accent-300)' : 'var(--color-faint)',
            transition: 'color 0.16s ease',
          }}
        >
          {label}
          {required && <span style={{ color: 'var(--color-accent-400)', marginLeft: 2 }}>*</span>}
        </label>

        <div style={{ display: 'flex', gap: '0.25rem' }}>
          {([
            { mode: false, Icon: Edit3, tip: 'Edit' },
            { mode: true, Icon: Eye, tip: 'Preview' },
          ] as const).map(({ mode, Icon, tip }) => (
            <button
              key={tip}
              type="button"
              onClick={() => setPreview(mode)}
              aria-pressed={preview === mode}
              title={tip}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                padding: '0.25rem 0.5rem',
                borderRadius: 'var(--radius-xs)',
                border: `1px solid ${preview === mode ? 'var(--color-border-hover)' : 'transparent'}`,
                background: preview === mode ? 'rgba(255,255,255,0.06)' : 'transparent',
                color: preview === mode ? 'var(--color-ink)' : 'var(--color-faint)',
                fontSize: 'var(--text-xs)',
                cursor: 'pointer',
                transition: 'all 0.14s ease',
              }}
            >
              <Icon size={12} />
              {tip}
            </button>
          ))}
        </div>
      </div>

      {/* Editor chrome */}
      <div
        style={{
          border: `1px solid ${borderColor}`,
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden',
          background: 'rgba(255,255,255,0.03)',
          boxShadow: focused ? '0 0 0 3px rgba(124,77,255,0.12)' : 'none',
          transition: 'border-color 0.18s ease, box-shadow 0.18s ease',
        }}
      >
        {/* Toolbar */}
        {!preview && (
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: '0.125rem',
              padding: '0.375rem 0.5rem',
              borderBottom: '1px solid var(--color-border)',
              background: 'rgba(255,255,255,0.02)',
            }}
          >
            {tools.map((tool, i) =>
              tool.type === 'separator' ? (
                <span
                  key={i}
                  style={{
                    width: '1px',
                    height: '1.25rem',
                    background: 'var(--color-border)',
                    margin: '0 0.25rem',
                  }}
                />
              ) : (
                <button
                  key={tool.label}
                  type="button"
                  disabled={disabled}
                  onClick={tool.action}
                  title={tool.label}
                  aria-label={tool.label}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '1.875rem',
                    height: '1.875rem',
                    borderRadius: 'var(--radius-xs)',
                    border: 'none',
                    background: 'transparent',
                    color: 'var(--color-muted)',
                    cursor: disabled ? 'not-allowed' : 'pointer',
                    transition: 'background 0.12s ease, color 0.12s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (!disabled) {
                      (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.08)';
                      (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-ink)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                    (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-muted)';
                  }}
                >
                  <tool.icon size={14} />
                </button>
              )
            )}
          </div>
        )}

        {/* Edit / Preview area */}
        {preview ? (
          <div
            role="region"
            aria-label="Preview"
            style={{
              minHeight: `${rows * 1.6}rem`,
              padding: '0.875rem 1rem',
              fontSize: 'var(--text-sm)',
              color: value ? 'var(--color-muted)' : 'var(--color-faint)',
              lineHeight: 'var(--leading-normal)',
            }}
            dangerouslySetInnerHTML={{
              __html: value ? renderPreview(value) : '<em>Nothing to preview</em>',
            }}
          />
        ) : (
          <textarea
            id={id}
            ref={ref}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder={placeholder}
            rows={rows}
            required={required}
            disabled={disabled}
            maxLength={maxLength}
            style={{
              width: '100%',
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--color-ink)',
              fontSize: 'var(--text-sm)',
              fontFamily: 'inherit',
              padding: '0.875rem 1rem',
              resize: 'vertical',
              lineHeight: 'var(--leading-normal)',
              opacity: disabled ? 0.4 : 1,
            }}
          />
        )}
      </div>

      {/* Below-field row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.375rem', minHeight: '1rem' }}>
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-faint)' }}>
          {helperText}
        </span>
        {maxLength != null && (
          <CharacterCounter current={value.length} max={maxLength} />
        )}
      </div>
    </div>
  );
}
