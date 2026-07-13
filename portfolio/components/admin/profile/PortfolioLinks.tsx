import { ExternalLink } from 'lucide-react';

const PAGES = [
  { path: '/', label: 'Homepage' },
  { path: '/about', label: 'About' },
  { path: '/contact', label: 'Contact' },
] as const;

/** Quick links to the real public pages this profile data feeds — same
 *  SITE_URL pattern layout.tsx uses for metadataBase. No new data, just
 *  navigation. */
export function PortfolioLinks() {
  return (
    <div className="flex flex-wrap gap-2">
      {PAGES.map((p) => (
        <a
          key={p.path}
          href={p.path}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-xs text-[var(--color-muted)] hover:text-[var(--color-ink)] hover:border-[var(--color-border-hover)] transition-colors"
        >
          {p.label}
          <ExternalLink size={11} />
        </a>
      ))}
    </div>
  );
}
