import { eq, desc } from 'drizzle-orm';
import { db, blogs } from '@/lib/db';
import { Metadata } from 'next';
import { Clock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { getProfile } from '@/lib/content';

async function getBlogIntro() {
  const profile = await getProfile();
  return profile.blogIntro;
}

export async function generateMetadata(): Promise<Metadata> {
  return { title: 'Writing', description: (await getBlogIntro()) ?? undefined };
}

export const revalidate = 60;

async function getPublishedPosts() {
  try {
    return await db
      .select({
        id: blogs.id,
        title: blogs.title,
        slug: blogs.slug,
        excerpt: blogs.excerpt,
        tags: blogs.tags,
        read_time: blogs.read_time,
        gradient: blogs.gradient,
        created_at: blogs.created_at,
      })
      .from(blogs)
      .where(eq(blogs.published, true))
      .orderBy(desc(blogs.created_at));
  } catch (e) {
    console.error('[Blog List] Failed to load posts:', e);
    return [];
  }
}

export default async function BlogListPage() {
  const [posts, blogIntro] = await Promise.all([getPublishedPosts(), getBlogIntro()]);

  return (
    <main className="min-h-screen bg-bg text-ink">
      <div className="max-w-4xl mx-auto px-6 md:px-8 py-24">
        {/* Header */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted hover:text-ink transition-colors mb-12 group"
        >
          <ArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform" />
          Back to portfolio
        </Link>

        <div className="mb-16">
          <p className="text-xs text-accent-700 font-medium uppercase tracking-[0.2em] mb-4">Writing</p>
          <h1 className="font-serif text-4xl md:text-6xl font-medium tracking-tight text-ink leading-[1.05] mb-5">
            All <span className="text-accent-700 italic">articles</span>
          </h1>
          {blogIntro && (
            <p className="text-muted text-lg max-w-xl leading-relaxed">
              {blogIntro}
            </p>
          )}
        </div>

        {/* Articles list */}
        {posts.length > 0 && (
          <div className="border-t border-line">
            {posts.map((post) => {
              const tag = post.tags?.[0] ?? 'Article';
              const dateStr = post.created_at
                ? new Date(post.created_at).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })
                : '';

              return (
                <Link key={post.id} href={`/blog/${post.slug}`} className="group block">
                  <article className="py-8 border-b border-line">
                    <div className="flex items-center gap-3 mb-3 text-xs">
                      <span className="text-accent-700 font-medium uppercase tracking-[0.12em]">
                        {tag}
                      </span>
                      {post.read_time && (
                        <span className="flex items-center gap-1 text-faint">
                          <Clock size={11} />
                          {post.read_time}
                        </span>
                      )}
                    </div>
                    <h2 className="font-serif text-2xl md:text-3xl font-medium text-ink leading-snug mb-2 group-hover:text-accent-700 transition-colors duration-200">
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p className="text-muted leading-relaxed mb-3 max-w-2xl">
                        {post.excerpt}
                      </p>
                    )}
                    <div className="flex items-center gap-3 text-sm">
                      <span className="text-faint">{dateStr}</span>
                      <span className="text-accent-700 font-medium">Read more →</span>
                    </div>
                  </article>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
