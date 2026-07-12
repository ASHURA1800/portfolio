import { type ReactNode } from 'react';

/**
 * MainContent
 * The scrollable content area below the topbar.
 * Applies the admin-scroll-thin scrollbar, max-width centering, and
 * consistent page padding via the .admin-page CSS class.
 *
 * The id="main-content" allows skip-link navigation.
 */

interface MainContentProps {
  children: ReactNode;
}

export default function MainContent({ children }: MainContentProps) {
  return (
    <main
      id="main-content"
      className="admin-scroll-thin"
      style={{
        flex: 1,
        overflowY: 'auto',
        overflowX: 'hidden',
        /* Subtle inner top shadow to reinforce depth below the topbar */
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.03)',
      }}
    >
      {/* Inner container: max-width + consistent page padding */}
      <div className="admin-page">{children}</div>
    </main>
  );
}
