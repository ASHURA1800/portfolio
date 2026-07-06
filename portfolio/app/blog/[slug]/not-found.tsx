import Link from 'next/link';
import { ArrowLeft, FileQuestion } from 'lucide-react';

export default function BlogNotFound() {
  return (
    <main className="min-h-screen bg-bg text-ink flex items-center justify-center px-6">
      <div className="text-center">
        <FileQuestion size={56} className="mx-auto mb-6 text-faint" />
        <h1 className="text-3xl font-medium text-ink mb-3">Article not found</h1>
        <p className="text-muted mb-8">
          This article doesn&apos;t exist or hasn&apos;t been published yet.
        </p>
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-line hover:border-accent-300 text-ink text-sm font-medium transition-colors duration-200"
        >
          <ArrowLeft size={16} />
          Back to articles
        </Link>
      </div>
    </main>
  );
}
