"use client";

import { useEffect } from "react";
import { ErrorDashboard } from "@/components/admin/dashboard/states";

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

  return <ErrorDashboard error={error} onRetry={reset} />;
}
