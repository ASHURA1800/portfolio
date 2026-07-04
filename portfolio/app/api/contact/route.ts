import { NextRequest } from 'next/server';
import { desc } from 'drizzle-orm';
import { db, contacts } from '@/lib/db';
import { contactSchema } from '@/lib/validation/schemas';
import { rateLimit, getIP } from '@/lib/validation/rate-limit';
import { sendContactNotification, sendContactAcknowledgement } from '@/lib/services/email';
import { ok, err, validationError, rateLimitError } from '@/lib/services/response';
import { requireAdmin, isAuthError } from '@/lib/auth/session';

export async function POST(req: NextRequest) {
  // ── Rate limit: 5 submissions per 15 minutes per IP ───────
  const ip = getIP(req);
  const rl = rateLimit({ key: `contact:${ip}`, limit: 5, windowMs: 15 * 60 * 1000 });
  if (!rl.allowed) return rateLimitError(rl.resetAt);

  // ── Parse body ────────────────────────────────────────────
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return err('Invalid JSON body');
  }

  // ── Validate ──────────────────────────────────────────────
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);

  const { website, ...data } = parsed.data;

  // ── Honeypot check ────────────────────────────────────────
  if (website) return err('Bot detected', 400);

  // ── Persist ───────────────────────────────────────────────
  let contact: { id: string };
  try {
    const [row] = await db
      .insert(contacts)
      .values({
        ...data,
        ip_address: ip,
        user_agent: req.headers.get('user-agent') ?? undefined,
      })
      .returning({ id: contacts.id });
    contact = row;
  } catch (dbError) {
    console.error('[Contact] DB error:', dbError);
    return err('Failed to save message. Please try again.', 500);
  }

  // ── Emails ────────────────────────────────────────────────
  // Awaited so Vercel doesn't freeze the function before emails are sent.
  // Both sends are parallelized; individual errors are caught and logged
  // so one failure never prevents the other from being attempted.
  await Promise.all([
    sendContactNotification(data).catch((e) =>
      console.error('[Contact] Notification email failed:', e)
    ),
    sendContactAcknowledgement({ name: data.name, email: data.email }).catch((e) =>
      console.error('[Contact] Acknowledgement email failed:', e)
    ),
  ]);

  return ok({ id: contact.id }, 'Message sent successfully!', 201);
}

export async function GET(req: NextRequest) {
  // Admin-only: list all contacts
  const auth = await requireAdmin();
  if (isAuthError(auth)) return auth;

  const url = new URL(req.url);
  const page = Math.max(1, Number(url.searchParams.get('page') ?? 1));
  const limit = Math.min(50, Math.max(1, Number(url.searchParams.get('limit') ?? 20)));
  const from = (page - 1) * limit;

  try {
    const items = await db
      .select()
      .from(contacts)
      .orderBy(desc(contacts.created_at))
      .limit(limit)
      .offset(from);

    const total = await db.$count(contacts);

    return ok({
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch {
    return err('Failed to fetch contacts', 500);
  }
}
