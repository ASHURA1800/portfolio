import { NextRequest } from 'next/server';
import { asc } from 'drizzle-orm';
import { db, skills } from '@/lib/db';
import { skillSchema, paginationSchema } from '@/lib/validation/schemas';
import { ok, err, created, validationError } from '@/lib/services/response';
import { requireAdmin, isAuthError } from '@/lib/auth/session';

// ── GET /api/skills — public ─────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const params = paginationSchema.safeParse(Object.fromEntries(url.searchParams));
  const { page, limit } = params.success ? params.data : { page: 1, limit: 100 };
  const from = (page - 1) * limit;

  try {
    const items = await db
      .select()
      .from(skills)
      .orderBy(asc(skills.order_index))
      .limit(limit)
      .offset(from);
    const total = await db.$count(skills);
    return ok({ items, total, page, limit, totalPages: Math.ceil(total / limit) });
  } catch {
    return err('Failed to fetch skills', 500);
  }
}

// ── POST /api/skills — admin create ──────────────────────────────────────────
export async function POST(req: NextRequest) {
  const auth = await requireAdmin();
  if (isAuthError(auth)) return auth;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return err('Invalid JSON');
  }

  const parsed = skillSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);

  try {
    const [data] = await db.insert(skills).values(parsed.data).returning();
    return created(data, 'Skill created');
  } catch (e) {
    console.error('[Skills] Create failed:', e);
    return err('Failed to create skill', 500);
  }
}
