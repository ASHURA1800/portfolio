'use client';

import { useCallback, useState } from 'react';
import { motion } from 'motion/react';
import { PanelLeft } from 'lucide-react';
import { useSidebar } from './SidebarContext';
import Breadcrumb from './Breadcrumb';
import ProfileDropdown from './ProfileDropdown';
import NotificationMenu, { type Notification } from './NotificationMenu';
import CommandPalette from './CommandPalette';
import QuickActions from './QuickActions';
import { ThemeToggle } from './ThemeToggle';
import { useScrolled } from './useScrolled';

interface TopNavbarProps {
  userEmail: string;
}

// Demo notifications — in production these would come from a server component / API
const DEMO_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    title: 'Project saved',
    body: 'Aurora Admin Panel changes are live.',
    time: '2 min ago',
    read: false,
    tone: 'success',
  },
  {
    id: '2',
    title: 'New contact message',
    body: 'Someone submitted the contact form.',
    time: '14 min ago',
    read: false,
    tone: 'info',
  },
  {
    id: '3',
    title: 'Image upload failed',
    body: 'File exceeded the 5 MB limit.',
    time: '1 hr ago',
    read: true,
    tone: 'error',
  },
];

export default function TopNavbar({ userEmail }: TopNavbarProps) {
  const { openMobile } = useSidebar();
  const [notifications, setNotifications] = useState(DEMO_NOTIFICATIONS);
  const scrolled = useScrolled('main-content');

  const dismiss = useCallback(
    (id: string) => setNotifications((n) => n.filter((x) => x.id !== id)),
    []
  );

  const markAllRead = useCallback(
    () => setNotifications((n) => n.map((x) => ({ ...x, read: true }))),
    []
  );

  return (
    <header
      className="admin-topbar"
      data-scrolled={scrolled}
      style={{ justifyContent: 'space-between' }}
      aria-label="Admin top navigation"
    >
      {/* Left: hamburger (mobile) + breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
        {/* Mobile hamburger — 44px hit target (WCAG 2.5.5 / iOS HIG minimum),
            even though the visible icon stays compact via padding rather
            than icon size, so it doesn't look oversized next to the other
            2.25rem topbar icon buttons. */}
        <motion.button
          type="button"
          onClick={openMobile}
          aria-label="Open navigation"
          className="md:hidden"
          whileTap={{ scale: 0.9 }}
          transition={{ duration: 0.1 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '2.75rem',
            height: '2.75rem',
            margin: '-0.375rem',
            borderRadius: 'var(--radius-sm)',
            border: 'none',
            background: 'none',
            color: 'var(--color-muted)',
            cursor: 'pointer',
            flexShrink: 0,
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          <PanelLeft size={18} />
        </motion.button>

        <Breadcrumb />
      </div>

      {/* Right: command palette + quick actions + notifications + profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
        {/* Command palette trigger — hidden on xs */}
        <div className="hidden sm:block">
          <CommandPalette />
        </div>

        <QuickActions />

        <ThemeToggle />

        <NotificationMenu
          notifications={notifications}
          onDismiss={dismiss}
          onMarkAllRead={markAllRead}
        />

        <ProfileDropdown userEmail={userEmail} />
      </div>
    </header>
  );
}
