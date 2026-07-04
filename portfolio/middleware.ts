import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose/jwt/verify";
import {
  SESSION_COOKIE,
  JWT_ISSUER,
  JWT_AUDIENCE,
} from "@/lib/auth/constants";

const SESSION_COOKIE_NAME = SESSION_COOKIE;

function applySecurityHeaders(res: NextResponse): NextResponse {
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=(), usb=()"
  );
  if (process.env.NODE_ENV === "production") {
    res.headers.set(
      "Strict-Transport-Security",
      "max-age=63072000; includeSubDomains; preload"
    );
  }
  return res;
}

async function verifySessionToken(token: string | undefined): Promise<string | null> {
  if (!token) return null;
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) return null;
  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(secret),
      { algorithms: ["HS256"], issuer: JWT_ISSUER, audience: JWT_AUDIENCE }
    );
    const email = payload.email;
    return typeof email === "string" && email ? email : null;
  } catch {
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isAdminPath = pathname === "/admin" || pathname.startsWith("/admin/");

  let isAdminUser = false;
  if (isAdminPath) {
    const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
    const email = await verifySessionToken(token);
    // A valid JWT (signed by JWT_SECRET) is sufficient — credentials are
    // now validated at login time against the DB owner_accounts table.
    isAdminUser = !!email;
  }

  if (isAdminPath && pathname !== "/admin/login" && !isAdminUser) {
    const loginUrl = new URL("/admin/login", req.url);
    loginUrl.searchParams.set("redirectTo", pathname);
    return applySecurityHeaders(NextResponse.redirect(loginUrl));
  }

  if (pathname === "/admin/login" && isAdminUser) {
    return applySecurityHeaders(NextResponse.redirect(new URL("/admin", req.url)));
  }

  return applySecurityHeaders(NextResponse.next({ request: req }));
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|woff2?|ttf|otf|ico)$).*)",
  ],
};
