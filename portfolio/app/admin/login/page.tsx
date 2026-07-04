import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { ownerExists } from '@/lib/auth/owner';
import { LoginForm } from './LoginForm';

// Force dynamic — checks live DB state on every visit.
export const dynamic = 'force-dynamic';

export default async function AdminLoginPage() {
  // No owner configured → first-run setup hasn't been done yet
  const configured = await ownerExists();
  if (!configured) redirect('/setup');

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-950">
          <div className="w-8 h-8 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
