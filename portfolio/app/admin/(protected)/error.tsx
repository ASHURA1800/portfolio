"use client";

import { useEffect } from "react";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Admin Error]", error);
  }, [error]);

  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <p className="text-red-400 text-sm mb-4">
          {error.message || "An unexpected error occurred"}
        </p>
        <button
          onClick={reset}
          className="px-4 py-2 rounded-lg bg-violet-600 text-white text-sm hover:bg-violet-700 transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
