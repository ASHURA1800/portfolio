import { NextRequest } from 'next/server';
import { eq } from 'drizzle-orm';
import { db, skills } from '@/lib/db';
import { skillSchema, isUUID } from '@/lib/validation/schemas';
import { ok, err, validationError } from '@/lib/services/response';
import { requireAdmin, isAuthError } from '@/lib/auth/session';

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  if (!isUUID(id)) return err('Skill not found', 404);

  try {
    const [data] = await db.select().from(skills).where(eq(skills.id, id)).limit(1);
    if (!data) return err('Skill not found', 404);
    return ok(data);
  } catch {
    return err('Failed to fetch skill', 500);
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const auth = await requireAdmin();
  if (isAuthError(auth)) return auth;

  const { id } = await params;
  if (!isUUID(id)) return err('Skill not found', 404);

  let body: unknown;
  try { body = await req.json(); } catch { return err('Invalid JSON'); }

  const parsed = skillSchema.partial().safeParse(body);
  if (!parsed.success) return validationError(parsed.error);

  try {
    const [data] = await db
      .update(skills)
      .set({ ...parsed.data, updated_at: new Date() })
      .where(eq(skills.id, id))
      .returning();
    if (!data) return err('Skill not found', 404);
    return ok(data, 'Skill updated');
  } catch (e) {
    console.error('[Skills] Update failed:', e);
    return err('Update failed', 500);
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const auth = await requireAdmin();
  if (isAuthError(auth)) return auth;

  const { id } = await params;
  if (!isUUID(id)) return err('Skill not found', 404);

  try {
    const [deleted] = await db
      .delete(skills)
      .where(eq(skills.id, id))
      .returning({ id: skills.id });
    if (!deleted) return err('Skill not found', 404);
    return ok(null, 'Skill deleted');
  } catch (e) {
    console.error('[Skills] Delete failed:', e);
    return err('Delete failed', 500);
  }
}
