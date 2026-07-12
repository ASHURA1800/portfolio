'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from 'react';
import { usePathname } from 'next/navigation';

interface SidebarCtx {
  collapsed: boolean;
  mobileOpen: boolean;
  toggleCollapse: () => void;
  openMobile: () => void;
  closeMobile: () => void;
}

const Ctx = createContext<SidebarCtx | null>(null);

// Matches Tailwind's default `lg` breakpoint (1024px) — below this, the
// sidebar auto-collapses to icon-only so laptop-width viewports (a 13"
// screen at 100% zoom, a browser window that isn't maximized) don't lose
// as much content width to a full-label sidebar. Above `lg`, the user's
// manual toggle (SidebarFooter) takes over and is respected until the
// viewport crosses this line again.
const LAPTOP_COLLAPSE_BREAKPOINT = 1024;
// Matches Tailwind's `md` breakpoint — the drawer/overlay pattern only
// applies below this; at or above it the desktop/laptop sidebar renders.
const MOBILE_BREAKPOINT = 768;

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  // Tracks whether the current `collapsed` value came from the viewport
  // auto-collapse rule or from the user explicitly clicking the toggle —
  // so resizing back up to desktop width doesn't fight a collapse the
  // user chose on purpose, but does undo one the viewport chose for them.
  const userOverride = useRef(false);

  const toggleCollapse = useCallback(() => {
    userOverride.current = true;
    setCollapsed((c) => !c);
  }, []);
  const openMobile = useCallback(() => setMobileOpen(true), []);
  const closeMobile = useCallback(() => setMobileOpen(false), []);

  // Belt-and-suspenders beyond SidebarItem's onClick={closeMobile}: also
  // closes on any pathname change, so back/forward navigation and
  // programmatic router.push() calls (e.g. from CommandPalette) close the
  // drawer too, not just direct link clicks.
  const pathname = usePathname();
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onResize = () => {
      const width = window.innerWidth;

      // Crossing back to mobile width: the drawer pattern takes over,
      // so the desktop "collapsed" state is irrelevant — leave it as-is,
      // but make sure a still-open drawer doesn't linger if the window
      // is resized past tablet width while the mobile drawer is open.
      if (width >= MOBILE_BREAKPOINT) {
        setMobileOpen(false);
      }

      // Auto-collapse only kicks in below the laptop breakpoint, and only
      // if the user hasn't manually overridden it — once they've toggled
      // it themselves, resizing doesn't second-guess their choice.
      if (!userOverride.current) {
        setCollapsed(width > 0 && width < LAPTOP_COLLAPSE_BREAKPOINT && width >= MOBILE_BREAKPOINT);
      }
    };

    onResize();
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <Ctx.Provider value={{ collapsed, mobileOpen, toggleCollapse, openMobile, closeMobile }}>
      {children}
    </Ctx.Provider>
  );
}

export function useSidebar() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useSidebar must be used inside SidebarProvider');
  return ctx;
}
