import { NextResponse } from 'next/server';
import { sessionCookieOptions, SESSION_COOKIE } from '@/lib/auth/jwt';

export async function POST() {
  const res = NextResponse.json(
    { success: true, data: null, message: 'Logged out successfully' },
    { status: 200 }
  );
  // Clear the session cookie
  res.cookies.set(SESSION_COOKIE, '', sessionCookieOptions(0));
  return res;
}
