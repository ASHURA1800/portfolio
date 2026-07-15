/**
 * Client-side fetch wrapper for admin API calls.
 *
 * Real problem this fixes: every *Manager.tsx page calls fetch() directly
 * and only checks `res.ok`, so a 401 from an expired/missing session (the
 * middleware-level redirect only covers full page navigations, not an
 * in-page fetch from a tab left open past the session's expiry) falls
 * into the same generic error path as a validation failure or a network
 * blip — e.g. "Save failed." with no indication the user is actually
 * logged out, and no way to recover except manually finding their way
 * back to /admin/login.
 *
 * adminFetch is a drop-in replacement for fetch() with the same call
 * signature; on a 401 it redirects to /admin/login with the current path
 * preserved as redirectTo (mirroring the pattern middleware.ts already
 * uses), before the caller even has to look at the response.
 */

export class SessionExpiredError extends Error {
  constructor() {
    super('Session expired');
    this.name = 'SessionExpiredError';
  }
}

export class RequestTimeoutError extends Error {
  constructor() {
    super('Request timed out');
    this.name = 'RequestTimeoutError';
  }
}

const DEFAULT_TIMEOUT_MS = 20_000;

/**
 * Wraps fetch() with two real failure-mode fixes that had no coverage
 * anywhere in the app:
 *
 * 1. Timeout — a hung request (dead connection, unresponsive server) had
 *    no escape hatch; the caller's loading/saving state would spin
 *    forever. Aborts after `timeoutMs` (default 20s) and throws
 *    RequestTimeoutError so the caller can show a real "took too long,
 *    try again" message instead of an indefinite spinner.
 * 2. Session expiry — see SessionExpiredError above.
 *
 * If the caller passes their own `signal`, it's respected alongside the
 * timeout's internal one (either aborting cancels the request).
 */
export async function adminFetch(
  input: RequestInfo | URL,
  init?: RequestInit,
  timeoutMs = DEFAULT_TIMEOUT_MS
): Promise<Response> {
  const timeoutController = new AbortController();
  const timer = setTimeout(() => timeoutController.abort(), timeoutMs);

  // Combine the caller's own abort signal (if any) with our timeout one —
  // whichever fires first wins.
  const callerSignal = init?.signal;
  if (callerSignal) {
    if (callerSignal.aborted) timeoutController.abort();
    else callerSignal.addEventListener('abort', () => timeoutController.abort(), { once: true });
  }

  let res: Response;
  try {
    res = await fetch(input, { ...init, signal: timeoutController.signal });
  } catch (e) {
    if (timeoutController.signal.aborted && !(callerSignal?.aborted)) {
      throw new RequestTimeoutError();
    }
    throw e;
  } finally {
    clearTimeout(timer);
  }

  if (res.status === 401 && typeof window !== 'undefined') {
    const current = window.location.pathname;
    const redirectTo = current.startsWith('/admin') ? current : '/admin';
    window.location.href = `/admin/login?redirectTo=${encodeURIComponent(redirectTo)}`;
    throw new SessionExpiredError();
  }

  return res;
}
