import { NextRequest } from 'next/server';
import { asc, desc } from 'drizzle-orm';
import { db, certifications } from '@/lib/db';
import { certificationSchema, paginationSchema } from '@/lib/validation/schemas';
import { ok, err, created, validationError } from '@/lib/services/response';
import { requireAdmin, isAuthError } from '@/lib/auth/session';

// ── GET /api/certifications — public ─────────────────────────────────────────
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const params = paginationSchema.safeParse(Object.fromEntries(url.searchParams));
  const { page, limit, order } = params.success
    ? params.data
    : { page: 1, limit: 20, order: 'asc' as const };

  const from = (page - 1) * limit;

  try {
    const items = await db
      .select()
      .from(certifications)
      .orderBy(
        asc(certifications.order_index),
        order === 'asc' ? asc(certifications.issued_date) : desc(certifications.issued_date)
      )
      .limit(limit)
      .offset(from);

    const total = await db.$count(certifications);

    return ok({
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch {
    return err('Failed to fetch certifications', 500);
  }
}

// ── POST /api/certifications — admin create ───────────────────────────────────
export async function POST(req: NextRequest) {
  const auth = await requireAdmin();
  if (isAuthError(auth)) return auth;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return err('Invalid JSON');
  }

  const parsed = certificationSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);

  try {
    const [data] = await db.insert(certifications).values(parsed.data).returning();
    return created(data, 'Certification created');
  } catch (e) {
    console.error('[Certifications] Create failed:', e);
    return err('Failed to create certification', 500);
  }
}
