'use client';

import { PanelLeft } from 'lucide-react';
import { useSidebar } from './SidebarContext';
import Breadcrumb from './Breadcrumb';
import ProfileDropdown from './ProfileDropdown';
import NotificationMenu, { type Notification } from './NotificationMenu';
import CommandPalette from './CommandPalette';
import QuickActions from './QuickActions';
import { useState } from 'react';

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

  const dismiss = (id: string) =>
    setNotifications((n) => n.filter((x) => x.id !== id));

  const markAllRead = () =>
    setNotifications((n) => n.map((x) => ({ ...x, read: true })));

  return (
    <header
      className="admin-topbar"
      style={{ justifyContent: 'space-between' }}
      aria-label="Admin top navigation"
    >
      {/* Left: hamburger (mobile) + breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={openMobile}
          aria-label="Open navigation"
          className="md:hidden"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '2rem',
            height: '2rem',
            borderRadius: 'var(--radius-sm)',
            border: 'none',
            background: 'none',
            color: 'var(--color-muted)',
            cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          <PanelLeft size={18} />
        </button>

        <Breadcrumb />
      </div>

      {/* Right: command palette + quick actions + notifications + profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
        {/* Command palette trigger — hidden on xs */}
        <div className="hidden sm:block">
          <CommandPalette />
        </div>

        <QuickActions />

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
