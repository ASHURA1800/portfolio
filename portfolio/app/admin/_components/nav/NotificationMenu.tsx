'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, CheckCheck, X } from 'lucide-react';

export interface Notification {
  id: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
  tone?: 'info' | 'success' | 'warning' | 'error';
}

interface NotificationMenuProps {
  notifications: Notification[];
  onDismiss?: (id: string) => void;
  onMarkAllRead?: () => void;
}

const TONE_COLORS: Record<string, string> = {
  info: 'var(--color-info)',
  success: 'var(--color-success)',
  warning: 'var(--color-warning)',
  error: 'var(--color-error)',
};

export default function NotificationMenu({
  notifications,
  onDismiss,
  onMarkAllRead,
}: NotificationMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const unread = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, []);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={`Notifications${unread > 0 ? `, ${unread} unread` : ''}`}
        style={{
          position: 'relative',
          width: '2.25rem',
          height: '2.25rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid transparent',
          background: open ? 'rgba(255,255,255,0.06)' : 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: 'var(--color-faint)',
          transition: 'background 0.15s, color 0.15s, border-color 0.15s',
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget;
          el.style.background = 'rgba(255,255,255,0.06)';
          el.style.color = 'var(--color-muted)';
        }}
        onMouseLeave={(e) => {
          if (!open) {
            const el = e.currentTarget;
            el.style.background = 'transparent';
            el.style.color = 'var(--color-faint)';
          }
        }}
      >
        <Bell size={16} />
        {/* Unread badge */}
        <AnimatePresence>
          {unread > 0 && (
            <motion.span
              key="badge"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              style={{
                position: 'absolute',
                top: '4px',
                right: '4px',
                width: '16px',
                height: '16px',
                borderRadius: 'var(--radius-full)',
                background: 'var(--color-error)',
                fontSize: '9px',
                fontWeight: 700,
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                lineHeight: 1,
              }}
            >
              {unread > 9 ? '9+' : unread}
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
            role="dialog"
            aria-label="Notifications"
            style={{
              position: 'absolute',
              top: 'calc(100% + 6px)',
              right: 0,
              width: '320px',
              background: 'var(--color-card)',
              border: '1px solid var(--color-border-hover)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-lg)',
              overflow: 'hidden',
              zIndex: 'var(--z-admin-dropdown)' as unknown as number,
            }}
          >
            {/* Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1rem',
                borderBottom: '1px solid var(--color-border)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <p style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-ink)' }}>
                  Notifications
                </p>
                {unread > 0 && (
                  <span
                    style={{
                      fontSize: 'var(--text-micro)',
                      fontWeight: 700,
                      padding: '0.1rem 0.375rem',
                      borderRadius: 'var(--radius-full)',
                      background: 'var(--color-error-bg)',
                      color: 'var(--color-error)',
                    }}
                  >
                    {unread} new
                  </span>
                )}
              </div>
              {onMarkAllRead && unread > 0 && (
                <button
                  type="button"
                  onClick={onMarkAllRead}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    fontSize: 'var(--text-xs)',
                    color: 'var(--color-accent-300)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <CheckCheck size={12} />
                  Mark all read
                </button>
              )}
            </div>

            {/* Notification list */}
            <div
              className="admin-scroll-thin"
              style={{ maxHeight: '320px', overflowY: 'auto' }}
            >
              {notifications.length === 0 ? (
                <div
                  style={{
                    padding: '2rem 1rem',
                    textAlign: 'center',
                    color: 'var(--color-faint)',
                    fontSize: 'var(--text-sm)',
                  }}
                >
                  <Bell size={24} style={{ margin: '0 auto 0.5rem', opacity: 0.4 }} />
                  <p>No notifications</p>
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {notifications.map((n) => (
                    <motion.div
                      key={n.id}
                      layout
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.18 }}
                      style={{
                        display: 'flex',
                        gap: '0.75rem',
                        padding: '0.75rem 1rem',
                        borderBottom: '1px solid var(--color-border)',
                        background: n.read ? 'transparent' : 'rgba(124,77,255,0.04)',
                        position: 'relative',
                      }}
                    >
                      {/* Unread dot */}
                      {!n.read && (
                        <span
                          aria-hidden="true"
                          style={{
                            position: 'absolute',
                            left: '0.375rem',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            width: '5px',
                            height: '5px',
                            borderRadius: 'var(--radius-full)',
                            background: 'var(--color-accent-400)',
                          }}
                        />
                      )}

                      {/* Tone indicator */}
                      <span
                        aria-hidden="true"
                        style={{
                          width: '2px',
                          borderRadius: 'var(--radius-full)',
                          background: n.tone ? TONE_COLORS[n.tone] : 'var(--color-border-strong)',
                          flexShrink: 0,
                          alignSelf: 'stretch',
                        }}
                      />

                      {/* Content */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-ink)' }}>
                          {n.title}
                        </p>
                        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)', marginTop: '0.125rem', lineHeight: 1.4 }}>
                          {n.body}
                        </p>
                        <p style={{ fontSize: 'var(--text-micro)', color: 'var(--color-faint)', marginTop: '0.25rem' }}>
                          {n.time}
                        </p>
                      </div>

                      {onDismiss && (
                        <button
                          type="button"
                          onClick={() => onDismiss(n.id)}
                          aria-label={`Dismiss: ${n.title}`}
                          style={{
                            flexShrink: 0,
                            alignSelf: 'flex-start',
                            background: 'none',
                            border: 'none',
                            color: 'var(--color-faint)',
                            cursor: 'pointer',
                            padding: '0.125rem',
                            borderRadius: 'var(--radius-xs)',
                          }}
                        >
                          <X size={12} />
                        </button>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
