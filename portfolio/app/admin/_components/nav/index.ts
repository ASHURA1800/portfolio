// Context + hook
export { SidebarProvider, useSidebar } from './SidebarContext';

// Sidebar building blocks
export { SidebarGroup, SidebarItem, SidebarCollapse } from './SidebarParts';
export { default as SidebarFooter } from './SidebarFooter';
export { default as AdminSidebar } from './AdminSidebar';

// Top chrome
export { default as TopNavbar } from './TopNavbar';
export { default as Breadcrumb } from './Breadcrumb';
export { default as ProfileDropdown } from './ProfileDropdown';
export { default as NotificationMenu } from './NotificationMenu';
export type { Notification } from './NotificationMenu';
export { default as CommandPalette } from './CommandPalette';
export { default as QuickActions } from './QuickActions';
