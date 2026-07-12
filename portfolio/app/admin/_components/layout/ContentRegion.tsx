import { type ReactNode } from 'react';

/**
 * ContentRegion
 * Occupies the content column of the CSS Grid. Stacks topbar over main
 * in its own inner flex column so the topbar is sticky while main scrolls.
 * On mobile this spans the full width (sidebar is a drawer overlay).
 */

interface ContentRegionProps {
  children: ReactNode;
}

export default function ContentRegion({ children }: ContentRegionProps) {
  return (
    <div
      style={{
        gridArea: 'content',
        display: 'flex',
        flexDirection: 'column',
        minWidth: 0,
        minHeight: 0,
        overflow: 'hidden',
      }}
    >
      {children}
    </div>
  );
}
