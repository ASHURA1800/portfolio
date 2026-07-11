'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, FolderPlus, UserRoundPlus, Blocks, Zap } from 'lucide-react';

const ACTIONS = [
  { label: 'New project',    href: '/admin/projects',       icon: FolderPlus },
  { label: 'New build log',  href: '/admin/buildlog',       icon: Blocks },
  { label: 'Edit profile',   href: '/admin/profile',        icon: UserRoundPlus },
];

/**
 * QuickActions
 * A ⚡ button that fans out a small menu of "New …" shortcuts.
 */
export default function QuickActions() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Quick actions"
        title="Quick actions"
        style={{
          width: '2.25rem',
          height: '2.25rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid transparent',
          background: open ? 'rgba(124,77,255,0.12)' : 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: open ? 'var(--color-accent-300)' : 'var(--color-faint)',
          transition: 'background 0.15s, color 0.15s',
        }}
        onMouseEnter={(e) => {
          if (!open) {
            const el = e.currentTarget;
            el.style.background = 'rgba(255,255,255,0.06)';
            el.style.color = 'var(--color-muted)';
          }
        }}
        onMouseLeave={(e) => {
          if (!open) {
            const el = e.currentTarget;
            el.style.background = 'transparent';
            el.style.color = 'var(--color-faint)';
          }
        }}
      >
        <motion.div animate={{ rotate: open ? 45 : 0 }} transition={{ duration: 0.18 }}>
          <Plus size={16} />
        </motion.div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.96 }}
            transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
            role="menu"
            aria-label="Quick actions"
            style={{
              position: 'absolute',
              top: 'calc(100% + 6px)',
              right: 0,
              minWidth: '176px',
              background: 'var(--color-card)',
              border: '1px solid var(--color-border-hover)',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-lg)',
              overflow: 'hidden',
              zIndex: 'var(--z-admin-dropdown)' as unknown as number,
            }}
          >
            <p
              style={{
                fontSize: 'var(--text-micro)',
                fontWeight: 700,
                letterSpacing: 'var(--tracking-widest)',
                textTransform: 'uppercase',
                color: 'var(--color-faint)',
                padding: '0.5rem 0.875rem 0.25rem',
              }}
            >
              Quick add
            </p>

            {ACTIONS.map(({ label, href, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                role="menuitem"
                onClick={() => setOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.625rem',
                  padding: '0.5rem 0.875rem',
                  fontSize: 'var(--text-sm)',
                  color: 'var(--color-muted)',
                  textDecoration: 'none',
                  transition: 'background 0.12s, color 0.12s',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.background = 'rgba(255,255,255,0.04)';
                  el.style.color = 'var(--color-ink)';
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.background = 'transparent';
                  el.style.color = 'var(--color-muted)';
                }}
              >
                <Icon size={14} style={{ color: 'var(--color-faint)', flexShrink: 0 }} />
                {label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
