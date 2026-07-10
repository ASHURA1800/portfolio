interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  highlight?: string;
  description?: string;
  align?: 'left' | 'center';
  as?: 'h1' | 'h2';
}

/**
 * Editorial heading: left-bar accent + eyebrow + large title.
 * The accent bar is the visual signature — not a decorative highlight word.
 */
export function SectionHeading({
  eyebrow,
  title,
  highlight,
  description,
  align = 'left',
  as = 'h2',
}: SectionHeadingProps) {
  const Tag = as;
  const isCentered = align === 'center';

  return (
    <div className={isCentered ? 'text-center mx-auto max-w-2xl' : 'max-w-2xl'}>
      <div className={`flex items-start gap-5 ${isCentered ? 'justify-center' : ''}`}>
        {/* Accent bar — only on left-aligned headings */}
        {!isCentered && (
          <div className="mt-1.5 h-8 w-px shrink-0 bg-accent-500" aria-hidden="true" />
        )}
        <div>
          {eyebrow && (
            <p className="mb-2 text-[0.6875rem] font-medium uppercase tracking-[0.22em] text-faint">
              {eyebrow}
            </p>
          )}
          <Tag className="font-semibold tracking-[-0.025em] text-ink text-[length:var(--text-h2)] leading-[1.05]">
            {title}
            {highlight && (
              <>
                {' '}
                <span className="text-accent-400">{highlight}</span>
              </>
            )}
          </Tag>
        </div>
      </div>
      {description && (
        <p className={`mt-4 text-muted leading-relaxed text-[length:var(--text-lead)] ${!isCentered ? 'pl-6' : ''}`}>
          {description}
        </p>
      )}
    </div>
  );
}
