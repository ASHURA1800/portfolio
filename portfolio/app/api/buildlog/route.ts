import { NextRequest } from 'next/server';
import { desc } from 'drizzle-orm';
import { db, buildLog } from '@/lib/db';
import { buildLogSchema, paginationSchema } from '@/lib/validation/schemas';
import { ok, err, created, validationError } from '@/lib/services/response';
import { requireAdmin, isAuthError } from '@/lib/auth/session';

// ── GET /api/buildlog — public (most recent first) ───────────────────────────
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const params = paginationSchema.safeParse(Object.fromEntries(url.searchParams));
  const { page, limit } = params.success ? params.data : { page: 1, limit: 100 };
  const from = (page - 1) * limit;

  try {
    const items = await db
      .select()
      .from(buildLog)
      .orderBy(desc(buildLog.date))
      .limit(limit)
      .offset(from);
    const total = await db.$count(buildLog);
    return ok({ items, total, page, limit, totalPages: Math.ceil(total / limit) });
  } catch {
    return err('Failed to fetch build log', 500);
  }
}

// ── POST /api/buildlog — admin create ────────────────────────────────────────
export async function POST(req: NextRequest) {
  const auth = await requireAdmin();
  if (isAuthError(auth)) return auth;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return err('Invalid JSON');
  }

  const parsed = buildLogSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);

  try {
    const [data] = await db.insert(buildLog).values(parsed.data).returning();
    return created(data, 'Build log entry created');
  } catch (e) {
    console.error('[BuildLog] Create failed:', e);
    return err('Failed to create build log entry', 500);
  }
}
