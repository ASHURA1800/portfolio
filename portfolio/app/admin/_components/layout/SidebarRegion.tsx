import { type ReactNode } from 'react';

/**
 * SidebarRegion
 * Grid area: "sidebar". On mobile the column width collapses to 0 via
 * AdminShell's grid-template-columns media query — the sidebar itself
 * handles rendering as a fixed drawer overlay on small screens.
 */

interface SidebarRegionProps {
  children: ReactNode;
}

export default function SidebarRegion({ children }: SidebarRegionProps) {
  return (
    <aside
      aria-label="Admin navigation"
      style={{
        gridArea: 'sidebar',
        height: '100dvh',
        position: 'sticky',
        top: 0,
        zIndex: 'var(--z-admin-sidebar)' as unknown as number,
        flexShrink: 0,
        overflow: 'hidden',
      }}
    >
      {children}
    </aside>
  );
}
