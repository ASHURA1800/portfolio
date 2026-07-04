export default function BlogPostLoading() {
  return (
    <main className="min-h-screen bg-bg text-ink">
      <div className="max-w-3xl mx-auto px-6 md:px-8 py-24">
        <div className="h-4 w-28 bg-line rounded animate-pulse mb-12" />
        <div className="mb-12 space-y-4">
          <div className="flex gap-2">
            <div className="h-5 w-16 bg-line rounded animate-pulse" />
            <div className="h-5 w-20 bg-line rounded animate-pulse" />
          </div>
          <div className="h-10 w-full bg-line rounded animate-pulse" />
          <div className="h-10 w-2/3 bg-line rounded animate-pulse" />
          <div className="h-5 w-full bg-line rounded animate-pulse" />
        </div>
        <div className="h-px bg-line mb-12" />
        <div className="space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className={`h-4 bg-line rounded animate-pulse ${i % 3 === 2 ? "w-2/3" : "w-full"}`}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
