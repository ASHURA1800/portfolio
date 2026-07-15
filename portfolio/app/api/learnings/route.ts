import { NextRequest } from 'next/server';
import { eq } from 'drizzle-orm';
import { db, learnings } from '@/lib/db';
import { learningSchema, isUUID } from '@/lib/validation/schemas';
import { ok, err, validationError } from '@/lib/services/response';
import { requireAdmin, isAuthError } from '@/lib/auth/session';

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  if (!isUUID(id)) return err('Learning not found', 404);

  try {
    const [data] = await db.select().from(learnings).where(eq(learnings.id, id)).limit(1);
    if (!data) return err('Learning not found', 404);
    return ok(data);
  } catch {
    return err('Failed to fetch learning', 500);
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const auth = await requireAdmin();
  if (isAuthError(auth)) return auth;

  const { id } = await params;
  if (!isUUID(id)) return err('Learning not found', 404);

  let body: unknown;
  try { body = await req.json(); } catch { return err('Invalid JSON'); }

  const parsed = learningSchema.partial().safeParse(body);
  if (!parsed.success) return validationError(parsed.error);

  try {
    const [data] = await db
      .update(learnings)
      .set({ ...parsed.data, updated_at: new Date() })
      .where(eq(learnings.id, id))
      .returning();
    if (!data) return err('Learning not found', 404);
    return ok(data, 'Learning updated');
  } catch (e) {
    console.error('[Learnings] Update failed:', e);
    return err('Update failed', 500);
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const auth = await requireAdmin();
  if (isAuthError(auth)) return auth;

  const { id } = await params;
  if (!isUUID(id)) return err('Learning not found', 404);

  try {
    const [deleted] = await db
      .delete(learnings)
      .where(eq(learnings.id, id))
      .returning({ id: learnings.id });
    if (!deleted) return err('Learning not found', 404);
    return ok(null, 'Learning deleted');
  } catch (e) {
    console.error('[Learnings] Delete failed:', e);
    return err('Delete failed', 500);
  }
}
