import { NextRequest } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { db, ownerAccounts } from '@/lib/db';
import { ownerExists } from '@/lib/auth/owner';
import { signToken, sessionCookieOptions, SESSION_COOKIE, SESSION_MAX_AGE } from '@/lib/auth/jwt';
import { ok, err } from '@/lib/services/response';

const setupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters').max(512),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export async function POST(req: NextRequest) {
  // Reject if already configured — setup is a one-time action
  const configured = await ownerExists();
  if (configured) {
    return err('Setup already completed', 409);
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return err('Invalid JSON', 400);
  }

  const parsed = setupSchema.safeParse(body);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return err(first?.message ?? 'Validation failed', 400);
  }

  const { email, password } = parsed.data;
  const password_hash = await bcrypt.hash(password, 12);

  try {
    await db.insert(ownerAccounts).values({
      email: email.toLowerCase(),
      password_hash,
    });
  } catch {
    return err('Failed to create account. Please try again.', 500);
  }

  let token: string;
  try {
    token = await signToken({ email: email.toLowerCase() });
  } catch {
    return err('Account created but session failed. Please log in.', 500);
  }

  const res = ok({ user: { email } }, 'Account created successfully');
  res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions(SESSION_MAX_AGE));
  return res;
}
