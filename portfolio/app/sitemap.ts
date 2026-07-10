import type { MetadataRoute } from 'next';
import { eq, desc } from 'drizzle-orm';
import { db, blogs } from '@/lib/db';
import { getCaseStudySlugs } from '@/lib/content';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [publishedBlogs, caseStudySlugs] = await Promise.all([
    db
      .select({ slug: blogs.slug, updated_at: blogs.updated_at })
      .from(blogs)
      .where(eq(blogs.published, true))
      .orderBy(desc(blogs.updated_at))
      .catch(() => []),
    getCaseStudySlugs().catch(() => []),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/blog`, changeFrequency: 'weekly', priority: 0.8 },
  ];

  const blogRoutes: MetadataRoute.Sitemap = publishedBlogs.map((b) => ({
    url: `${SITE_URL}/blog/${b.slug}`,
    lastModified: b.updated_at,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  const projectRoutes: MetadataRoute.Sitemap = caseStudySlugs.map((slug) => ({
    url: `${SITE_URL}/projects/${slug}`,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [...staticRoutes, ...blogRoutes, ...projectRoutes];
}
