import { NextRequest } from "next/server";
import { gte, desc } from "drizzle-orm";
import { db, analytics } from "@/lib/db";
import { analyticsSchema } from "@/lib/validation/schemas";
import { rateLimit, getIP } from "@/lib/validation/rate-limit";
import { ok, err, validationError, rateLimitError } from "@/lib/services/response";
import { requireAdmin, isAuthError } from "@/lib/auth/session";

// Simple in-memory dedup: tracks (ip+eventType) → last seen timestamp.
// Prevents the same client from spamming identical events within 2 seconds.
const recentEvents = new Map<string, number>();
const DEDUP_WINDOW_MS = 2_000;

function isDuplicate(ip: string, eventType: string): boolean {
  const key = `${ip}:${eventType}`;
  const now = Date.now();
  const last = recentEvents.get(key);
  if (last && now - last < DEDUP_WINDOW_MS) return true;
  recentEvents.set(key, now);
  // Prevent unbounded growth — sweep when map is large
  if (recentEvents.size > 5_000) {
    const stale = now - DEDUP_WINDOW_MS * 10;
    for (const [k, t] of recentEvents) {
      if (t < stale) recentEvents.delete(k);
    }
  }
  return false;
}

// POST /api/analytics — track an event (public, rate-limited + deduped)
export async function POST(req: NextRequest) {
  const ip = getIP(req);

  // 30 events/min per IP (down from 60 — tighter anti-spam for production)
  const rl = rateLimit({ key: `analytics:${ip}`, limit: 30, windowMs: 60_000 });
  if (!rl.allowed) return rateLimitError(rl.resetAt);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return err("Invalid JSON");
  }

  const parsed = analyticsSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);

  // Silently discard duplicate events from the same IP within the dedup window
  if (isDuplicate(ip, parsed.data.event_type)) {
    return ok(null, "Event tracked");
  }

  try {
    await db.insert(analytics).values({
      event_type: parsed.data.event_type,
      metadata: parsed.data.metadata,
      ip_address: ip,
      user_agent: req.headers.get("user-agent") ?? undefined,
      referrer: req.headers.get("referer") ?? parsed.data.referrer,
    });
  } catch (e) {
    console.error("[Analytics] Insert error:", e);
    // Silently succeed — analytics must never break user experience
  }

  return ok(null, "Event tracked");
}

// GET /api/analytics — admin dashboard stats
export async function GET(req: NextRequest) {
  const auth = await requireAdmin();
  if (isAuthError(auth)) return auth;

  const url = new URL(req.url);
  const days = Math.min(365, Math.max(1, Number(url.searchParams.get("days") ?? 30)));
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const [events, recent] = await Promise.all([
    db
      .select({ event_type: analytics.event_type, created_at: analytics.created_at })
      .from(analytics)
      .where(gte(analytics.created_at, since)),
    db.select().from(analytics).orderBy(desc(analytics.created_at)).limit(20),
  ]);

  const eventCounts: Record<string, number> = {};
  for (const row of events) {
    eventCounts[row.event_type] = (eventCounts[row.event_type] ?? 0) + 1;
  }

  const dailyMap: Record<string, number> = {};
  for (const row of events) {
    // Neon over HTTP returns timestamp columns as strings, not Date objects.
    // Wrap in new Date() to handle both string and Date shapes defensively.
    const day = new Date(row.created_at).toISOString().slice(0, 10);
    dailyMap[day] = (dailyMap[day] ?? 0) + 1;
  }
  const daily = Object.entries(dailyMap)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return ok({
    period: { days, since: since.toISOString() },
    total: events.length,
    byType: eventCounts,
    daily,
    recent,
  });
}
