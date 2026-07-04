import { NextRequest } from 'next/server';
import { asc, desc } from 'drizzle-orm';
import { db, testimonials } from '@/lib/db';
import { testimonialSchema, paginationSchema } from '@/lib/validation/schemas';
import { ok, err, created, validationError } from '@/lib/services/response';
import { requireAdmin, isAuthError } from '@/lib/auth/session';

// ── GET /api/testimonials — public ───────────────────────────────────────────
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const params = paginationSchema.safeParse(Object.fromEntries(url.searchParams));
  const { page, limit } = params.success
    ? params.data
    : { page: 1, limit: 20 };

  const from = (page - 1) * limit;

  try {
    const items = await db
      .select()
      .from(testimonials)
      .orderBy(asc(testimonials.order_index), desc(testimonials.created_at))
      .limit(limit)
      .offset(from);

    const total = await db.$count(testimonials);

    return ok({
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch {
    return err('Failed to fetch testimonials', 500);
  }
}

// ── POST /api/testimonials — admin create ─────────────────────────────────────
export async function POST(req: NextRequest) {
  const auth = await requireAdmin();
  if (isAuthError(auth)) return auth;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return err('Invalid JSON');
  }

  const parsed = testimonialSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);

  try {
    const [data] = await db.insert(testimonials).values(parsed.data).returning();
    return created(data, 'Testimonial created');
  } catch (e) {
    console.error('[Testimonials] Create failed:', e);
    return err('Failed to create testimonial', 500);
  }
}
