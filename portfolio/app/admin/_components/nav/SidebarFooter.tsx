'use client';

import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { LogOut, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { useSidebar } from './SidebarContext';

interface SidebarFooterProps {
  userEmail: string;
}

export default function SidebarFooter({ userEmail }: SidebarFooterProps) {
  const { collapsed, toggleCollapse } = useSidebar();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  const initials = userEmail.slice(0, 2).toUpperCase();

  return (
    <div
      style={{
        borderTop: '1px solid var(--color-border)',
        padding: '0.75rem 0.625rem 0.625rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.375rem',
      }}
    >
      {/* User row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.625rem',
          padding: '0.375rem 0.25rem',
          justifyContent: collapsed ? 'center' : 'flex-start',
        }}
      >
        {/* Avatar */}
        <span
          style={{
            width: '1.875rem',
            height: '1.875rem',
            borderRadius: 'var(--radius-full)',
            background: 'linear-gradient(135deg, var(--color-accent-600), var(--color-accent2-600))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 'var(--text-xs)',
            fontWeight: 700,
            color: 'white',
            flexShrink: 0,
          }}
          aria-hidden="true"
        >
          {initials}
        </span>

        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.p
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }}
              style={{
                fontSize: 'var(--text-xs)',
                color: 'var(--color-faint)',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                flex: 1,
                minWidth: 0,
              }}
            >
              {userEmail}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Actions row */}
      <div
        style={{
          display: 'flex',
          gap: '0.25rem',
          justifyContent: collapsed ? 'center' : 'space-between',
        }}
      >
        {/* Logout */}
        <button
          type="button"
          onClick={handleLogout}
          title="Sign out"
          aria-label="Sign out"
          style={{
            flex: collapsed ? undefined : 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.375rem',
            padding: '0.4rem 0.5rem',
            borderRadius: 'var(--radius-sm)',
            border: 'none',
            background: 'none',
            color: 'var(--color-faint)',
            fontSize: 'var(--text-xs)',
            cursor: 'pointer',
            transition: 'color 0.15s, background 0.15s',
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget;
            el.style.color = 'var(--color-error)';
            el.style.background = 'rgba(255,92,113,0.08)';
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget;
            el.style.color = 'var(--color-faint)';
            el.style.background = 'none';
          }}
        >
          <LogOut size={14} />
          <AnimatePresence initial={false}>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.18 }}
                style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}
              >
                Sign out
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        {/* Collapse toggle — desktop only */}
        <button
          type="button"
          onClick={toggleCollapse}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="hidden md:flex"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '2rem',
            height: '2rem',
            borderRadius: 'var(--radius-sm)',
            border: 'none',
            background: 'none',
            color: 'var(--color-faint)',
            cursor: 'pointer',
            flexShrink: 0,
            transition: 'color 0.15s, background 0.15s',
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget;
            el.style.color = 'var(--color-ink)';
            el.style.background = 'rgba(255,255,255,0.06)';
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget;
            el.style.color = 'var(--color-faint)';
            el.style.background = 'none';
          }}
        >
          {collapsed ? <ChevronsRight size={14} /> : <ChevronsLeft size={14} />}
        </button>
      </div>
    </div>
  );
}
