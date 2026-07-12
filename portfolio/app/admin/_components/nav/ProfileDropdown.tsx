'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { ChevronDown, LogOut } from 'lucide-react';
import { findRouteConfig } from '@/lib/admin/route-helpers';

interface ProfileDropdownProps {
  userEmail: string;
}

// Labels/icons for these two links come from NavigationConfig — the '!'
// is safe here since both paths are always-registered routes (see
// lib/admin/navigation.config.ts); if either is ever removed from the
// config this becomes a compile-time-safe but runtime-obvious break
// rather than a silently-wrong hardcoded label.
const MENU_ITEMS = [findRouteConfig('/admin/profile')!, findRouteConfig('/admin/change-password')!].map(
  (route) => ({ href: route.path, label: route.label, icon: route.icon })
);

export default function ProfileDropdown({ userEmail }: ProfileDropdownProps) {
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const initials = userEmail.slice(0, 2).toUpperCase();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  const handleLogout = async () => {
    setOpen(false);
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="User menu"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.3rem 0.5rem 0.3rem 0.3rem',
          borderRadius: 'var(--radius-full)',
          border: '1px solid var(--color-border)',
          background: open ? 'rgba(255,255,255,0.06)' : 'transparent',
          cursor: 'pointer',
          transition: 'background 0.15s, border-color 0.15s',
        }}
        onMouseEnter={(e) => { if (!open) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.04)'; }}
        onMouseLeave={(e) => { if (!open) (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
      >
        {/* Avatar */}
        <span
          style={{
            width: '1.625rem',
            height: '1.625rem',
            borderRadius: 'var(--radius-full)',
            background: 'linear-gradient(135deg, var(--color-accent-600), var(--color-accent2-600))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 'var(--text-micro)',
            fontWeight: 700,
            color: 'white',
            flexShrink: 0,
          }}
          aria-hidden="true"
        >
          {initials}
        </span>

        {/* Email — hidden on narrow */}
        <span
          className="hidden sm:block"
          style={{
            fontSize: 'var(--text-xs)',
            color: 'var(--color-muted)',
            maxWidth: '140px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {userEmail}
        </span>

        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: reduceMotion ? 0 : 0.18 }}>
          <ChevronDown size={13} style={{ color: 'var(--color-faint)' }} />
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.97 }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: reduceMotion ? 0.1 : 0.16, ease: [0.22, 1, 0.36, 1] }}
            role="menu"
            aria-label="User menu"
            style={{
              position: 'absolute',
              top: 'calc(100% + 6px)',
              right: 0,
              minWidth: '180px',
              background: 'var(--color-card)',
              border: '1px solid var(--color-border-hover)',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-lg)',
              overflow: 'hidden',
              zIndex: 'var(--z-admin-dropdown)' as unknown as number,
            }}
          >
            {/* Email header */}
            <div
              style={{
                padding: '0.625rem 0.875rem',
                borderBottom: '1px solid var(--color-border)',
              }}
            >
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-faint)' }}>
                Signed in as
              </p>
              <p
                style={{
                  fontSize: 'var(--text-xs)',
                  fontWeight: 500,
                  color: 'var(--color-muted)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  marginTop: '0.125rem',
                }}
              >
                {userEmail}
              </p>
            </div>

            {/* Menu items */}
            {MENU_ITEMS.map(({ href, label, icon: Icon }) => (
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
                  (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.04)';
                  (e.currentTarget as HTMLAnchorElement).style.color = 'var(--color-ink)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
                  (e.currentTarget as HTMLAnchorElement).style.color = 'var(--color-muted)';
                }}
              >
                <Icon size={14} style={{ color: 'var(--color-faint)' }} />
                {label}
              </Link>
            ))}

            {/* Divider + logout */}
            <div style={{ borderTop: '1px solid var(--color-border)' }}>
              <button
                type="button"
                role="menuitem"
                onClick={handleLogout}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.625rem',
                  padding: '0.5rem 0.875rem',
                  fontSize: 'var(--text-sm)',
                  color: 'var(--color-faint)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background 0.12s, color 0.12s',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLButtonElement;
                  el.style.background = 'rgba(255,92,113,0.08)';
                  el.style.color = 'var(--color-error)';
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLButtonElement;
                  el.style.background = 'none';
                  el.style.color = 'var(--color-faint)';
                }}
              >
                <LogOut size={14} />
                Sign out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
