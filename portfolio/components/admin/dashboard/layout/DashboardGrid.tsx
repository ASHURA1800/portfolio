import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

type GridCols = 1 | 2 | 3 | 4 | 6;

interface DashboardGridProps {
  children: ReactNode;
  className?: string;
  /**
   * Number of columns on tablet/desktop (≥ 768px).
   * Mobile always collapses to 1 or 2 depending on `mobileHalf`.
   * @default 3
   */
  cols?: GridCols;
  /**
   * On mobile, use 2-column layout instead of 1.
   * Useful for compact stat cards that read fine in a 2-col grid on phones.
   * @default false
   */
  mobileHalf?: boolean;
  gap?: 'sm' | 'md' | 'lg';
}

const GAP_MAP: Record<string, string> = {
  sm: '0.75rem',
  md: 'var(--admin-space-card)',
  lg: 'var(--admin-space-section)',
};

/**
 * DashboardGrid
 * Responsive CSS Grid container. Widgets drop into it as direct children.
 *
 * Breakpoints match Tailwind's md (768px) and lg (1024px) since the admin
 * shell already collapses the sidebar at md.
 */
export default function DashboardGrid({
  children,
  className,
  cols = 3,
  mobileHalf = false,
  gap = 'md',
}: DashboardGridProps) {
  const mobileCols = mobileHalf ? 2 : 1;

  return (
    <div
      className={cn('dashboard-grid', className)}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${mobileCols}, 1fr)`,
        gap: GAP_MAP[gap],
      }}
    >
      {/* CSS Grid responsive override via a style tag scoped to this instance
          is undesirable in RSC. Instead we use a named CSS class set in
          admin-theme.css (dashboard-grid-2 / -3 / -4 / -6) added at
          runtime, so the media queries live in the stylesheet.
          The dashboard currently uses a 3-col grid; the class is stable. */}
      <style>{`
        @media (min-width: 640px) {
          .dashboard-grid { grid-template-columns: repeat(${Math.min(cols, 2)}, 1fr); }
        }
        @media (min-width: 768px) {
          .dashboard-grid { grid-template-columns: repeat(${Math.min(cols, 3)}, 1fr); }
        }
        @media (min-width: 1024px) {
          .dashboard-grid { grid-template-columns: repeat(${cols}, 1fr); }
        }
      `}</style>
      {children}
    </div>
  );
}
