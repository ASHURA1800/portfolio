import { NextRequest } from 'next/server';
import { and, or, eq, ilike, asc, desc } from 'drizzle-orm';
import { db, projects } from '@/lib/db';
import { projectSchema, paginationSchema } from '@/lib/validation/schemas';
import { ok, err, created, validationError } from '@/lib/services/response';
import { requireAdmin, isAuthError } from '@/lib/auth/session';

// ── GET /api/projects — public list with optional pagination & featured filter ─
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const params = paginationSchema.safeParse(Object.fromEntries(url.searchParams));
  const { page, limit, search, order } = params.success
    ? params.data
    : { page: 1, limit: 20, search: undefined, order: 'desc' as const };

  const featured = url.searchParams.get('featured');
  const from = (page - 1) * limit;

  const conditions = [];
  if (featured === 'true') conditions.push(eq(projects.featured, true));
  if (search) {
    conditions.push(
      or(
        ilike(projects.title, `%${search}%`),
        ilike(projects.description, `%${search}%`),
        ilike(projects.category, `%${search}%`)
      )
    );
  }
  const where = conditions.length ? and(...conditions) : undefined;

  try {
    const items = await db
      .select()
      .from(projects)
      .where(where)
      .orderBy(
        asc(projects.order_index),
        order === 'asc' ? asc(projects.created_at) : desc(projects.created_at)
      )
      .limit(limit)
      .offset(from);

    const total = await db.$count(projects, where);

    return ok({
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch {
    return err('Failed to fetch projects', 500);
  }
}

// ── POST /api/projects — admin create ─────────────────────────────────────────
export async function POST(req: NextRequest) {
  const auth = await requireAdmin();
  if (isAuthError(auth)) return auth;

  let body: unknown;
  try { body = await req.json(); } catch { return err('Invalid JSON'); }

  const parsed = projectSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);

  try {
    const [data] = await db.insert(projects).values(parsed.data).returning();
    return created(data, 'Project created');
  } catch (e) {
    console.error('[Projects] Create failed:', e);
    return err('Failed to create project', 500);
  }
}
