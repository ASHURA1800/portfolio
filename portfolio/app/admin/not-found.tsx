import Link from 'next/link';
import { FileQuestion } from 'lucide-react';

/** Covers /admin/* paths that don't match any route and aren't inside the
 *  authenticated (protected) group — e.g. a typo'd or stale bookmark to a
 *  pre-auth admin URL. Deliberately has no sidebar/nav chrome, since this
 *  can render for a visitor who isn't signed in. */
export default function AdminRootNotFound() {
  return (
    <div className="min-h-screen bg-bg text-ink flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <FileQuestion size={48} className="mx-auto mb-6 text-faint" />
        <h1 className="text-2xl font-medium text-ink mb-3">Page not found</h1>
        <p className="text-muted text-sm mb-8">
          This admin page doesn&apos;t exist.
        </p>
        <Link
          href="/admin/login"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-border hover:border-accent-300 text-ink text-sm font-medium transition-colors duration-200"
        >
          Go to sign in
        </Link>
      </div>
    </div>
  );
}
