import { NextRequest } from 'next/server';
import { eq } from 'drizzle-orm';
import { db, blogs } from '@/lib/db';
import { blogSchema, isUUID } from '@/lib/validation/schemas';
import { ok, err, validationError } from '@/lib/services/response';
import { requireAdmin, isAuthError } from '@/lib/auth/session';

type Params = { params: Promise<{ id: string }> };

// ── GET /api/blogs/:id  (id = UUID or slug) ───────────────────────────────────
export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;

  try {
    const [data] = await db
      .select()
      .from(blogs)
      .where(isUUID(id) ? eq(blogs.id, id) : eq(blogs.slug, id))
      .limit(1);

    if (!data) return err('Blog not found', 404);

    // Unpublished drafts are admin-only. Return the same 404 to avoid leaking
    // that the draft exists at all.
    if (!data.published) {
      const auth = await requireAdmin();
      if (isAuthError(auth)) return err('Blog not found', 404);
    }

    return ok(data);
  } catch {
    return err('Failed to fetch blog', 500);
  }
}

// ── PATCH /api/blogs/:id ──────────────────────────────────────────────────────
export async function PATCH(req: NextRequest, { params }: Params) {
  const auth = await requireAdmin();
  if (isAuthError(auth)) return auth;

  const { id } = await params;
  if (!isUUID(id)) return err('Blog not found', 404);

  let body: unknown;
  try { body = await req.json(); } catch { return err('Invalid JSON'); }

  const parsed = blogSchema.partial().safeParse(body);
  if (!parsed.success) return validationError(parsed.error);

  try {
    const [data] = await db
      .update(blogs)
      .set({ ...parsed.data, updated_at: new Date() })
      .where(eq(blogs.id, id))
      .returning();

    if (!data) return err('Blog not found', 404);
    return ok(data, 'Blog updated');
  } catch (e) {
    if ((e as { code?: string }).code === '23505') {
      return err('A blog with this slug already exists', 409);
    }
    console.error('[Blogs] Update failed:', e);
    return err('Update failed', 500);
  }
}

// ── DELETE /api/blogs/:id ─────────────────────────────────────────────────────
export async function DELETE(_req: NextRequest, { params }: Params) {
  const auth = await requireAdmin();
  if (isAuthError(auth)) return auth;

  const { id } = await params;
  if (!isUUID(id)) return err('Blog not found', 404);

  try {
    const [deleted] = await db
      .delete(blogs)
      .where(eq(blogs.id, id))
      .returning({ id: blogs.id });

    if (!deleted) return err('Blog not found', 404);
    return ok(null, 'Blog deleted');
  } catch (e) {
    console.error('[Blogs] Delete failed:', e);
    return err('Delete failed', 500);
  }
}
