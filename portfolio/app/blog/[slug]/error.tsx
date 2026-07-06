"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function BlogPostError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Blog Post Error]", error);
  }, [error]);

  return (
    <main className="min-h-screen bg-bg flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <h1 className="text-2xl font-medium text-ink mb-2">Failed to load article</h1>
        <p className="text-muted text-sm mb-6">
          There was a problem loading this post. Please try again.
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="px-5 py-2.5 rounded-lg bg-accent-600 hover:bg-accent-700 text-white text-sm font-medium transition-colors"
          >
            Try again
          </button>
          <Link
            href="/blog"
            className="px-5 py-2.5 rounded-lg border border-line text-muted text-sm hover:text-ink transition-colors"
          >
            All articles
          </Link>
        </div>
      </div>
    </main>
  );
}
