interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  highlight?: string;
  description?: string;
  align?: "left" | "center";
  as?: "h1" | "h2";
}

/**
 * Editorial section heading: a small accent eyebrow, a serif title with an
 * optional italic-accent highlight word, and an optional lead paragraph.
 * Left-aligned by default — centering is the exception, not the rule.
 */
export function SectionHeading({
  eyebrow,
  title,
  highlight,
  description,
  align = "left",
  as = "h2",
}: SectionHeadingProps) {
  const Tag = as;
  const aligned = align === "center" ? "text-center mx-auto" : "text-left";

  return (
    <div className={`${aligned} max-w-2xl`}>
      {eyebrow && (
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent-400 mb-4">
          {eyebrow}
        </p>
      )}
      <Tag className="font-normal tracking-tight text-ink text-[length:var(--text-h2)] leading-[1.1]">
        {title}
        {highlight && (
          <>
            {" "}
            <span className="font-semibold text-accent-400">{highlight}</span>
          </>
        )}
      </Tag>
      {description && (
        <p className="mt-4 text-muted text-[length:var(--text-lead)] leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
