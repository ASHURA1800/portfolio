import { NextRequest } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { validateResetToken, consumeResetToken } from '@/lib/auth/password-reset';
import { updateOwnerPassword } from '@/lib/auth/owner';
import { rateLimit, getIP } from '@/lib/validation/rate-limit';
import { ok, err, rateLimitError } from '@/lib/services/response';

const schema = z
  .object({
    token: z.string().min(1),
    password: z.string().min(8, 'Password must be at least 8 characters').max(512),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export async function POST(req: NextRequest) {
  // Rate limit: 5 attempts per 15 minutes per IP
  const ip = getIP(req);
  const rl = rateLimit({ key: `reset-password:${ip}`, limit: 5, windowMs: 15 * 60 * 1000 });
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

  const { token, password } = parsed.data;

  const tokenOwner = await validateResetToken(token);
  if (!tokenOwner) {
    return err('This reset link is invalid or has expired.', 400);
  }

  const password_hash = await bcrypt.hash(password, 12);

  try {
    await updateOwnerPassword(tokenOwner.ownerId, password_hash);
    await consumeResetToken(tokenOwner.tokenId);
  } catch {
    return err('Failed to reset password. Please try again.', 500);
  }

  return ok(null, 'Password reset successfully. You can now log in with your new password.');
}
