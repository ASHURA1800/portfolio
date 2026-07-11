'use client';

import {
  useState, useEffect, useRef, useCallback, useId,
  type KeyboardEvent,
} from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search, LayoutDashboard, User, FolderOpen, Wrench,
  Briefcase, Award, Blocks, BookOpen, Map, KeyRound, X,
  ArrowUpRight,
} from 'lucide-react';

interface CmdItem {
  id: string;
  label: string;
  group: string;
  href: string;
  icon: React.ElementType;
  keywords?: string[];
  shortcut?: string;
}

const ALL_ITEMS: CmdItem[] = [
  { id: 'dash',  label: 'Dashboard',       group: 'Pages', href: '/admin',                icon: LayoutDashboard, keywords: ['home','overview'] },
  { id: 'prof',  label: 'Profile',          group: 'Pages', href: '/admin/profile',        icon: User,            keywords: ['bio','about'] },
  { id: 'proj',  label: 'Projects',         group: 'Pages', href: '/admin/projects',       icon: FolderOpen,      keywords: ['work','portfolio'] },
  { id: 'skill', label: 'Skills',           group: 'Pages', href: '/admin/skills',         icon: Wrench,          keywords: ['tech','stack'] },
  { id: 'exp',   label: 'Experience',       group: 'Pages', href: '/admin/experience',     icon: Briefcase,       keywords: ['jobs','work','career'] },
  { id: 'cert',  label: 'Certifications',   group: 'Pages', href: '/admin/certifications', icon: Award,           keywords: ['certs','courses'] },
  { id: 'blog',  label: 'Build Log',        group: 'Pages', href: '/admin/buildlog',       icon: Blocks,          keywords: ['log','notes'] },
  { id: 'learn', label: 'Learnings',        group: 'Pages', href: '/admin/learnings',      icon: BookOpen,        keywords: ['reading','notes'] },
  { id: 'road',  label: 'Roadmap',          group: 'Pages', href: '/admin/roadmap',        icon: Map,             keywords: ['plan','todo'] },
  { id: 'cpw',   label: 'Change Password',  group: 'Settings', href: '/admin/change-password', icon: KeyRound,   keywords: ['security','password'] },
];

/**
 * CommandPalette
 * Global Cmd+K (Mac) / Ctrl+K (Win/Linux) search modal.
 * Fuzzy matches against label + keywords. Arrow keys navigate. Enter navigates.
 */
