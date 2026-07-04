import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { getAdminUser } from '@/lib/auth/session';
import { ownerExists } from '@/lib/auth/owner';
import AdminSidebar from '../_components/AdminSidebar';

// Admin area must never appear in search results.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // If no owner exists, first-run setup hasn't been completed.
  const configured = await ownerExists();
  if (!configured) redirect('/setup');

  // Defence-in-depth: middleware already guards this route group,
  // but we re-verify server-side in case the edge layer is bypassed.
  const user = await getAdminUser();
  if (!user) redirect('/admin/login');

  return (
    <div className="h-screen bg-gray-950 flex overflow-hidden">
      <AdminSidebar userEmail={user.email} />
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  );
}
