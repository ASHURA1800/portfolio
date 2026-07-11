'use client';

import { useState, useId, useRef } from 'react';
import { Pipette } from 'lucide-react';

const PRESETS = [
  '#7C4DFF', '#22C5F5', '#2ED573', '#FFB020',
  '#FF5C71', '#FF7043', '#00BCD4', '#E91E63',
  '#4CAF50', '#9C27B0', '#FF9800', '#607D8B',
];

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  presets?: string[];
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

/**
 * ColorPicker
 * Preset swatches + hex text input + native <input type="color"> via eyedropper icon.
 * No external library — composable with FloatingInput if needed.
 */
export default function ColorPicker({
  label,
  value,
  onChange,
  presets = PRESETS,
  helperText,
  required,
  disabled,
  className,
}: ColorPickerProps) {
  const id = useId();
  const nativeRef = useRef<HTMLInputElement>(null);
  const [focused, setFocused] = useState(false);

  const safeValue = value || '#7C4DFF';
  const floated = focused || Boolean(value);

  return (
    <div className={className}>
      {/* Hex input with floating label */}
      <div
        style={{
          position: 'relative',
          border: `1px solid ${focused ? 'rgba(124,77,255,0.5)' : 'var(--color-border)'}`,
          borderRadius: 'var(--radius-md)',
          background: disabled ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.03)',
          boxShadow: focused ? '0 0 0 3px rgba(124,77,255,0.12)' : 'none',
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
            color: focused ? 'var(--color-accent-300)' : 'var(--color-faint)',
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

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1.625rem 0.875rem 0.5rem' }}>
          {/* Color swatch preview */}
          <span
            style={{
              width: '1.375rem',
              height: '1.375rem',
              borderRadius: 'var(--radius-xs)',
              background: value || 'transparent',
              border: '1px solid var(--color-border-strong)',
              flexShrink: 0,
              boxShadow: value ? `0 0 8px ${value}55` : 'none',
              transition: 'background 0.2s ease, box-shadow 0.2s ease',
            }}
          />
          <input
            id={id}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            disabled={disabled}
            required={required}
            placeholder="#7C4DFF"
            maxLength={7}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--color-ink)',
              fontSize: 'var(--text-sm)',
              fontFamily: 'var(--font-mono)',
              letterSpacing: '0.05em',
              opacity: disabled ? 0.4 : 1,
            }}
          />
          {/* Native color picker trigger */}
          <button
            type="button"
            disabled={disabled}
            onClick={() => nativeRef.current?.click()}
            aria-label="Open color picker"
            style={{
              background: 'none',
              border: 'none',
              cursor: disabled ? 'not-allowed' : 'pointer',
              color: 'var(--color-faint)',
              display: 'flex',
              alignItems: 'center',
              padding: 0,
              flexShrink: 0,
            }}
          >
            <Pipette size={15} />
          </button>
          <input
            ref={nativeRef}
            type="color"
            value={safeValue}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            style={{ width: 0, height: 0, opacity: 0, position: 'absolute', pointerEvents: 'none' }}
            aria-hidden
          />
        </div>
      </div>

      {/* Preset swatches */}
      {presets.length > 0 && (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.375rem',
            marginTop: '0.625rem',
          }}
        >
          {presets.map((color) => (
            <button
              key={color}
              type="button"
              disabled={disabled}
              onClick={() => onChange(color)}
              aria-label={color}
              style={{
                width: '1.375rem',
                height: '1.375rem',
                borderRadius: 'var(--radius-xs)',
                background: color,
                border: `2px solid ${value === color ? 'white' : 'transparent'}`,
                cursor: disabled ? 'not-allowed' : 'pointer',
                transition: 'transform 0.12s ease, border-color 0.12s ease',
                boxShadow: value === color ? `0 0 8px ${color}88` : 'none',
              }}
              onMouseEnter={(e) => { if (!disabled) (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.2)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'; }}
            />
          ))}
        </div>
      )}

      {helperText && (
        <p style={{ marginTop: '0.375rem', fontSize: 'var(--text-xs)', color: 'var(--color-faint)' }}>
          {helperText}
        </p>
      )}
    </div>
  );
}
