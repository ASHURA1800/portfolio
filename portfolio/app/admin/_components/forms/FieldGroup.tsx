import type { ReactNode } from 'react';

interface FieldGroupProps {
  children: ReactNode;
  /** Number of columns at md+ breakpoint. Default 2. */
  cols?: 1 | 2 | 3 | 4;
  /** Section label above the group */
  legend?: string;
  className?: string;
}

const colClass: Record<number, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 md:grid-cols-2',
  3: 'grid-cols-1 md:grid-cols-3',
  4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
};

/**
 * FieldGroup
 * Responsive grid wrapper for form fields.
 * Optional legend doubles as a section divider inside long forms.
 */
export default function FieldGroup({ children, cols = 2, legend, className }: FieldGroupProps) {
  return (
    <fieldset
      className={`border-0 p-0 m-0 ${className ?? ''}`}
      style={{ minWidth: 0 }}
    >
      {legend && (
        <legend
          style={{
            width: '100%',
            float: 'left',
            fontSize: 'var(--text-xs)',
            fontWeight: 600,
            letterSpacing: 'var(--tracking-wider)',
            textTransform: 'uppercase',
            color: 'var(--color-faint)',
            marginBottom: '0.875rem',
            paddingBottom: '0.5rem',
            borderBottom: '1px solid var(--color-border)',
          }}
        >
          {legend}
        </legend>
      )}
      {/* clear legend float */}
      {legend && <div style={{ clear: 'both' }} />}
      <div className={`grid gap-4 ${colClass[cols]}`}>{children}</div>
    </fieldset>
  );
}
