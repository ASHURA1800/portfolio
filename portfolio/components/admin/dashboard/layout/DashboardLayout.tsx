import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  children: ReactNode;
  className?: string;
}

/**
 * DashboardLayout
 * Root wrapper for the /admin dashboard page. Provides the outer vertical
 * flex column that sequences Hero → Content with consistent rhythm.
 * Does not add padding — that's owned by the existing .admin-page class
 * on MainContent so all admin pages share the same outer padding.
 */
export default function DashboardLayout({ children, className }: DashboardLayoutProps) {
  return (
    <div
      className={cn('dashboard-layout', className)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 0,
        minHeight: '100%',
      }}
    >
      {children}
    </div>
  );
}
