import Link from 'next/link';
import { Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-bg text-ink flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <Compass size={56} className="mx-auto mb-6 text-faint" />
        <h1 className="text-3xl font-medium text-ink mb-3">Page not found</h1>
        <p className="text-muted mb-8">
          The page you&apos;re looking for doesn&apos;t exist or may have moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-border hover:border-accent-300 text-ink text-sm font-medium transition-colors duration-200"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}
