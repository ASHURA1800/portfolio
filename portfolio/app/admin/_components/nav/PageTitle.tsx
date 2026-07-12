'use client';

import { motion } from 'motion/react';
import { useNavigation } from './NavigationContext';

export interface PageTitleProps {
  /** Optional trailing content (e.g. a primary action button) rendered on the same row as the title. */
  action?: React.ReactNode;
  className?: string;
}

/**
 * PAGE TITLE — renders the current route's title and description, both
 * resolved from NavigationConfig via useNavigation(). No page passes its
 * own title string; the heading always matches what's registered in
 * lib/admin/navigation.config.ts, which is also what the sidebar and
 * breadcrumbs show, so the three can never drift out of sync.
 *
 * Mount this once near the top of a manager page's content — not in the
 * Topbar itself, since the audit's dashboard/manager pages each already
 * render their own H1-equivalent inline. This gives them a drop-in
 * replacement that's animated and config-driven instead of a hardcoded
 * <h1>{'Projects'}</h1>.
 */
export function PageTitle({ action, className }: PageTitleProps) {
  const { metadata } = useNavigation();

  return (
    <motion.div
      key={metadata.title}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className={className}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: '1rem',
        marginBottom: 'var(--admin-space-section)',
      }}
    >
      <div>
        <h1 className="admin-page-title">{metadata.title}</h1>
        {metadata.description && <p className="admin-page-subtitle">{metadata.description}</p>}
      </div>
      {action && <div style={{ flexShrink: 0 }}>{action}</div>}
    </motion.div>
  );
}
