import Link from 'next/link';

/** Static footer links under the login card. Only links to routes
 *  confirmed to exist. */
export function LoginFooter() {
  return (
    <div className="flex items-center justify-between text-xs text-[var(--color-faint)] mt-6 px-1">
      <Link href="/" className="hover:text-[var(--color-muted)] transition-colors">
        ← Back to site
      </Link>
      <span>Portfolio Admin</span>
    </div>
  );
}
