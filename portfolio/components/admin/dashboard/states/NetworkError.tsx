'use client';

import { useEffect, useState } from 'react';
import { WifiOff } from 'lucide-react';
import { EmptyState } from '@/components/admin/ui/EmptyState';
import { Button } from '@/components/admin/ui/Button';
import { Badge } from '@/components/admin/ui/Badge';

export interface NetworkErrorProps {
  onRetry?: () => void;
}

/** Connection-specific error state, distinct from a generic server error.
 *  Watches the real navigator.onLine / online / offline browser signals so
 *  the badge reflects actual connectivity rather than a guess. */
export function NetworkError({ onRetry }: NetworkErrorProps) {
  const [online, setOnline] = useState(true);

  useEffect(() => {
    setOnline(navigator.onLine);
    const goOnline = () => setOnline(true);
    const goOffline = () => setOnline(false);
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  return (
    <EmptyState
      icon={<WifiOff />}
      title="Connection lost"
      description={
        online
          ? "You're back online — the dashboard just hasn't reloaded yet."
          : "You're offline. Reconnect and try again."
      }
      action={
        <div className="flex flex-col items-center gap-3">
          <Badge tone={online ? 'success' : 'error'} dot>
            {online ? 'Connected' : 'Offline'}
          </Badge>
          <Button variant="secondary" onClick={onRetry} disabled={!online}>
            Retry
          </Button>
        </div>
      }
    />
  );
}
