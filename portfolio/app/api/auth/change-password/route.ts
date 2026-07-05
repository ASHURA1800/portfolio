import { NextRequest } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { requireAdmin, isAuthError } from '@/lib/auth/session';
import { getOwnerByEmail, updateOwnerPassword } from '@/lib/auth/owner';
import { rateLimit, getIP } from '@/lib/validation/rate-limit';
import { ok, err, rateLimitError } from '@/lib/services/response';

const schema = z
  .object({
    currentPassword: z.string().min(1).max(512),
    newPassword: z.string().min(8, 'New password must be at least 8 characters').max(512),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export async function POST(req: NextRequest) {
  const auth = await requireAdmin();
  if (isAuthError(auth)) return auth;

  // Rate limit: 5 attempts per 15 minutes per IP
  const ip = getIP(req);
  const rl = rateLimit({ key: `change-password:${ip}`, limit: 5, windowMs: 15 * 60 * 1000 });
  if (!rl.allowed) return rateLimitError(rl.resetAt);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return err('Invalid JSON', 400);
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return err(first?.message ?? 'Validation failed', 400);
  }

  const { currentPassword, newPassword } = parsed.data;

  const owner = await getOwnerByEmail(auth.user.email);
  if (!owner) return err('Account not found', 404);

  const matches = await bcrypt.compare(currentPassword, owner.password_hash);
  if (!matches) return err('Current password is incorrect', 401);

  const password_hash = await bcrypt.hash(newPassword, 12);

  try {
    await updateOwnerPassword(owner.id, password_hash);
  } catch {
    return err('Failed to update password. Please try again.', 500);
  }

  return ok(null, 'Password changed successfully.');
}
