import { NextResponse } from 'next/server';
import type { ApiError, ApiSuccess } from '@/types';
import type { ZodError } from 'zod';

export function ok<T>(data: T, message?: string, status = 200): NextResponse {
  return NextResponse.json(
    { success: true, data, ...(message ? { message } : {}) } satisfies ApiSuccess<T>,
    { status }
  );
}

export function created<T>(data: T, message?: string): NextResponse {
  return ok(data, message, 201);
}

export function err(error: string, status = 400, details?: Record<string, string[]>): NextResponse {
  return NextResponse.json(
    { success: false, error, ...(details ? { details } : {}) } satisfies ApiError,
    { status }
  );
}

export function validationError(zodError: ZodError): NextResponse {
  const details: Record<string, string[]> = {};
  for (const issue of zodError.issues) {
    const field = issue.path.join('.') || 'root';
    details[field] = [...(details[field] ?? []), issue.message];
  }
  return err('Validation failed', 422, details);
}

export function rateLimitError(resetAt: number): NextResponse {
  const res = err('Too many requests. Please try again later.', 429);
  res.headers.set('X-RateLimit-Reset', String(resetAt));
  res.headers.set('Retry-After', String(Math.ceil((resetAt - Date.now()) / 1000)));
  return res;
}
