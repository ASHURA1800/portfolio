interface TimelineItemProps {
  company: string;
  role: string;
  dateRange: string; // precomputed via formatDateRange()
  location?: string;
  type?: string;
  description?: string;
  impact?: string[];
  techStack?: string[];
  isLast?: boolean;
}

/**
 * One row of a minimal vertical timeline: a neutral connector line, a small
 * static node, and an impact-focused entry. No gradients, no glow, no animation.
 * Order: date range → company → role → type/location → description → impact → stack.
 */
export function TimelineItem({
  company,
  role,
  dateRange,
  location,
  type,
  description,
  impact,
  techStack,
  isLast = false,
}: TimelineItemProps) {
  return (
    <div className="relative pb-12 pl-8 last:pb-0">
      {/* Neutral connector */}
      {!isLast && (
        <span
          className="absolute bottom-0 left-[5px] top-2 w-px bg-line"
          aria-hidden="true"
        />
      )}
      {/* Static node */}
      <span
        className="absolute left-0 top-1.5 h-[11px] w-[11px] rounded-full border-2 border-accent-600 bg-bg"
        aria-hidden="true"
      />

      <div className="text-xs uppercase tracking-[0.16em] text-faint">
        {dateRange}
      </div>
      <h3 className="mt-1.5 text-lg font-medium text-ink">{company}</h3>
      <div className="text-muted">{role}</div>

      {(type || location) && (
        <div className="mt-0.5 flex flex-wrap items-center gap-x-2 text-sm text-faint">
          {type && <span className="capitalize">{type}</span>}
          {type && location && <span className="text-line">·</span>}
          {location && <span>{location}</span>}
        </div>
      )}

      {description && (
        <p className="mt-3 max-w-[65ch] leading-relaxed text-muted">{description}</p>
      )}

      {impact && impact.length > 0 && (
        <ul className="mt-3 space-y-1.5">
          {impact.map((it, i) => (
            <li
              key={i}
              className="flex max-w-[65ch] gap-2.5 leading-relaxed text-muted"
            >
              <span className="mt-2 h-1 w-1 flex-none rounded-full bg-accent-400" />
              <span>{it}</span>
            </li>
          ))}
        </ul>
      )}

      {techStack && techStack.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {techStack.map((t) => (
            <span
              key={t}
              className="rounded-md border border-line px-2.5 py-1 text-xs text-muted"
            >
              {t}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
