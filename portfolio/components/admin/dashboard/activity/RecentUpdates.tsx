import type { ActivityEvent } from '@/lib/analytics/activity';
import ActivityTimeline from './ActivityTimeline';

interface RecentUpdatesProps {
  events: ActivityEvent[];
}

/**
 * RecentUpdates
 * Titled panel surface. Thin wrapper around ActivityTimeline that adds
 * the section header + scroll container — keeps the timeline itself
 * composable and re-usable without the chrome.
 */
export default function RecentUpdates({ events }: RecentUpdatesProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: 0,
      }}
    >
      {/* Panel header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1rem',
          flexShrink: 0,
        }}
      >
        <div>
          <h3
            style={{
              fontSize: 'var(--text-sm)',
              fontWeight: 600,
              color: 'var(--color-ink)',
              letterSpacing: 'var(--tracking-tight)',
              lineHeight: 1,
              marginBottom: '0.1875rem',
            }}
          >
            Recent updates
          </h3>
          <p
            style={{
              fontSize: 'var(--text-xs)',
              color: 'var(--color-faint)',
              lineHeight: 1,
            }}
          >
            {events.length > 0
              ? `${events.length} item${events.length === 1 ? '' : 's'} changed`
              : 'No activity yet'}
          </p>
        </div>

        {/* Live indicator */}
        {events.length > 0 && (
          <span
            aria-hidden="true"
            style={{
              fontSize: '0.625rem',
              fontWeight: 600,
              letterSpacing: 'var(--tracking-wider)',
              textTransform: 'uppercase',
              color: 'var(--color-faint)',
              padding: '0.1875rem 0.4375rem',
              borderRadius: 'var(--radius-full)',
              border: '1px solid rgba(255,255,255,0.07)',
              background: 'rgba(255,255,255,0.03)',
            }}
          >
            Latest
          </span>
        )}
      </div>

      {/* Scrollable feed */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          /* Fade-out at bottom when content overflows */
          maskImage:
            events.length > 6
              ? 'linear-gradient(to bottom, black 80%, transparent 100%)'
              : undefined,
          WebkitMaskImage:
            events.length > 6
              ? 'linear-gradient(to bottom, black 80%, transparent 100%)'
              : undefined,
        }}
      >
        <ActivityTimeline events={events} />
      </div>
    </div>
  );
}
