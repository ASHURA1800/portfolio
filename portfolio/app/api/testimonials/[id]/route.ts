import { NextRequest } from 'next/server';
import { eq } from 'drizzle-orm';
import { db, testimonials } from '@/lib/db';
import { testimonialSchema, isUUID } from '@/lib/validation/schemas';
import { ok, err, validationError } from '@/lib/services/response';
import { requireAdmin, isAuthError } from '@/lib/auth/session';

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  if (!isUUID(id)) return err('Testimonial not found', 404);

  try {
    const [data] = await db
      .select()
      .from(testimonials)
      .where(eq(testimonials.id, id))
      .limit(1);
    if (!data) return err('Testimonial not found', 404);
    return ok(data);
  } catch {
    return err('Failed to fetch testimonial', 500);
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const auth = await requireAdmin();
  if (isAuthError(auth)) return auth;

  const { id } = await params;
  if (!isUUID(id)) return err('Testimonial not found', 404);

  let body: unknown;
  try { body = await req.json(); } catch { return err('Invalid JSON'); }

  const parsed = testimonialSchema.partial().safeParse(body);
  if (!parsed.success) return validationError(parsed.error);

  try {
    const [data] = await db
      .update(testimonials)
      .set({ ...parsed.data, updated_at: new Date() })
      .where(eq(testimonials.id, id))
      .returning();
    if (!data) return err('Testimonial not found', 404);
    return ok(data, 'Testimonial updated');
  } catch (e) {
    console.error('[Testimonials] Update failed:', e);
    return err('Update failed', 500);
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const auth = await requireAdmin();
  if (isAuthError(auth)) return auth;

  const { id } = await params;
  if (!isUUID(id)) return err('Testimonial not found', 404);

  try {
    const [deleted] = await db
      .delete(testimonials)
      .where(eq(testimonials.id, id))
      .returning({ id: testimonials.id });

    if (!deleted) return err('Testimonial not found', 404);
    return ok(null, 'Testimonial deleted');
  } catch (e) {
    console.error('[Testimonials] Delete failed:', e);
    return err('Delete failed', 500);
  }
}
