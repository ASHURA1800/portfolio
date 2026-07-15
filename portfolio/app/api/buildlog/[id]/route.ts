import { NextRequest } from 'next/server';
import { eq } from 'drizzle-orm';
import { db, buildLog } from '@/lib/db';
import { buildLogSchema, isUUID } from '@/lib/validation/schemas';
import { ok, err, validationError } from '@/lib/services/response';
import { requireAdmin, isAuthError } from '@/lib/auth/session';

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  if (!isUUID(id)) return err('Build log entry not found', 404);

  try {
    const [data] = await db.select().from(buildLog).where(eq(buildLog.id, id)).limit(1);
    if (!data) return err('Build log entry not found', 404);
    return ok(data);
  } catch {
    return err('Failed to fetch build log entry', 500);
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const auth = await requireAdmin();
  if (isAuthError(auth)) return auth;

  const { id } = await params;
  if (!isUUID(id)) return err('Build log entry not found', 404);

  let body: unknown;
  try { body = await req.json(); } catch { return err('Invalid JSON'); }

  const parsed = buildLogSchema.partial().safeParse(body);
  if (!parsed.success) return validationError(parsed.error);

  try {
    const [data] = await db
      .update(buildLog)
      .set({ ...parsed.data, updated_at: new Date() })
      .where(eq(buildLog.id, id))
      .returning();
    if (!data) return err('Build log entry not found', 404);
    return ok(data, 'Build log entry updated');
  } catch (e) {
    console.error('[BuildLog] Update failed:', e);
    return err('Update failed', 500);
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const auth = await requireAdmin();
  if (isAuthError(auth)) return auth;

  const { id } = await params;
  if (!isUUID(id)) return err('Build log entry not found', 404);

  try {
    const [deleted] = await db
      .delete(buildLog)
      .where(eq(buildLog.id, id))
      .returning({ id: buildLog.id });
    if (!deleted) return err('Build log entry not found', 404);
    return ok(null, 'Build log entry deleted');
  } catch (e) {
    console.error('[BuildLog] Delete failed:', e);
    return err('Delete failed', 500);
  }
}
