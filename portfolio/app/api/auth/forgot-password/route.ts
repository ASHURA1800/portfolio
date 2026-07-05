import { NextRequest } from 'next/server';
import { z } from 'zod';
import { getOwnerByEmail } from '@/lib/auth/owner';
import { createResetToken } from '@/lib/auth/password-reset';
import { sendPasswordResetEmail } from '@/lib/email/mailer';
import { rateLimit, getIP } from '@/lib/validation/rate-limit';
import { ok, err, rateLimitError } from '@/lib/services/response';

const schema = z.object({
  email: z.string().email(),
});

export async function POST(req: NextRequest) {
  // Rate limit: 3 requests per 15 minutes per IP
  const ip = getIP(req);
  const rl = rateLimit({ key: `forgot-password:${ip}`, limit: 3, windowMs: 15 * 60 * 1000 });
  if (!rl.allowed) return rateLimitError(rl.resetAt);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return err('Invalid JSON', 400);
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) return err('Invalid email address', 400);

  const { email } = parsed.data;

  // Look up owner but always return the same response to prevent email enumeration
  const owner = await getOwnerByEmail(email);
  if (owner) {
    try {
      const rawToken = await createResetToken(owner.id);
      const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/$/, '');
      const resetUrl = `${siteUrl}/admin/reset-password?token=${rawToken}`;
      await sendPasswordResetEmail(owner.email, resetUrl);
    } catch (e) {
      console.error('[forgot-password] Failed to send reset email:', e instanceof Error ? e.message : e);
    }
  }

  return ok(null, 'If that email is registered, a reset link has been sent.');
}
