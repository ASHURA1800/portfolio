import { NextRequest } from 'next/server';
import { asc } from 'drizzle-orm';
import { db, roadmap } from '@/lib/db';
import { roadmapSchema, paginationSchema } from '@/lib/validation/schemas';
import { ok, err, created, validationError } from '@/lib/services/response';
import { requireAdmin, isAuthError } from '@/lib/auth/session';

// ── GET /api/roadmap — public ────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const params = paginationSchema.safeParse(Object.fromEntries(url.searchParams));
  const { page, limit } = params.success ? params.data : { page: 1, limit: 100 };
  const from = (page - 1) * limit;

  try {
    const items = await db
      .select()
      .from(roadmap)
      .orderBy(asc(roadmap.order_index))
      .limit(limit)
      .offset(from);
    const total = await db.$count(roadmap);
    return ok({ items, total, page, limit, totalPages: Math.ceil(total / limit) });
  } catch {
    return err('Failed to fetch roadmap', 500);
  }
}

// ── POST /api/roadmap — admin create ─────────────────────────────────────────
export async function POST(req: NextRequest) {
  const auth = await requireAdmin();
  if (isAuthError(auth)) return auth;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return err('Invalid JSON');
  }

  const parsed = roadmapSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);

  try {
    const [data] = await db.insert(roadmap).values(parsed.data).returning();
    return created(data, 'Roadmap item created');
  } catch (e) {
    console.error('[Roadmap] Create failed:', e);
    return err('Failed to create roadmap item', 500);
  }
}
