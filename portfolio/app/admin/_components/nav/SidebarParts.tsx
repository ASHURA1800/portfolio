'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, type LucideIcon } from 'lucide-react';
import { useSidebar } from './SidebarContext';

// ─── SidebarGroup ─────────────────────────────────────────────────────────────

interface SidebarGroupProps {
  label?: string;
  children: ReactNode;
}

/**
 * SidebarGroup
 * Visual section with optional label. Label hides when sidebar is collapsed.
 */
export function SidebarGroup({ label, children }: SidebarGroupProps) {
  const { collapsed } = useSidebar();

  return (
    <div style={{ marginBottom: '0.25rem' }}>
      <AnimatePresence>
        {label && !collapsed && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            style={{
              fontSize: 'var(--text-micro)',
              fontWeight: 700,
              letterSpacing: 'var(--tracking-widest)',
              textTransform: 'uppercase',
              color: 'var(--color-disabled)',
              padding: '0 0.75rem',
              marginBottom: '0.25rem',
              marginTop: '0.75rem',
            }}
          >
            {label}
          </motion.p>
        )}
      </AnimatePresence>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {children}
      </div>
    </div>
  );
}

// ─── SidebarItem ─────────────────────────────────────────────────────────────

interface SidebarItemProps {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: string | number;
  /** Exact match only (for dashboard) */
  exact?: boolean;
}

/**
 * SidebarItem
 * Nav link with animated layoutId active pill, icon, label, optional badge.
 * Label and badge collapse when sidebar is collapsed — icon stays.
 */
export function SidebarItem({ href, label, icon: Icon, badge, exact = false }: SidebarItemProps) {
  const pathname = usePathname();
  const { collapsed, closeMobile } = useSidebar();
  const active = exact ? pathname === href : pathname === href || pathname.startsWith(href + '/');

  return (
    <Link
      href={href}
      onClick={closeMobile}
      title={collapsed ? label : undefined}
      aria-label={label}
      aria-current={active ? 'page' : undefined}
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        gap: '0.625rem',
        padding: collapsed ? '0.625rem' : '0.5rem 0.75rem',
        borderRadius: 'var(--radius-md)',
        color: active ? 'var(--color-accent-300)' : 'var(--color-muted)',
        fontWeight: active ? 500 : 400,
        fontSize: 'var(--text-sm)',
        textDecoration: 'none',
        justifyContent: collapsed ? 'center' : 'flex-start',
        transition: 'color 0.15s ease, padding 0.25s var(--admin-ease-out)',
        zIndex: 1,
      }}
    >
      {/* Active background pill — shared layoutId so it slides between items */}
      {active && (
        <motion.span
          layoutId="sidebar-active-pill"
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 'var(--radius-md)',
            background: 'rgba(124, 77, 255, 0.12)',
            border: '1px solid rgba(124, 77, 255, 0.2)',
            zIndex: -1,
          }}
          transition={{ type: 'spring', stiffness: 500, damping: 40 }}
        />
      )}

      <Icon
        size={17}
        strokeWidth={active ? 2.2 : 1.8}
        style={{
          flexShrink: 0,
          color: active ? 'var(--color-accent-400)' : 'var(--color-faint)',
          transition: 'color 0.15s ease',
        }}
      />

      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: 'hidden', whiteSpace: 'nowrap', flex: 1 }}
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>

      {badge != null && !collapsed && (
        <span
          style={{
            fontSize: 'var(--text-micro)',
            fontWeight: 700,
            padding: '0.125rem 0.4rem',
            borderRadius: 'var(--radius-full)',
            background: active
              ? 'rgba(124, 77, 255, 0.25)'
              : 'rgba(255,255,255,0.08)',
            color: active ? 'var(--color-accent-300)' : 'var(--color-faint)',
            lineHeight: 1.4,
            flexShrink: 0,
          }}
        >
          {badge}
        </span>
      )}
    </Link>
  );
}

// ─── SidebarCollapse ──────────────────────────────────────────────────────────

interface SidebarCollapseProps {
  label: string;
  icon: LucideIcon;
  children: ReactNode;
  defaultOpen?: boolean;
}

/**
 * SidebarCollapse
 * Accordion-style sub-nav group. Hidden when sidebar is icon-only (collapsed).
 */
export function SidebarCollapse({
  label,
  icon: Icon,
  children,
  defaultOpen = false,
}: SidebarCollapseProps) {
  const { collapsed } = useSidebar();
  const [open, setOpen] = useState(defaultOpen);

  if (collapsed) return null;

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: '0.625rem',
          padding: '0.5rem 0.75rem',
          borderRadius: 'var(--radius-md)',
          color: 'var(--color-muted)',
          fontSize: 'var(--text-sm)',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          transition: 'color 0.15s ease, background 0.15s ease',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.04)';
          (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-ink)';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = 'none';
          (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-muted)';
        }}
        aria-expanded={open}
      >
        <Icon size={17} strokeWidth={1.8} style={{ flexShrink: 0, color: 'var(--color-faint)' }} />
        <span style={{ flex: 1 }}>{label}</span>
        <motion.span animate={{ rotate: open ? 90 : 0 }} transition={{ duration: 0.18 }}>
          <ChevronRight size={13} style={{ color: 'var(--color-faint)' }} />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: 'hidden', paddingLeft: '1.75rem' }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', paddingTop: '2px' }}>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
