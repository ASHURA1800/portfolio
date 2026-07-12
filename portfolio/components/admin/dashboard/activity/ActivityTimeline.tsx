import type { ActivityEvent } from '@/lib/analytics/activity';
import ActivityCard from './ActivityCard';
import ActivityEmptyState from './ActivityEmptyState';

interface ActivityTimelineProps {
  events: ActivityEvent[];
}

/**
 * ActivityTimeline
 * RSC shell — receives pre-fetched events from the dashboard page and
 * renders them as a vertical timeline. Delegates animation to ActivityCard
 * (client component). Shows ActivityEmptyState when empty.
 */
export default function ActivityTimeline({ events }: ActivityTimelineProps) {
  if (events.length === 0) {
    return <ActivityEmptyState />;
  }

  return (
    <div role="feed" aria-label="Recent activity">
      {events.map((event, i) => (
        <ActivityCard
          key={event.id}
          {...event}
          showLine={i < events.length - 1}
          index={i}
        />
      ))}
    </div>
  );
}
