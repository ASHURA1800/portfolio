import "server-only";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { verifyToken, SESSION_COOKIE, type SessionPayload } from "@/lib/auth/jwt";

/** Returns the current session user ({ email }) or null */
export async function getUser(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  return verifyToken(token);
}

/** Backwards-compatible alias — returns the session payload or null */
export async function getSession(): Promise<SessionPayload | null> {
  return getUser();
}

/** Checks if the current user is the portfolio admin */
export async function isAdmin(): Promise<boolean> {
  const user = await getUser();
  if (!user) return false;
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) return false; // not configured → nobody is admin
  return user.email === adminEmail;
}

/** Returns the session user only when they are the admin; null otherwise. */
export async function getAdminUser(): Promise<SessionPayload | null> {
  const user = await getUser();
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail || !user) return null;
  return user.email === adminEmail ? user : null;
}

/**
 * Route handler guard — call at the top of any admin API route.
 * Returns { user } on success, or a 401/403 NextResponse on failure.
 */
export async function requireAdmin(): Promise<{ user: SessionPayload } | NextResponse> {
  const user = await getUser();

  if (!user) {
    return NextResponse.json(
      { success: false, error: "Authentication required" },
      { status: 401 }
    );
  }

  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail || user.email !== adminEmail) {
    return NextResponse.json(
      { success: false, error: "Forbidden: admin access only" },
      { status: 403 }
    );
  }

  return { user };
}

/** Type-guard: narrows the result of requireAdmin */
export function isAuthError(
  result: Awaited<ReturnType<typeof requireAdmin>>
): result is NextResponse {
  return result instanceof NextResponse;
}
