import { NextRequest } from 'next/server';
import { eq } from 'drizzle-orm';
import { db, profile } from '@/lib/db';
import { profileSchema } from '@/lib/validation/schemas';
import { ok, err, validationError } from '@/lib/services/response';
import { requireAdmin, isAuthError } from '@/lib/auth/session';

// Profile is a single-row resource: GET returns the sole row (public),
// PATCH upserts it (admin). No collection / [id] routes.

// ── GET /api/profile — public ────────────────────────────────────────────────
export async function GET() {
  try {
    const [data] = await db.select().from(profile).limit(1);
    // Return the row or null — the frontend applies empty-string defaults.
    return ok(data ?? null);
  } catch {
    return err('Failed to fetch profile', 500);
  }
}

// ── PATCH /api/profile — admin upsert ────────────────────────────────────────
export async function PATCH(req: NextRequest) {
  const auth = await requireAdmin();
  if (isAuthError(auth)) return auth;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return err('Invalid JSON');
  }

  const parsed = profileSchema.partial().safeParse(body);
  if (!parsed.success) return validationError(parsed.error);

  try {
    const [existing] = await db.select({ id: profile.id }).from(profile).limit(1);

    if (existing) {
      const [data] = await db
        .update(profile)
        .set({ ...parsed.data, updated_at: new Date() })
        .where(eq(profile.id, existing.id))
        .returning();
      return ok(data, 'Profile updated');
    }

    const [data] = await db
      .insert(profile)
      .values({ ...parsed.data, singleton: 1 })
      .returning();
    return ok(data, 'Profile created');
  } catch (e) {
    console.error('[Profile] Update failed:', e);
    return err('Update failed', 500);
  }
}
