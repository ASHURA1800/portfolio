'use client';

import { useCallback } from 'react';
import type { AnalyticsEventType } from '@/types';

export function useAnalytics() {
  const track = useCallback(
    (eventType: AnalyticsEventType, metadata: Record<string, unknown> = {}) => {
      // Fire-and-forget — analytics must never break UX
      fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event_type: eventType, metadata }),
      }).catch(() => {});
    },
    []
  );

  /** Track a resume download and redirect to the signed download URL */
  const trackResumeDownload = useCallback(() => {
    track('resume_download');
    // The API route handles actual download + DB tracking
    window.open('/api/resume/download', '_blank');
  }, [track]);

  return { track, trackResumeDownload };
}
