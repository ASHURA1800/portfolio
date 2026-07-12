import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  /** Slot for right-aligned controls (e.g. CTA buttons) */
  controls?: ReactNode;
  className?: string;
}

/**
 * DashboardHeader
 * The page-level heading block. Used below the Hero when the Hero doesn't
 * carry the page title itself, or as a standalone header on simpler layouts.
 * Mirrors the existing .admin-page-header/.admin-page-title CSS classes but
 * exposes them as a typed component.
 */
export default function DashboardHeader({
  title,
  subtitle,
  controls,
  className,
}: DashboardHeaderProps) {
  return (
    <div className={cn('admin-page-header', className)}>
      <div>
        <h1 className="admin-page-title">{title}</h1>
        {subtitle && (
          <p className="admin-page-subtitle">{subtitle}</p>
        )}
      </div>
      {controls && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--admin-space-inline)',
            flexShrink: 0,
          }}
        >
          {controls}
        </div>
      )}
    </div>
  );
}
