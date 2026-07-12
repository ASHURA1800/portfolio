import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface DashboardSectionProps {
  children: ReactNode;
  title?: string;
  description?: string;
  /** Extra action slot (e.g. a "View all" link) rendered top-right */
  action?: ReactNode;
  className?: string;
  /** Skip the default top margin — useful for the first section after hero */
  first?: boolean;
}

/**
 * DashboardSection
 * A named block within the dashboard. Optional heading + description +
 * right-aligned action. Children are the section body (typically a grid
 * or a single widget).
 */
export default function DashboardSection({
  children,
  title,
  description,
  action,
  className,
  first = false,
}: DashboardSectionProps) {
  return (
    <section
      className={cn('dashboard-section', className)}
      style={{
        marginTop: first ? 0 : 'var(--admin-space-section)',
      }}
    >
      {(title || action) && (
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 'var(--admin-space-toolbar)',
            marginBottom: description ? '0.375rem' : '1rem',
          }}
        >
          {title && (
            <h2
              style={{
                fontSize: 'var(--admin-text-section-title)',
                fontWeight: 600,
                letterSpacing: 'var(--tracking-tight)',
                color: 'var(--color-ink)',
                lineHeight: 'var(--leading-tight)',
              }}
            >
              {title}
            </h2>
          )}
          {action && (
            <div style={{ flexShrink: 0, marginTop: '0.1rem' }}>{action}</div>
          )}
        </div>
      )}

      {description && (
        <p
          style={{
            fontSize: 'var(--text-xs)',
            color: 'var(--color-faint)',
            marginBottom: '1rem',
            lineHeight: 'var(--leading-normal)',
          }}
        >
          {description}
        </p>
      )}

      {children}
    </section>
  );
}