export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const listId = useId();

  const filtered = query
    ? ALL_ITEMS.filter((item) => {
        const q = query.toLowerCase();
        return (
          item.label.toLowerCase().includes(q) ||
          item.keywords?.some((k) => k.includes(q))
        );
      })
    : ALL_ITEMS;

  // Group filtered results
  const groups = filtered.reduce<Record<string, CmdItem[]>>((acc, item) => {
    if (!acc[item.group]) acc[item.group] = [];
    acc[item.group].push(item);
    return acc;
  }, {});

  const flatList = Object.values(groups).flat();

  const close = useCallback(() => {
    setOpen(false);
    setQuery('');
    setCursor(0);
  }, []);

  const navigate = useCallback(
    (href: string) => {
      close();
      router.push(href);
    },
    [close, router]
  );

  // Global keyboard shortcut
  useEffect(() => {
    const handler = (e: globalThis.KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') { close(); return; }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setCursor((c) => Math.min(c + 1, flatList.length - 1));
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setCursor((c) => Math.max(c - 1, 0));
    }
    if (e.key === 'Enter' && flatList[cursor]) {
      navigate(flatList[cursor].href);
    }
  };

  return (
    <>
      {/* Trigger button (shown in TopNavbar) */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open command palette (⌘K)"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.375rem 0.75rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--color-border)',
          background: 'rgba(255,255,255,0.03)',
          color: 'var(--color-faint)',
          fontSize: 'var(--text-xs)',
          cursor: 'pointer',
          transition: 'border-color 0.15s, background 0.15s',
          width: '100%',
          maxWidth: '220px',
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget;
          el.style.borderColor = 'var(--color-border-hover)';
          el.style.background = 'rgba(255,255,255,0.05)';
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget;
          el.style.borderColor = 'var(--color-border)';
          el.style.background = 'rgba(255,255,255,0.03)';
        }}
      >
        <Search size={13} />
        <span style={{ flex: 1, textAlign: 'left' }}>Search…</span>
        <kbd
          style={{
            fontSize: '10px',
            padding: '1px 5px',
            borderRadius: '4px',
            border: '1px solid var(--color-border)',
            background: 'rgba(255,255,255,0.04)',
            color: 'var(--color-disabled)',
            fontFamily: 'inherit',
          }}
        >
          ⌘K
        </kbd>
      </button>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="admin-modal-backdrop"
              onClick={close}
              aria-hidden="true"
            />

            {/* Palette */}
            <div
              className="admin-modal"
              style={{
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 'min(560px, 92vw)',
                padding: 0,
                overflow: 'hidden',
              }}
            >
              <motion.div
                key="palette"
                initial={{ opacity: 0, scale: 0.96, y: -8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: -6 }}
                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* Search input */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.875rem 1rem',
                    borderBottom: '1px solid var(--color-border)',
                  }}
                >
                  <Search size={16} style={{ color: 'var(--color-faint)', flexShrink: 0 }} />
                  <input
                    ref={inputRef}
                    type="text"
                    role="combobox"
                    aria-expanded={true}
                    aria-controls={listId}
                    aria-autocomplete="list"
                    value={query}
                    onChange={(e) => { setQuery(e.target.value); setCursor(0); }}
                    onKeyDown={handleKeyDown}
                    placeholder="Search pages, settings…"
                    style={{
                      flex: 1,
                      background: 'none',
                      border: 'none',
                      outline: 'none',
                      color: 'var(--color-ink)',
                      fontSize: 'var(--text-body)',
                      fontFamily: 'inherit',
                    }}
                  />
                  <button
                    type="button"
                    onClick={close}
                    aria-label="Close"
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: 'var(--color-faint)',
                      padding: 0,
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <X size={15} />
                  </button>
                </div>

                {/* Results */}
                <div
                  id={listId}
                  role="listbox"
                  className="admin-scroll-thin"
                  style={{ maxHeight: '360px', overflowY: 'auto', padding: '0.375rem' }}
                >
                  {flatList.length === 0 ? (
                    <p
                      style={{
                        padding: '1.5rem',
                        textAlign: 'center',
                        fontSize: 'var(--text-sm)',
                        color: 'var(--color-faint)',
                      }}
                    >
                      No results for "{query}"
                    </p>
                  ) : (
                    Object.entries(groups).map(([group, items]) => (
                      <div key={group}>
                        <p
                          style={{
                            fontSize: 'var(--text-micro)',
                            fontWeight: 700,
                            letterSpacing: 'var(--tracking-widest)',
                            textTransform: 'uppercase',
                            color: 'var(--color-faint)',
                            padding: '0.5rem 0.625rem 0.25rem',
                          }}
                        >
                          {group}
                        </p>
                        {items.map((item) => {
                          const idx = flatList.indexOf(item);
                          const active = idx === cursor;
                          return (
                            <button
                              key={item.id}
                              type="button"
                              role="option"
                              aria-selected={active}
                              onClick={() => navigate(item.href)}
                              onMouseEnter={() => setCursor(idx)}
                              style={{
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                padding: '0.5rem 0.625rem',
                                borderRadius: 'var(--radius-md)',
                                border: 'none',
                                background: active
                                  ? 'rgba(124,77,255,0.12)'
                                  : 'transparent',
                                cursor: 'pointer',
                                textAlign: 'left',
                                color: active ? 'var(--color-accent-200)' : 'var(--color-muted)',
                                fontSize: 'var(--text-sm)',
                                transition: 'background 0.1s',
                              }}
                            >
                              <item.icon
                                size={15}
                                style={{ color: active ? 'var(--color-accent-400)' : 'var(--color-faint)', flexShrink: 0 }}
                              />
                              <span style={{ flex: 1 }}>{item.label}</span>
                              {active && (
                                <ArrowUpRight size={13} style={{ color: 'var(--color-accent-400)', flexShrink: 0 }} />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    ))
                  )}
                </div>

                {/* Footer hint */}
                <div
                  style={{
                    display: 'flex',
                    gap: '1rem',
                    padding: '0.5rem 1rem',
                    borderTop: '1px solid var(--color-border)',
                  }}
                >
                  {[['↑↓', 'navigate'], ['↵', 'open'], ['Esc', 'close']].map(([key, label]) => (
                    <span
                      key={key}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: 'var(--text-micro)', color: 'var(--color-faint)' }}
                    >
                      <kbd
                        style={{
                          padding: '1px 4px',
                          borderRadius: '3px',
                          border: '1px solid var(--color-border)',
                          background: 'rgba(255,255,255,0.04)',
                          fontFamily: 'inherit',
                        }}
                      >
                        {key}
                      </kbd>
                      {label}
                    </span>
                  ))}
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
