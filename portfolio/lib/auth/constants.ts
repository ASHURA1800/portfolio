/**
 * Shared JWT/session constants used by both Edge middleware and Node API routes.
 * Do NOT import "server-only" here — this file is loaded in middleware (Edge Runtime).
 */

export const SESSION_COOKIE = "session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days (seconds) — default session
export const SESSION_MAX_AGE_EXTENDED = 60 * 60 * 24 * 30; // 30 days — "Remember me"
export const JWT_ISSUER = "portfolio";
export const JWT_AUDIENCE = "portfolio-admin";
