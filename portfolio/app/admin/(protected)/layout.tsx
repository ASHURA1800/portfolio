import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { getAdminUser } from '@/lib/auth/session';
import { ownerExists } from '@/lib/auth/owner';
import { SidebarProvider } from '../_components/nav/SidebarContext';
import { NavigationProvider } from '../_components/nav/NavigationContext';
import AdminSidebar from '../_components/nav/AdminSidebar';
import TopNavbar from '../_components/nav/TopNavbar';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const configured = await ownerExists();
  if (!configured) redirect('/setup');

  const user = await getAdminUser();
  if (!user) redirect('/admin/login');

  return (
    <NavigationProvider>
      <SidebarProvider>
        <div
          className="admin-shell"
          style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}
        >
          <AdminSidebar userEmail={user.email} />
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              minWidth: 0,
            }}
          >
            <TopNavbar userEmail={user.email} />
            <main
              id="main-content"
              className="admin-page admin-scroll-thin"
              style={{ flex: 1, overflowY: 'auto' }}
            >
              {children}
            </main>
          </div>
        </div>
      </SidebarProvider>
    </NavigationProvider>
  );
}
