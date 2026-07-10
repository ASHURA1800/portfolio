export default function BlogListLoading() {
  return (
    <main className="min-h-screen bg-bg text-ink">
      <div className="max-w-4xl mx-auto px-6 md:px-8 py-24">
        <div className="h-4 w-32 bg-border rounded animate-pulse mb-12" />
        <div className="h-12 w-64 bg-border rounded animate-pulse mb-4" />
        <div className="h-4 w-96 bg-border rounded animate-pulse mb-14" />
        <div className="border-t border-border">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="py-8 border-b border-border space-y-3">
              <div className="h-4 w-24 bg-border rounded animate-pulse" />
              <div className="h-6 w-3/4 bg-border rounded animate-pulse" />
              <div className="h-4 w-full bg-border rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
