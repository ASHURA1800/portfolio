import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { ownerExists } from '@/lib/auth/owner';
import { getProfile } from '@/lib/content';
import { LoginLayout, LoginHero, LoginCard, LoginForm, LoginBranding, LoginFooter } from '@/components/admin/auth/login';

// Force dynamic — checks live DB state on every visit.
export const dynamic = 'force-dynamic';

export default async function AdminLoginPage() {
  // No owner configured → first-run setup hasn't been done yet
  const configured = await ownerExists();
  if (!configured) redirect('/setup');

  // Real profile data for the branding panel (name/title) — same source
  // the rest of the site uses, with the same built-in fallback on failure.
  const profile = await getProfile();

  return (
    <LoginLayout
      hero={
        <LoginHero>
          <LoginBranding name={profile.name} title={profile.title} />
        </LoginHero>
      }
    >
      <Suspense
        fallback={
          <div className="w-full max-w-sm h-96 rounded-[var(--radius-lg)] border border-[var(--color-border)] animate-pulse bg-[var(--color-card)]" />
        }
      >
        <LoginCard>
          <LoginForm />
        </LoginCard>
        <LoginFooter />
      </Suspense>
    </LoginLayout>
  );
}
