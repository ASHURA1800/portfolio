import { ROUTES, SEGMENT_LABELS, type RouteConfig } from './navigation.config';

/**
 * ROUTE HELPERS — pure derivation functions over NavigationConfig.
 * Nothing here holds state or reads the DOM; every function takes a
 * pathname and returns data. This is what makes "no hardcoded page
 * titles" enforceable: PageTitle, Breadcrumb, and the sidebar all call
 * into this file rather than each computing their own answer.
 */

/** Finds the RouteConfig whose `path` matches exactly, if any. */
export function findRouteConfig(pathname: string): RouteConfig | undefined {
  return ROUTES.find((r) => r.path === pathname);
}

/**
 * Finds the RouteConfig that "owns" the current pathname for the purpose
 * of active-nav-highlighting and page-title resolution — the deepest
 * matching route, so `/admin/projects/123/edit` still resolves to the
 * Projects route even though only `/admin/projects` is registered.
 */
export function matchRouteConfig(pathname: string): RouteConfig | undefined {
  const exact = findRouteConfig(pathname);
  if (exact) return exact;

  // Fall back to the longest registered path that's a prefix of pathname,
  // excluding the dashboard root itself (which would match everything).
  const candidates = ROUTES.filter(
    (r) => r.path !== '/admin' && (pathname === r.path || pathname.startsWith(r.path + '/'))
  );
  if (candidates.length === 0) return undefined;
  return candidates.reduce((longest, r) => (r.path.length > longest.path.length ? r : longest));
}

/**
 * Active-nav detection for sidebar items. Mirrors the matching rule
 * SidebarItem used to implement inline (exact-or-prefix), now centralized
 * so any future nav surface (mobile tab bar, command palette "current
 * page" indicator) uses the identical rule instead of reimplementing it.
 */
export function isRouteActive(itemPath: string, pathname: string, exact = false): boolean {
  if (exact) return pathname === itemPath;
  return pathname === itemPath || pathname.startsWith(itemPath + '/');
}

/** Groups all sidebar-eligible routes by their NavGroupId, preserving ROUTES order within each group. */
export function getGroupedNavRoutes(): Record<string, RouteConfig[]> {
  const grouped: Record<string, RouteConfig[]> = {};
  for (const route of ROUTES) {
    if (!route.group) continue;
    (grouped[route.group] ??= []).push(route);
  }
  return grouped;
}

/** All routes that declared a `quickAction` — feeds the QuickActions menu and command palette. */
export function getQuickActionRoutes(): RouteConfig[] {
  return ROUTES.filter((r) => r.quickAction);
}

export interface SearchableRoute {
  path: string;
  label: string;
  group: string;
  icon: RouteConfig['icon'];
  keywords: string[];
}

/**
 * Flattens NavigationConfig into the shape the command palette (SearchBar)
 * needs: every route that should be findable, with a resolved search
 * group ('Settings' for routes that set `searchGroup`, otherwise 'Pages'
 * for any route with a sidebar `group`) and its keyword list.
 */
export function getSearchableRoutes(): SearchableRoute[] {
  return ROUTES.filter((r) => r.group || r.searchGroup).map((r) => ({
    path: r.path,
    label: r.label,
    group: r.searchGroup ?? 'Pages',
    icon: r.icon,
    keywords: r.keywords ?? [],
  }));
}

export interface Breadcrumb {
  label: string;
  href: string;
  isLast: boolean;
}

/**
 * BREADCRUMB GENERATOR — builds the crumb trail for a pathname purely
 * from NavigationConfig + SEGMENT_LABELS. A segment that matches a
 * registered route uses that route's label (so renaming a page in
 * NavigationConfig automatically renames its breadcrumb); a segment that
 * doesn't (dynamic ids, 'new', 'edit') falls back to SEGMENT_LABELS, then
 * to a capitalized version of the raw segment as a last resort.
 */
export function generateBreadcrumbs(pathname: string): Breadcrumb[] {
  const segments = pathname.split('/').filter(Boolean);

  return segments.map((segment, i) => {
    const href = '/' + segments.slice(0, i + 1).join('/');
    const route = findRouteConfig(href);
    const label = route?.label ?? SEGMENT_LABELS[segment] ?? capitalize(segment);
    return { label, href, isLast: i === segments.length - 1 };
  });
}

function capitalize(segment: string): string {
  // Dynamic ids (uuids, numeric ids) aren't meaningful capitalized labels —
  // render them verbatim rather than mangling them.
  if (/^[0-9a-f-]{8,}$/i.test(segment) || /^\d+$/.test(segment)) return segment;
  return segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
}

/**
 * PAGE METADATA — resolves the title + description for the current route,
 * for PageTitle and (optionally) document.title. Falls back to the
 * breadcrumb's last label if no RouteConfig matches, so an unregistered
 * or dynamic route still gets a reasonable heading instead of nothing.
 */
export interface PageMetadata {
  title: string;
  description?: string;
  icon?: RouteConfig['icon'];
}

export function getPageMetadata(pathname: string): PageMetadata {
  const route = matchRouteConfig(pathname);
  if (route) {
    return { title: route.label, description: route.description, icon: route.icon };
  }
  const crumbs = generateBreadcrumbs(pathname);
  const last = crumbs[crumbs.length - 1];
  return { title: last?.label ?? 'Admin' };
}
