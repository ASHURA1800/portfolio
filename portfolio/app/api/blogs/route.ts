import { NextRequest } from 'next/server';
import { and, or, eq, ilike, asc, desc, arrayContains } from 'drizzle-orm';
import { db, blogs } from '@/lib/db';
import { blogSchema, paginationSchema } from '@/lib/validation/schemas';
import { ok, err, created, validationError } from '@/lib/services/response';
import { requireAdmin, isAuthError, isAdmin } from '@/lib/auth/session';

// ── GET /api/blogs ─────────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const parsedParams = paginationSchema.safeParse(Object.fromEntries(url.searchParams));
  const { page, limit, search, order } = parsedParams.success
    ? parsedParams.data
    : { page: 1, limit: 10, search: undefined, order: 'desc' as const };

  // Only admins can see unpublished posts — use isAdmin() instead of requireAdmin()
  // to avoid unnecessary JWT operations on public requests
  const isAdminRequest = await isAdmin();

  const from = (page - 1) * limit;

  const conditions = [];
  if (!isAdminRequest) conditions.push(eq(blogs.published, true));
  if (search) {
    conditions.push(
      or(
        ilike(blogs.title, `%${search}%`),
        ilike(blogs.excerpt, `%${search}%`),
        arrayContains(blogs.tags, [search])
      )
    );
  }
  const where = conditions.length ? and(...conditions) : undefined;

  try {
    const items = await db
      .select()
      .from(blogs)
      .where(where)
      .orderBy(order === 'asc' ? asc(blogs.created_at) : desc(blogs.created_at))
      .limit(limit)
      .offset(from);

    const total = await db.$count(blogs, where);

    return ok({
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch {
    return err('Failed to fetch blogs', 500);
  }
}

// ── POST /api/blogs ────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const auth = await requireAdmin();
  if (isAuthError(auth)) return auth;

  let body: unknown;
  try { body = await req.json(); } catch { return err('Invalid JSON'); }

  const parsed = blogSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);

  try {
    const [data] = await db.insert(blogs).values(parsed.data).returning();
    return created(data, 'Blog created');
  } catch (e) {
    // Postgres unique-violation on slug
    if ((e as { code?: string }).code === '23505') {
      return err('A blog with this slug already exists', 409);
    }
    console.error('[Blogs] Create failed:', e);
    return err('Failed to create blog', 500);
  }
}
