import type { ReactNode } from "react";

interface SectionContainerProps {
  id?: string;
  width?: "narrow" | "default" | "wide";
  className?: string;
  children: ReactNode;
}

const WIDTHS: Record<NonNullable<SectionContainerProps["width"]>, string> = {
  narrow: "max-w-3xl",
  default: "max-w-5xl",
  wide: "max-w-7xl",
};

/**
 * Vertical-rhythm section wrapper. Uses the --space-section / --space-gutter
 * tokens so every section breathes on the same editorial cadence. Density is
 * varied per section by the caller via className, not baked in here.
 */
export function SectionContainer({
  id,
  width = "default",
  className = "",
  children,
}: SectionContainerProps) {
  return (
    <section
      id={id}
      className="scroll-mt-24 px-[var(--space-gutter)] py-[var(--space-section)]"
    >
      <div className={`${WIDTHS[width]} mx-auto ${className}`}>{children}</div>
    </section>
  );
}
