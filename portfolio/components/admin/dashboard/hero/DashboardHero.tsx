import { Suspense } from 'react';
import HeroBackground from './HeroBackground';
import WelcomeBanner from './WelcomeBanner';
import CurrentDateTime from './CurrentDateTime';
import WorkspaceStatus from './WorkspaceStatus';
import ProfileCompletion from './ProfileCompletion';

interface CompletionItem {
  key: string;
  label: string;
  done: boolean;
}

interface DashboardHeroProps {
  /** Admin display name from profile */
  name: string;
  /** Admin job title from profile */
  title: string;
  /** Pre-computed completion items passed from server component */
  completionItems: CompletionItem[];
}

/**
 * DashboardHero
 * Premium welcome hero for the admin dashboard.
 *
 * This is a React Server Component shell — it receives pre-fetched data
 * from the page server component (name, title, completion) and passes it
 * to lightweight client sub-components. No new data fetching happens here.
 *
 * Layout:
 *   Left column: WelcomeBanner (greeting + name + title)
 *                CurrentDateTime (live clock)
 *                WorkspaceStatus (active pill)
 *   Right column: ProfileCompletion (radial ring)
 */
export default function DashboardHero({
  name,
  title,
  completionItems,
}: DashboardHeroProps) {
  return (
    <div
      className="dashboard-hero"
      style={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid rgba(255,255,255,0.07)',
        background: 'var(--color-bg-elevated)',
        padding: 'clamp(1.5rem, 4vw, 2.5rem)',
        marginBottom: 'var(--admin-space-section)',
        /* Subtle inner top shimmer */
        boxShadow:
          'inset 0 1px 0 rgba(255,255,255,0.05), 0 1px 3px rgba(0,0,0,0.4)',
        isolation: 'isolate',
      }}
    >
      {/* Animated background — client component, non-blocking */}
      <Suspense fallback={null}>
        <HeroBackground />
      </Suspense>

      {/* Content row — positioned above background */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 'clamp(1rem, 4vw, 2rem)',
          flexWrap: 'wrap',
        }}
      >
        {/* Left: greeting + clock + status */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            minWidth: 0,
            flex: '1 1 280px',
          }}
        >
          <WelcomeBanner name={name} title={title} />

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.625rem',
            }}
          >
            <CurrentDateTime />
            <WorkspaceStatus />
          </div>
        </div>

        {/* Right: completion ring — shrink to fit on small screens */}
        <div
          style={{
            flexShrink: 0,
            flex: '0 1 auto',
            alignSelf: 'center',
          }}
        >
          <ProfileCompletion items={completionItems} />
        </div>
      </div>
    </div>
  );
}
