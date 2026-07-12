/**
 * LayoutProvider
 * Re-exports SidebarProvider as LayoutProvider so the layout folder is
 * self-contained and callers don't need to reach into /nav for context.
 * If additional layout-level context (e.g. a command palette state, or a
 * global toast queue) is added in later phases, it lives here too.
 */
export { SidebarProvider as LayoutProvider } from '../nav/SidebarContext';
