import { NextRequest } from 'next/server';
import { and, ilike, asc, desc } from 'drizzle-orm';
import { db, learnings } from '@/lib/db';
import { learningSchema, paginationSchema } from '@/lib/validation/schemas';
import { ok, err, created, validationError } from '@/lib/services/response';
import { requireAdmin, isAuthError } from '@/lib/auth/session';

// ── GET /api/learnings — public list with optional pagination ─────────────────
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const params = paginationSchema.safeParse(Object.fromEntries(url.searchParams));
  const { page, limit, search, order } = params.success
    ? params.data
    : { page: 1, limit: 20, search: undefined, order: 'desc' as const };

  const from = (page - 1) * limit;

  const conditions = [];
  if (search) {
    conditions.push(ilike(learnings.title, `%${search}%`));
  }
  const where = conditions.length ? and(...conditions) : undefined;

  try {
    const items = await db
      .select()
      .from(learnings)
      .where(where)
      .orderBy(
        asc(learnings.order_index),
        order === 'asc' ? asc(learnings.created_at) : desc(learnings.created_at)
      )
      .limit(limit)
      .offset(from);

    const total = await db.$count(learnings, where);

    return ok({
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch {
    return err('Failed to fetch learnings', 500);
  }
}

// ── POST /api/learnings — admin create ────────────────────────────────────────
export async function POST(req: NextRequest) {
  const auth = await requireAdmin();
  if (isAuthError(auth)) return auth;

  let body: unknown;
  try { body = await req.json(); } catch { return err('Invalid JSON'); }

  const parsed = learningSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);

  try {
    const [data] = await db.insert(learnings).values(parsed.data).returning();
    return created(data, 'Learning created');
  } catch (e) {
    console.error('[Learnings] Create failed:', e);
    return err('Failed to create learning', 500);
  }
}
