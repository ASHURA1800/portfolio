'use client';

import { memo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion, type PanInfo } from 'motion/react';
import { useSidebar } from './SidebarContext';
import { SidebarGroup, SidebarItem } from './SidebarParts';
import SidebarFooter from './SidebarFooter';
import { NAV_GROUPS, type NavGroupId } from '@/lib/admin/navigation.config';
import { getGroupedNavRoutes } from '@/lib/admin/route-helpers';
import { drawerBackdropAnimation } from '@/lib/motion';

// Nav items are no longer hardcoded here — every sidebar entry, its icon,
// label, and grouping comes from lib/admin/navigation.config.ts. Adding or
// renaming a route only requires editing that one file.
const GROUPED_ROUTES = getGroupedNavRoutes();
const GROUP_ORDER: NavGroupId[] = ['main', 'content', 'writing'];

interface AdminSidebarProps {
  userEmail: string;
}

const SidebarContent = memo(function SidebarContent({ userEmail }: AdminSidebarProps) {
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
        {GROUP_ORDER.map((groupId) => {
          const routes = GROUPED_ROUTES[groupId];
          if (!routes?.length) return null;
          return (
            <SidebarGroup key={groupId} label={NAV_GROUPS[groupId] || undefined}>
              {routes.map((route) => (
                <SidebarItem
                  key={route.path}
                  href={route.path}
                  label={route.label}
                  icon={route.icon}
                  exact={route.exact}
                />
              ))}
            </SidebarGroup>
          );
        })}
      </nav>

      <SidebarFooter userEmail={userEmail} />
    </div>
  );
});

export default function AdminSidebar({ userEmail }: AdminSidebarProps) {
  const { mobileOpen, closeMobile } = useSidebar();
  const reduceMotion = useReducedMotion();

  // Swipe-to-close: a left-drag past ~80px, or a fast leftward flick,
  // dismisses the drawer — mirrors the native iOS/Android edge-drawer
  // gesture users already expect from any app with a slide-out nav.
  const handleDragEnd = (_e: PointerEvent, info: PanInfo) => {
    const draggedFarEnough = info.offset.x < -80;
    const flickedFast = info.velocity.x < -400;
    if (draggedFarEnough || flickedFast) closeMobile();
  };

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
              variants={reduceMotion ? { initial: { opacity: 1 }, animate: { opacity: 1 }, exit: { opacity: 1 } } : drawerBackdropAnimation}
              initial="initial"
              animate="animate"
              exit="exit"
              className="admin-sidebar-overlay md:hidden"
              onClick={closeMobile}
              aria-hidden="true"
            />

            {/* Drawer — draggable for swipe-to-close. When reduced motion is
                on, both the entrance/exit and the drag gesture are disabled:
                a user who has asked for less motion also shouldn't have the
                drawer chase their finger around. It simply appears/disappears. */}
            <motion.div
              key="drawer"
              initial={reduceMotion ? { x: 0 } : { x: '-100%' }}
              animate={{ x: 0 }}
              exit={reduceMotion ? { x: 0 } : { x: '-100%' }}
              transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 400, damping: 38 }}
              drag={reduceMotion ? false : 'x'}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={{ left: 0.35, right: 0 }}
              onDragEnd={handleDragEnd}
              className="md:hidden"
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                bottom: 0,
                zIndex: 'var(--z-admin-sidebar)' as unknown as number,
                // GPU-composited transform, not left/width — keeps the drag
                // and spring animation off the main thread's layout pass.
                willChange: 'transform',
                touchAction: 'pan-y',
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
