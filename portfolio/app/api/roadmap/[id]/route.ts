import { NextRequest } from 'next/server';
import { eq } from 'drizzle-orm';
import { db, roadmap } from '@/lib/db';
import { roadmapSchema, isUUID } from '@/lib/validation/schemas';
import { ok, err, validationError } from '@/lib/services/response';
import { requireAdmin, isAuthError } from '@/lib/auth/session';

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  if (!isUUID(id)) return err('Roadmap item not found', 404);

  try {
    const [data] = await db.select().from(roadmap).where(eq(roadmap.id, id)).limit(1);
    if (!data) return err('Roadmap item not found', 404);
    return ok(data);
  } catch {
    return err('Failed to fetch roadmap item', 500);
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const auth = await requireAdmin();
  if (isAuthError(auth)) return auth;

  const { id } = await params;
  if (!isUUID(id)) return err('Roadmap item not found', 404);

  let body: unknown;
  try { body = await req.json(); } catch { return err('Invalid JSON'); }

  const parsed = roadmapSchema.partial().safeParse(body);
  if (!parsed.success) return validationError(parsed.error);

  try {
    const [data] = await db
      .update(roadmap)
      .set({ ...parsed.data, updated_at: new Date() })
      .where(eq(roadmap.id, id))
      .returning();
    if (!data) return err('Roadmap item not found', 404);
    return ok(data, 'Roadmap item updated');
  } catch (e) {
    console.error('[Roadmap] Update failed:', e);
    return err('Update failed', 500);
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const auth = await requireAdmin();
  if (isAuthError(auth)) return auth;

  const { id } = await params;
  if (!isUUID(id)) return err('Roadmap item not found', 404);

  try {
    const [deleted] = await db
      .delete(roadmap)
      .where(eq(roadmap.id, id))
      .returning({ id: roadmap.id });
    if (!deleted) return err('Roadmap item not found', 404);
    return ok(null, 'Roadmap item deleted');
  } catch (e) {
    console.error('[Roadmap] Delete failed:', e);
    return err('Delete failed', 500);
  }
}
