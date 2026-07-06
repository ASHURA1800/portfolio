interface SkillMeterProps {
  name: string;
  proficiency: number; // 0–100
  years?: string;
  context?: string;
  icon?: string; // image path/URL or a short glyph; rendered only if present
  segments?: number;
}

// An icon may be an image (path/URL) or a short text glyph/emoji.
const isImage = (s: string) => s.startsWith("/") || s.startsWith("http");

/**
 * Segmented editorial meter — a quiet row of ticks rather than a flashy progress
 * bar. Filled segments are derived from the manual proficiency value. Shows the
 * percentage, years, and a one-line context note. An optional icon renders before
 * the name only when provided.
 */
export function SkillMeter({
  name,
  proficiency,
  years,
  context,
  icon,
  segments = 10,
}: SkillMeterProps) {
  const pct = Math.max(0, Math.min(100, proficiency));
  const filled = Math.round((pct / 100) * segments);

  return (
    <div className="py-3">
      <div className="flex items-baseline justify-between gap-3">
        <span className="flex items-center gap-2 text-[15px] text-ink">
          {icon &&
            (isImage(icon) ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={icon} alt="" className="h-4 w-4 object-contain" />
            ) : (
              <span aria-hidden="true" className="text-sm leading-none">
                {icon}
              </span>
            ))}
          {name}
        </span>
        <span className="text-xs tabular-nums text-faint">{pct}%</span>
      </div>

      <div className="mt-2 flex gap-1" aria-hidden="true">
        {Array.from({ length: segments }).map((_, i) => (
          <span
            key={i}
            className={`h-1 flex-1 rounded-full ${
              i < filled ? "bg-accent-500" : "bg-line"
            }`}
          />
        ))}
      </div>

      {(years || context) && (
        <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted">
          {years && <span>{years}</span>}
          {years && context && <span className="text-line">·</span>}
          {context && <span>{context}</span>}
        </div>
      )}
    </div>
  );
}
