import { NextRequest } from 'next/server';
import { eq } from 'drizzle-orm';
import { db, experience } from '@/lib/db';
import { experienceSchema, isUUID } from '@/lib/validation/schemas';
import { ok, err, validationError } from '@/lib/services/response';
import { requireAdmin, isAuthError } from '@/lib/auth/session';

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  if (!isUUID(id)) return err('Experience not found', 404);

  try {
    const [data] = await db.select().from(experience).where(eq(experience.id, id)).limit(1);
    if (!data) return err('Experience not found', 404);
    return ok(data);
  } catch {
    return err('Failed to fetch experience', 500);
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const auth = await requireAdmin();
  if (isAuthError(auth)) return auth;

  const { id } = await params;
  if (!isUUID(id)) return err('Experience not found', 404);

  let body: unknown;
  try { body = await req.json(); } catch { return err('Invalid JSON'); }

  const parsed = experienceSchema.partial().safeParse(body);
  if (!parsed.success) return validationError(parsed.error);

  try {
    const [data] = await db
      .update(experience)
      .set({ ...parsed.data, updated_at: new Date() })
      .where(eq(experience.id, id))
      .returning();
    if (!data) return err('Experience not found', 404);
    return ok(data, 'Experience updated');
  } catch (e) {
    console.error('[Experience] Update failed:', e);
    return err('Update failed', 500);
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const auth = await requireAdmin();
  if (isAuthError(auth)) return auth;

  const { id } = await params;
  if (!isUUID(id)) return err('Experience not found', 404);

  try {
    const [deleted] = await db
      .delete(experience)
      .where(eq(experience.id, id))
      .returning({ id: experience.id });
    if (!deleted) return err('Experience not found', 404);
    return ok(null, 'Experience deleted');
  } catch (e) {
    console.error('[Experience] Delete failed:', e);
    return err('Delete failed', 500);
  }
}
