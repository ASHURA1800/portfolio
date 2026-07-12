import type { ReactNode } from 'react';

export interface LoginLayoutProps {
  hero: ReactNode;
  children: ReactNode;
}

/** Split-screen shell — hero panel hidden below `lg` (handled inside
 *  LoginHero itself via `hidden lg:flex`), form panel always visible and
 *  full-width on mobile/tablet. */
export function LoginLayout({ hero, children }: LoginLayoutProps) {
  return (
    <div className="min-h-screen flex bg-[var(--color-bg)]">
      {hero}
      <div className="flex-1 flex items-center justify-center px-4 py-12 sm:px-8">
        {children}
      </div>
    </div>
  );
}
