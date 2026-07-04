import "server-only";
// Use granular imports to avoid bundling the JWE inflate/deflate code paths,
// which pull in Node.js CompressionStream APIs and trigger Edge Runtime warnings.
import { SignJWT } from "jose/jwt/sign";
import { jwtVerify } from "jose/jwt/verify";
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  JWT_ISSUER,
  JWT_AUDIENCE,
} from "./constants";

export interface SessionPayload {
  email: string;
}

/** Returns the encoded secret or null if JWT_SECRET is missing/too short. */
function getSecret(): Uint8Array | null {
  const secret = process.env.JWT_SECRET;
  if (!secret) return null;
  const encoded = new TextEncoder().encode(secret);
  // HS256 requires a minimum 256-bit (32-byte) key
  if (encoded.length < 32) return null;
  return encoded;
}

/** Sign a session JWT (HS256). Throws if JWT_SECRET is not configured. */
export async function signToken(payload: SessionPayload): Promise<string> {
  const secret = getSecret();
  if (!secret) {
    throw new Error("JWT_SECRET is not set or is shorter than 32 bytes");
  }
  return new SignJWT({ email: payload.email })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .setIssuer(JWT_ISSUER)
    .setAudience(JWT_AUDIENCE)
    .sign(secret);
}

/** Verify a session JWT. Returns the payload or null if invalid/expired/misconfigured. */
export async function verifyToken(
  token: string | undefined
): Promise<SessionPayload | null> {
  if (!token) return null;
  const secret = getSecret();
  // If JWT_SECRET is not configured, no token can be valid — fail closed.
  if (!secret) return null;
  try {
    const { payload } = await jwtVerify(token, secret, {
      algorithms: ["HS256"],
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
      clockTolerance: 30, // tolerate minor server clock skew
    });
    if (typeof payload.email !== "string" || !payload.email) return null;
    return { email: payload.email };
  } catch {
    return null;
  }
}

/** Cookie options shared by login (set) and logout (clear). */
export function sessionCookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: "/",
    maxAge,
  };
}

// Re-export from constants for backward compatibility
export { SESSION_COOKIE, SESSION_MAX_AGE };
