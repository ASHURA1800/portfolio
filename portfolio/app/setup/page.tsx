import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { ownerExists } from '@/lib/auth/owner';
import { getSession } from '@/lib/auth/session';
import { SetupForm } from './SetupForm';

export const metadata: Metadata = {
  title: 'Portfolio Setup',
  robots: { index: false, follow: false },
};

// Force dynamic — this page checks live DB state on every request.
export const dynamic = 'force-dynamic';

export default async function SetupPage() {
  // Already authenticated → go straight to admin
  const session = await getSession();
  if (session) redirect('/admin');

  // Owner exists → setup is done; go to login
  const configured = await ownerExists();
  if (configured) redirect('/admin/login');

  return <SetupForm />;
}
