/**
 * In-memory sliding-window rate limiter.
 *
 * Works within a single Node.js process. On Vercel each function instance is
 * independent, so counters are NOT shared across instances — this is intentional
 * for a low-traffic portfolio. Swap the store for Upstash Redis if you need
 * cross-instance coordination.
 *
 * Edge runtime compatible: uses lazy cleanup instead of setInterval (which is
 * not available in the Edge Runtime and keeps Node.js test processes alive).
 */

interface RateLimitEntry {
  timestamps: number[];
  windowMs: number;
}

const store = new Map<string, RateLimitEntry>();

// How often the lazy sweep clears stale entries (wall-clock, not a real timer)
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;
// Hard cap on tracked keys. At this size a forced sweep runs before any new key
// is inserted. The store never grows past ~2× this value in the worst case.
const MAX_STORE_SIZE = 10_000;

let lastCleanup = 0;

function cleanup(now: number): void {
  lastCleanup = now;
  for (const [key, entry] of store.entries()) {
    entry.timestamps = entry.timestamps.filter((t) => now - t < entry.windowMs);
    if (entry.timestamps.length === 0) store.delete(key);
  }
}

export interface RateLimitOptions {
  /** Key to identify the client (e.g. `"contact:1.2.3.4"`) */
  key: string;
  /** Max requests allowed in the window */
  limit: number;
  /** Window duration in milliseconds */
  windowMs: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number; // Unix timestamp ms
}

export function rateLimit({ key, limit, windowMs }: RateLimitOptions): RateLimitResult {
  const now = Date.now();

  // Lazy periodic sweep — runs at most once per CLEANUP_INTERVAL_MS.
  // Replaces setInterval: no background timer, no Edge runtime incompatibility.
  if (now - lastCleanup >= CLEANUP_INTERVAL_MS) cleanup(now);

  const windowStart = now - windowMs;

  if (!store.has(key)) {
    // Before inserting a new key, enforce the store size cap. A forced cleanup
    // frees stale entries. If the store is still full after cleanup, fail open
    // (allow the request without tracking) to preserve availability — the
    // alternative is silently blocking legitimate users during a scan attack.
    if (store.size >= MAX_STORE_SIZE) {
      cleanup(now);
      if (store.size >= MAX_STORE_SIZE) {
        return { allowed: true, remaining: 1, resetAt: now + windowMs };
      }
    }
    store.set(key, { timestamps: [], windowMs });
  }

  const entry = store.get(key)!;

  // Sync windowMs in case the caller changed it (e.g. config update).
  // The cleanup sweep uses entry.windowMs, so keeping it current matters.
  entry.windowMs = windowMs;

  // Drop timestamps outside the current window
  entry.timestamps = entry.timestamps.filter((t) => t > windowStart);

  const count = entry.timestamps.length;

  if (count >= limit) {
    // resetAt = when the oldest in-window request expires (first slot opens up)
    return {
      allowed: false,
      remaining: 0,
      resetAt: entry.timestamps[0] + windowMs,
    };
  }

  entry.timestamps.push(now);
  return {
    allowed: true,
    remaining: limit - entry.timestamps.length,
    resetAt: now + windowMs,
  };
}

/**
 * Extract the real client IP from a Next.js / Vercel request.
 *
 * Header trust order:
 *  1. x-forwarded-for — set by Vercel's edge and most reverse proxies. The
 *     leftmost value is the original client IP when Vercel is the terminating
 *     proxy (Vercel appends its own entry; it does not prepend client-supplied
 *     values verbatim).
 *  2. x-real-ip — set by nginx upstreams; not present on plain Vercel deploys.
 *
 * Neither header is forgery-proof on a self-hosted setup without an explicit
 * trusted-proxy list. For a Vercel-hosted portfolio this is sufficient.
 */
export function getIP(request: Request): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    'unknown'
  );
}
