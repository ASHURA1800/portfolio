import Link from 'next/link';

/**
 * ActivityEmptyState
 * Shown when no activity has been recorded yet — all tables are empty.
 * Reusable standalone placeholder; can also be used inside other surfaces.
 */
export default function ActivityEmptyState() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.75rem',
        padding: '2.5rem 1.5rem',
        textAlign: 'center',
      }}
    >
      {/* Icon */}
      <div
        aria-hidden="true"
        style={{
          width: '2.75rem',
          height: '2.75rem',
          borderRadius: 'var(--radius-lg)',
          background: 'rgba(124,77,255,0.08)',
          border: '1px solid rgba(124,77,255,0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.25rem',
        }}
      >
        📋
      </div>

      {/* Copy */}
      <div>
        <p
          style={{
            fontSize: 'var(--text-sm)',
            fontWeight: 600,
            color: 'var(--color-muted)',
            lineHeight: 'var(--leading-snug)',
            marginBottom: '0.25rem',
          }}
        >
          Nothing here yet
        </p>
        <p
          style={{
            fontSize: 'var(--text-xs)',
            color: 'var(--color-faint)',
            lineHeight: 'var(--leading-normal)',
            maxWidth: '18rem',
          }}
        >
          Add a project, skill, or build log — it'll show up here.
        </p>
      </div>

      {/* CTA */}
      <Link
        href="/admin/projects"
        style={{
          fontSize: 'var(--text-xs)',
          fontWeight: 600,
          color: 'var(--color-accent-400)',
          letterSpacing: 'var(--tracking-tight)',
          textDecoration: 'none',
          padding: '0.375rem 0.875rem',
          borderRadius: 'var(--radius-full)',
          border: '1px solid rgba(124,77,255,0.25)',
          background: 'rgba(124,77,255,0.06)',
          transition: 'border-color 150ms ease, background 150ms ease',
        }}
        className="hover:border-violet-500/40 hover:bg-violet-500/10"
      >
        Add first project →
      </Link>
    </div>
  );
}
