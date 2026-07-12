import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface AuthHeaderProps {
  title: ReactNode;
  subtitle?: ReactNode;
  className?: string;
}

/** Card-top heading block — "Welcome back" / "Reset password" / etc.
 *  Same markup every auth form used inline; pulled out so copy/spacing
 *  stays consistent across routes. */
export function AuthHeader({ title, subtitle, className }: AuthHeaderProps) {
  return (
    <div className={cn(className)}>
      <h2 className="text-xl font-semibold text-[var(--color-ink)]">{title}</h2>
      {subtitle && <p className="text-sm text-[var(--color-faint)] mt-1">{subtitle}</p>}
    </div>
  );
}
