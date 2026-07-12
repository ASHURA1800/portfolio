import type { LucideIcon } from 'lucide-react';
import {
  LayoutDashboard,
  User,
  FolderOpen,
  Wrench,
  Briefcase,
  Award,
  Blocks,
  BookOpen,
  Map,
  KeyRound,
  FolderPlus,
  UserRoundPlus,
} from 'lucide-react';

/**
 * NAVIGATION CONFIG — single source of truth for the admin panel's route
 * tree. Every nav-adjacent surface (sidebar, breadcrumbs, page titles,
 * quick actions, the command palette) reads from this file instead of
 * keeping its own label/icon list. Before this file existed, the same
 * route set was duplicated three times (AdminSidebar's NAV_MAIN/
 * NAV_CONTENT/NAV_WRITING, Breadcrumb's LABELS map, QuickActions'
 * ACTIONS array) — editing a label meant remembering to touch three
 * files, and they had already started drifting from each other.
 *
 * To add a route: add one entry here. Sidebar, breadcrumbs, and page
 * title pick it up automatically — no other file needs to change.
 */

export type NavGroupId = 'main' | 'content' | 'writing';

export interface RouteConfig {
  /** Exact pathname, e.g. '/admin/projects'. Dynamic segments use ':param', e.g. '/admin/projects/:id'. */
  path: string;
  /** Sidebar + breadcrumb + page-title label. */
  label: string;
  /** Optional longer description — used as PageTitle's subtitle. */
  description?: string;
  icon: LucideIcon;
  /** Which sidebar section this route's nav item renders in. Omit for routes with no sidebar entry (login, reset-password, dynamic detail pages). */
  group?: NavGroupId;
  /** Sidebar active-state matches only this exact path, not children (dashboard root). */
  exact?: boolean;
  /** Shown in the Quick Add menu as a shortcut, with its own icon override if provided. */
  quickAction?: { label: string; icon?: LucideIcon };
  /** Excluded from breadcrumbs entirely (e.g. route groups that don't correspond to a real segment). */
  hideFromBreadcrumb?: boolean;
  /** Extra search terms for the command palette, beyond the label itself. */
  keywords?: string[];
  /** Command-palette group heading. Defaults to 'Pages' when omitted but the route has a `group`; routes without a sidebar `group` (e.g. Change Password) should set this explicitly if they should appear in the palette. */
  searchGroup?: string;
}

export const NAV_GROUPS: Record<NavGroupId, string> = {
  main: '',
  content: 'Content',
  writing: 'Writing',
};

export const ROUTES: RouteConfig[] = [
  {
    path: '/admin',
    label: 'Dashboard',
    description: 'Overview of your portfolio content and activity.',
    icon: LayoutDashboard,
    group: 'main',
    exact: true,
    keywords: ['home', 'overview'],
  },
  {
    path: '/admin/profile',
    label: 'Profile',
    description: 'Your public-facing bio, headline, and contact details.',
    icon: User,
    group: 'main',
    quickAction: { label: 'Edit profile', icon: UserRoundPlus },
    keywords: ['bio', 'about'],
  },
  {
    path: '/admin/projects',
    label: 'Projects',
    description: 'Case studies and project entries shown on your site.',
    icon: FolderOpen,
    group: 'content',
    quickAction: { label: 'New project', icon: FolderPlus },
    keywords: ['work', 'portfolio'],
  },
  {
    path: '/admin/skills',
    label: 'Skills',
    description: 'Technologies and competencies you want to highlight.',
    icon: Wrench,
    group: 'content',
    keywords: ['tech', 'stack'],
  },
  {
    path: '/admin/experience',
    label: 'Experience',
    description: 'Work history and roles.',
    icon: Briefcase,
    group: 'content',
    keywords: ['jobs', 'work', 'career'],
  },
  {
    path: '/admin/certifications',
    label: 'Certifications',
    description: 'Credentials and certificates.',
    icon: Award,
    group: 'content',
    keywords: ['certs', 'courses'],
  },
  {
    path: '/admin/buildlog',
    label: 'Build Log',
    description: 'Dev-log entries documenting work in progress.',
    icon: Blocks,
    group: 'writing',
    quickAction: { label: 'New build log', icon: Blocks },
    keywords: ['log', 'notes'],
  },
  {
    path: '/admin/learnings',
    label: 'Learnings',
    description: 'Notes and takeaways worth sharing.',
    icon: BookOpen,
    group: 'writing',
    keywords: ['reading', 'notes'],
  },
  {
    path: '/admin/roadmap',
    label: 'Roadmap',
    description: 'What you\u2019re planning to build or learn next.',
    icon: Map,
    group: 'writing',
    keywords: ['plan', 'todo'],
  },
  {
    path: '/admin/change-password',
    label: 'Change Password',
    description: 'Update your admin account credentials.',
    icon: KeyRound,
    // No `group` — intentionally not a sidebar nav item, reachable from
    // the profile menu. searchGroup makes it findable in the command
    // palette (under "Settings") without giving it a sidebar entry.
    searchGroup: 'Settings',
    keywords: ['security', 'password'],
  },
];

/** Segment-level labels for path pieces that aren't full routes in ROUTES (dynamic params, action segments). Kept minimal on purpose — real pages belong in ROUTES above, not here. */
export const SEGMENT_LABELS: Record<string, string> = {
  new: 'New',
  edit: 'Edit',
};
