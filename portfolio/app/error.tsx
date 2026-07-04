"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Global Error]", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center mx-auto mb-6">
          <span className="text-2xl text-red-600">⚠</span>
        </div>
        <h1 className="font-serif text-2xl font-medium text-ink mb-2">Something went wrong</h1>
        <p className="text-muted text-sm mb-6">
          An unexpected error occurred. Please try again.
        </p>
        <button
          onClick={reset}
          className="px-6 py-2.5 rounded-lg bg-accent-600 hover:bg-accent-700 text-white text-sm font-medium transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
