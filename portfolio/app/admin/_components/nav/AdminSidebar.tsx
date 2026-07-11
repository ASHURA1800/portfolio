'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard, User, FolderOpen, Wrench, Briefcase,
  Award, Blocks, BookOpen, Map, PanelLeft,
} from 'lucide-react';
import { useSidebar } from './SidebarContext';
import { SidebarGroup, SidebarItem } from './SidebarParts';
import SidebarFooter from './SidebarFooter';

const NAV_MAIN = [
  { href: '/admin',                label: 'Dashboard',       icon: LayoutDashboard, exact: true },
  { href: '/admin/profile',        label: 'Profile',         icon: User },
];

const NAV_CONTENT = [
  { href: '/admin/projects',       label: 'Projects',        icon: FolderOpen },
  { href: '/admin/skills',         label: 'Skills',          icon: Wrench },
  { href: '/admin/experience',     label: 'Experience',      icon: Briefcase },
  { href: '/admin/certifications', label: 'Certifications',  icon: Award },
];

const NAV_WRITING = [
  { href: '/admin/buildlog',       label: 'Build Log',       icon: Blocks },
  { href: '/admin/learnings',      label: 'Learnings',       icon: BookOpen },
  { href: '/admin/roadmap',        label: 'Roadmap',         icon: Map },
];

interface AdminSidebarProps {
  userEmail: string;
}

function SidebarContent({ userEmail }: AdminSidebarProps) {
  const { collapsed } = useSidebar();

  return (
    <div
      className="admin-glass-panel admin-sidebar"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: collapsed ? 'var(--admin-sidebar-w-collapsed)' : 'var(--admin-sidebar-w)',
        transition: 'width 0.25s var(--admin-ease-out)',
        overflow: 'hidden',
        flexShrink: 0,
      }}
    >
      {/* Wordmark */}
      <Link
        href="/admin"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.625rem',
          padding: '1.125rem 1rem 0.875rem',
          textDecoration: 'none',
          flexShrink: 0,
          overflow: 'hidden',
        }}
        aria-label="Admin home"
      >
        <span
          style={{
            width: '1.875rem',
            height: '1.875rem',
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, var(--color-accent-500), var(--color-accent2-500))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: 'var(--text-sm)',
            color: 'white',
            flexShrink: 0,
          }}
          aria-hidden="true"
        >
          A
        </span>
        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }}
              style={{
                fontWeight: 600,
                fontSize: 'var(--text-sm)',
                color: 'var(--color-ink)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
              }}
            >
              Portfolio Admin
            </motion.span>
          )}
        </AnimatePresence>
      </Link>

      {/* Nav scroll area */}
      <nav
        className="admin-scroll-thin"
        aria-label="Admin navigation"
        style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          padding: '0 0.5rem',
        }}
      >
        <SidebarGroup>
          {NAV_MAIN.map((item) => (
            <SidebarItem key={item.href} {...item} />
          ))}
        </SidebarGroup>

        <SidebarGroup label="Content">
          {NAV_CONTENT.map((item) => (
            <SidebarItem key={item.href} {...item} />
          ))}
        </SidebarGroup>

        <SidebarGroup label="Writing">
          {NAV_WRITING.map((item) => (
            <SidebarItem key={item.href} {...item} />
          ))}
        </SidebarGroup>
      </nav>

      <SidebarFooter userEmail={userEmail} />
    </div>
  );
}

export default function AdminSidebar({ userEmail }: AdminSidebarProps) {
  const { mobileOpen, closeMobile } = useSidebar();

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden md:flex" style={{ height: '100vh', flexShrink: 0 }}>
        <SidebarContent userEmail={userEmail} />
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="admin-sidebar-overlay md:hidden"
              onClick={closeMobile}
              aria-hidden="true"
            />

            {/* Drawer */}
            <motion.div
              key="drawer"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 400, damping: 38 }}
              className="md:hidden"
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                bottom: 0,
                zIndex: 'var(--z-admin-sidebar)' as unknown as number,
              }}
            >
              <SidebarContent userEmail={userEmail} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
