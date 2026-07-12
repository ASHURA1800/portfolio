import Link from 'next/link';
import { cn } from '@/lib/utils';

export interface AuthFooterLink {
  href: string;
  label: string;
}

export interface AuthFooterProps {
  /** Left-aligned link, e.g. "← Back to site" or "Back to login". Omit to hide. */
  start?: AuthFooterLink;
  /** Right-aligned static label or link, e.g. "Portfolio Admin". */
  end?: ReactNodeOrString;
  className?: string;
}

type ReactNodeOrString = string | AuthFooterLink;

function isLink(v: ReactNodeOrString): v is AuthFooterLink {
  return typeof v === 'object' && v !== null && 'href' in v;
}

/** Static footer row under an auth card — back-link on the left, a label
 *  or secondary link on the right. Generalized from the login footer so
 *  reset/forgot/change-password can reuse the same row. */
export function AuthFooter({ start, end, className }: AuthFooterProps) {
  if (!start && !end) return null;

  return (
    <div className={cn('flex items-center justify-between text-xs text-[var(--color-faint)] mt-6 px-1', className)}>
      {start ? (
        <Link href={start.href} className="hover:text-[var(--color-muted)] transition-colors">
          {start.label}
        </Link>
      ) : (
        <span />
      )}
      {end ? (
        isLink(end) ? (
          <Link href={end.href} className="hover:text-[var(--color-muted)] transition-colors">
            {end.label}
          </Link>
        ) : (
          <span>{end}</span>
        )
      ) : null}
    </div>
  );
}
