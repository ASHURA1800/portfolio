"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function BlogListError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Blog List Error]", error);
  }, [error]);

  return (
    <main className="min-h-screen bg-bg flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <h1 className="font-serif text-2xl font-medium text-ink mb-2">Failed to load articles</h1>
        <p className="text-muted text-sm mb-6">
          There was a problem fetching the blog posts. Please try again.
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="px-5 py-2.5 rounded-lg bg-accent-600 hover:bg-accent-700 text-white text-sm font-medium transition-colors"
          >
            Try again
          </button>
          <Link
            href="/"
            className="px-5 py-2.5 rounded-lg border border-line text-muted text-sm hover:text-ink transition-colors"
          >
            Go home
          </Link>
        </div>
      </div>
    </main>
  );
}
