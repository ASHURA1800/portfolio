'use client';

import { type ReactNode, type CSSProperties } from 'react';
import { useSidebar } from '../nav/SidebarContext';

/**
 * AdminShell
 * CSS Grid root shell with named areas: sidebar | content.
 *
 * On mobile (< md): sidebar column = 0, content fills width.
 * On desktop (≥ md): sidebar column reads from --admin-shell-sidebar-w,
 *   which is set on the element and transitions when collapsed changes.
 *
 * The CSS custom property approach lets us animate the column width purely
 * in CSS while keeping the JS logic to a single boolean read.
 */

interface AdminShellProps {
  children: ReactNode;
}

export default function AdminShell({ children }: AdminShellProps) {
  const { collapsed } = useSidebar();

  return (
    <div
      className="admin-shell admin-grid-shell"
      data-sidebar-collapsed={collapsed ? 'true' : 'false'}
      style={
        {
          '--admin-shell-sidebar-w': collapsed
            ? 'var(--admin-sidebar-w-collapsed)'
            : 'var(--admin-sidebar-w)',
        } as CSSProperties
      }
    >
      {children}
    </div>
  );
}
