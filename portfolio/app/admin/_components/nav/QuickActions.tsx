'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { Plus } from 'lucide-react';
import { getQuickActionRoutes } from '@/lib/admin/route-helpers';

// Quick-add shortcuts are derived from any route in NavigationConfig that
// declares a `quickAction` — not a separate hardcoded list. Adding a
// `quickAction` to a route in navigation.config.ts is enough to surface
// it here.
const ACTION_ROUTES = getQuickActionRoutes();

/**
 * QuickActions
 * A ⚡ button that fans out a small menu of "New …" shortcuts.
 */
export default function QuickActions() {
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();
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
      <motion.button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Quick actions"
        title="Quick actions"
        whileTap={{ scale: 0.92 }}
        transition={{ duration: 0.1 }}
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
        <motion.div animate={{ rotate: open ? 45 : 0 }} transition={{ duration: reduceMotion ? 0 : 0.18 }}>
          <Plus size={16} />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.96 }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -4, scale: 0.96 }}
            transition={{ duration: reduceMotion ? 0.1 : 0.16, ease: [0.22, 1, 0.36, 1] }}
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

            {ACTION_ROUTES.map((route) => {
              const Icon = route.quickAction?.icon ?? route.icon;
              return (
                <Link
                  key={route.path}
                  href={route.path}
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
                  {route.quickAction?.label}
                </Link>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
