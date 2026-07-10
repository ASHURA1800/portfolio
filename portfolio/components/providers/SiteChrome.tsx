'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { SmoothScrollProvider } from '@/components/providers/SmoothScrollProvider';
import { CursorFollower } from '@/components/ui/CursorFollower';
import { PageTransition } from '@/components/providers/PageTransition';

/**
 * Lenis smooth scroll, the cursor follower, and route-transition animation
 * are all public-site chrome — they'd actively fight the CMS dashboard
 * (custom cursor over data tables, Lenis intercepting scroll inside modals,
 * page-transition blur on every admin nav). Scoped out of /admin here so
 * one root layout can serve both without special-casing every admin page.
 */
export function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin) return <>{children}</>;

  return (
    <SmoothScrollProvider>
      <CursorFollower />
      <PageTransition>{children}</PageTransition>
    </SmoothScrollProvider>
  );
}
