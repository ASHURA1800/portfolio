import { type ReactNode, type CSSProperties } from 'react';
import { cn } from '@/lib/utils';

interface DashboardWidgetProps {
  children: ReactNode;
  className?: string;
  /** Span multiple grid columns (CSS grid-column: span N) */
  colSpan?: 1 | 2 | 3 | 4;
  /** Span multiple grid rows */
  rowSpan?: 1 | 2;
  /** Enable glassmorphism surface treatment */
  glass?: boolean;
  /** Clickable / interactive — adds hover transition */
  interactive?: boolean;
  style?: CSSProperties;
  as?: 'div' | 'article' | 'aside';
}

/**
 * DashboardWidget
 * Generic card slot for any dashboard content cell. Works inside DashboardGrid
 * or standalone. Supports glass surface, span overrides, and interactive hover.
 *
 * Glass mode: applies backdrop-filter blur + semi-transparent bg, compatible
 * with the Aurora Graphite theme's layered depth model.
 */
export default function DashboardWidget({
  children,
  className,
  colSpan,
  rowSpan,
  glass = false,
  interactive = false,
  style,
  as: Tag = 'div',
}: DashboardWidgetProps) {
  const glassStyles: CSSProperties = glass
    ? {
        background: 'rgba(18, 20, 28, 0.6)',
        backdropFilter: 'blur(16px) saturate(130%)',
        WebkitBackdropFilter: 'blur(16px) saturate(130%)',
        borderColor: 'rgba(255,255,255,0.09)',
      }
    : {};

  const interactiveStyles: CSSProperties = interactive
    ? {
        cursor: 'pointer',
        transition:
          'border-color var(--admin-duration-base) var(--admin-ease-out), background-color var(--admin-duration-base) var(--admin-ease-out), box-shadow var(--admin-duration-base) var(--admin-ease-out)',
      }
    : {};

  return (
    <Tag
      className={cn('admin-card dashboard-widget', className)}
      style={{
        gridColumn: colSpan ? `span ${colSpan}` : undefined,
        gridRow: rowSpan ? `span ${rowSpan}` : undefined,
        ...glassStyles,
        ...interactiveStyles,
        ...style,
      }}
    >
      {children}
    </Tag>
  );
}
