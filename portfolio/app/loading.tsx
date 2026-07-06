// Skeleton that mirrors the homepage's above-the-fold layout (nav + hero) so
// the transition into real content has no layout shift or spinner flash.
export default function RootLoading() {
  return (
    <div className="min-h-screen bg-bg" aria-busy="true" aria-label="Loading">
      {/* Nav bar */}
      <div className="h-16 border-b border-line px-[var(--space-gutter)]">
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between">
          <div className="skeleton h-5 w-28 rounded-md" />
          <div className="hidden gap-7 md:flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="skeleton h-4 w-16 rounded-md" />
            ))}
          </div>
          <div className="skeleton h-8 w-8 rounded-lg md:hidden" />
        </div>
      </div>

      {/* Hero */}
      <div className="flex min-h-[88vh] items-center px-[var(--space-gutter)] py-24">
        <div className="mx-auto w-full max-w-6xl">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:gap-16">
            <div className="max-w-[62ch] flex-1 space-y-6">
              <div className="skeleton h-16 w-3/4 rounded-lg" />
              <div className="skeleton h-6 w-1/2 rounded-md" />
              <div className="space-y-3">
                <div className="skeleton h-4 w-full rounded-md" />
                <div className="skeleton h-4 w-5/6 rounded-md" />
              </div>
              <div className="flex gap-3 pt-4">
                <div className="skeleton h-11 w-36 rounded-lg" />
                <div className="skeleton h-11 w-32 rounded-lg" />
              </div>
            </div>
            <div className="skeleton h-52 w-52 rounded-2xl lg:h-64 lg:w-64" />
          </div>
        </div>
      </div>
    </div>
  );
}
