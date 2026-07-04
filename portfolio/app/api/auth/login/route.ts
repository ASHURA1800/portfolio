import { NextRequest } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { signToken, sessionCookieOptions, SESSION_COOKIE, SESSION_MAX_AGE } from '@/lib/auth/jwt';
import { rateLimit, getIP } from '@/lib/validation/rate-limit';
import { ok, err, rateLimitError } from '@/lib/services/response';
import { getOwnerByEmail } from '@/lib/auth/owner';

const loginSchema = z.object({
  email: z.string().email(),
  // max(512): prevents bcrypt DoS from oversized inputs
  password: z.string().min(6).max(512),
});

export async function POST(req: NextRequest) {
  // Rate limit: 10 attempts per 15 minutes per IP
  const ip = getIP(req);
  const rl = rateLimit({ key: `login:${ip}`, limit: 10, windowMs: 15 * 60 * 1000 });
  if (!rl.allowed) return rateLimitError(rl.resetAt);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return err('Invalid JSON', 400);
  }

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) return err('Invalid email or password', 400);

  const { email, password } = parsed.data;
  let authedEmail: string | null = null;

  // Primary: DB-backed owner account
  const owner = await getOwnerByEmail(email);
  if (owner) {
    const passwordMatches = await bcrypt.compare(password, owner.password_hash);
    if (passwordMatches) authedEmail = owner.email;
  }

  // Fallback: legacy env-var credentials (backward compat during migration)
  if (!authedEmail) {
    const adminEmail = process.env.ADMIN_EMAIL;
    const passwordHash = process.env.ADMIN_PASSWORD_HASH;
    if (adminEmail && passwordHash) {
      // Always run bcrypt to prevent timing-based email enumeration
      const emailMatches = email.toLowerCase() === adminEmail.toLowerCase();
      const passwordMatches = await bcrypt.compare(password, passwordHash);
      if (emailMatches && passwordMatches) authedEmail = adminEmail;
    }
  }

  if (!authedEmail) {
    // Run a dummy bcrypt comparison to keep response time constant
    // when neither DB nor env vars matched, preventing timing attacks.
    await bcrypt.compare(password, '$2a$12$dummyhashtopreventtimingattacks00000000000000000000000');
    return err('Invalid email or password', 401);
  }

  let token: string;
  try {
    token = await signToken({ email: authedEmail });
  } catch {
    return err('Failed to create session', 500);
  }

  const res = ok({ user: { email: authedEmail } }, 'Logged in successfully');
  res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions(SESSION_MAX_AGE));
  return res;
}
