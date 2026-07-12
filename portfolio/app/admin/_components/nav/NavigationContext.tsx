'use client';

import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import type { RouteConfig } from '@/lib/admin/navigation.config';
import {
  matchRouteConfig,
  generateBreadcrumbs,
  getPageMetadata,
  type Breadcrumb,
  type PageMetadata,
} from '@/lib/admin/route-helpers';

interface NavigationContextValue {
  pathname: string;
  /** The RouteConfig that owns the current pathname, if registered. */
  route: RouteConfig | undefined;
  breadcrumbs: Breadcrumb[];
  metadata: PageMetadata;
}

const NavigationContext = createContext<NavigationContextValue | null>(null);

/**
 * NAVIGATION CONTEXT — resolves the current pathname against
 * NavigationConfig exactly once per route change, then hands the result
 * to every consumer via useNavigation(). Without this, PageTitle,
 * Breadcrumbs, and the sidebar would each call usePathname() +
 * matchRouteConfig() independently — harmless correctness-wise, but it
 * means route-matching logic runs 3+ times per render for no reason.
 * Centralizing it here also gives future consumers (e.g. a mobile tab
 * bar, an analytics pageview hook) one place to read "what page is this."
 */
export function NavigationProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const value = useMemo<NavigationContextValue>(() => {
    return {
      pathname,
      route: matchRouteConfig(pathname),
      breadcrumbs: generateBreadcrumbs(pathname),
      metadata: getPageMetadata(pathname),
    };
  }, [pathname]);

  return <NavigationContext.Provider value={value}>{children}</NavigationContext.Provider>;
}

export function useNavigation(): NavigationContextValue {
  const ctx = useContext(NavigationContext);
  if (!ctx) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return ctx;
}
