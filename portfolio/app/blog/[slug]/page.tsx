import { and, eq } from "drizzle-orm";
import { db, blogs } from "@/lib/db";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, Tag } from "lucide-react";
import Link from "next/link";
import DOMPurify from "isomorphic-dompurify";
import { getProfile } from "@/lib/content";

// Revalidate every 60 seconds (ISR) instead of force-dynamic.
// Published posts change infrequently; admins see live content via the API.
export const revalidate = 60;

// Pre-render all published slugs at build time; on-demand ISR handles new ones.
export async function generateStaticParams() {
  try {
    const slugs = await db
      .select({ slug: blogs.slug })
      .from(blogs)
      .where(eq(blogs.published, true));
    return slugs.map((s) => ({ slug: s.slug }));
  } catch {
    // Build succeeds even when DATABASE_URL is absent during CI
    return [];
  }
}

// Dynamic SEO metadata
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const [data] = await db
      .select({
        title: blogs.title,
        excerpt: blogs.excerpt,
        tags: blogs.tags,
        thumbnail: blogs.thumbnail,
        created_at: blogs.created_at,
      })
      .from(blogs)
      .where(and(eq(blogs.slug, slug), eq(blogs.published, true)))
      .limit(1);

    if (!data) return { title: "Article Not Found" };

    return {
      title: data.title,
      description: data.excerpt ?? "",
      keywords: data.tags,
      openGraph: {
        title: data.title,
        description: data.excerpt ?? "",
        type: "article",
        publishedTime: data.created_at ? new Date(data.created_at).toISOString() : undefined,
        tags: data.tags ?? undefined,
        ...(data.thumbnail ? { images: [{ url: data.thumbnail }] } : {}),
      },
      twitter: {
        card: "summary_large_image",
        title: data.title,
        description: data.excerpt ?? "",
        ...(data.thumbnail ? { images: [data.thumbnail] } : {}),
      },
    };
  } catch {
    return { title: "Article Not Found" };
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [post] = await db
    .select()
    .from(blogs)
    .where(and(eq(blogs.slug, slug), eq(blogs.published, true)))
    .limit(1);

  if (!post) notFound();

  const profile = await getProfile();
  const article = post;
  const dateStr = article.created_at
    ? new Date(article.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <main id="main-content" className="min-h-screen bg-bg text-ink">
      <div className="max-w-3xl mx-auto px-6 md:px-8 py-24">
        {/* Back nav */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-muted hover:text-ink transition-colors mb-12 group"
        >
          <ArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform" />
          All articles
        </Link>

        {/* Header */}
        <header className="mb-10">
          <div className="flex flex-wrap items-center gap-3 mb-6 text-xs">
            {article.tags?.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 text-accent-400 font-medium uppercase tracking-[0.12em]"
              >
                <Tag size={10} />
                {tag}
              </span>
            ))}
            {article.read_time && (
              <span className="flex items-center gap-1 text-faint">
                <Clock size={11} />
                {article.read_time}
              </span>
            )}
          </div>

          <h1 className="text-4xl md:text-5xl font-medium text-ink leading-[1.1] tracking-tight mb-5">
            {article.title}
          </h1>

          {article.excerpt && (
            <p className="text-xl text-muted leading-relaxed mb-8">{article.excerpt}</p>
          )}

          {(() => {
            const author = profile.name || profile.username;
            return (
              <div className="flex items-center gap-3 pt-6 border-t border-border">
                {author && (
                  <div className="w-9 h-9 rounded-full bg-accent-500 flex items-center justify-center text-white font-medium text-sm">
                    {author.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  {author && <div className="text-sm font-medium text-ink">{author}</div>}
                  {dateStr && <div className="text-xs text-faint">{dateStr}</div>}
                </div>
              </div>
            );
          })()}
        </header>

        {/* Content */}
        {article.content && (
          <div
            className="prose-light"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(article.content) }}
          />
        )}

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-border">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-accent-400 hover:text-accent-300 transition-colors group"
          >
            <ArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform" />
            Back to all articles
          </Link>
        </div>
      </div>
    </main>
  );
}
