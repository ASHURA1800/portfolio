/**
 * Centralized API client layer for CLIENT-SIDE use.
 *
 * These helpers make HTTP fetch calls back to the app's own API routes.
 * Do NOT call them from Server Components — query the database directly instead.
 * On Vercel, server-to-self loopback requires NEXT_PUBLIC_SITE_URL to be set;
 * without it the `http://localhost:3000` fallback will fail in production.
 */

import type {
  ApiResponse,
  Blog,
  Project,
  Certification,
  Testimonial,
  PaginatedResponse,
} from "@/types";

// Base URL — works in both server components (absolute) and client (relative)
function baseUrl(): string {
  if (typeof window !== "undefined") return ""; // browser: relative path
  // Server / edge: must be absolute. Fallback to localhost for local dev.
  return (
    process.env.NEXT_PUBLIC_SITE_URL ??
    `http://localhost:${process.env.PORT ?? 3000}`
  );
}

async function apiFetch<T>(
  path: string,
  init?: RequestInit & { next?: NextFetchRequestConfig }
): Promise<T> {
  const res = await fetch(`${baseUrl()}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  const json: ApiResponse<T> = await res.json();
  if (!json.success) {
    throw new Error((json as { error: string }).error ?? "API error");
  }
  return (json as { success: true; data: T }).data;
}

// Types for Next.js fetch config
interface NextFetchRequestConfig {
  revalidate?: number | false;
  tags?: string[];
}

// ── Public API helpers (used in Server Components) ─────────────────────────

export async function getProjects(featured?: boolean): Promise<PaginatedResponse<Project>> {
  const qs = featured ? "?featured=true&limit=100" : "?limit=100";
  return apiFetch(`/api/projects${qs}`, { next: { revalidate: 60 } });
}

export async function getBlogs(): Promise<PaginatedResponse<Blog>> {
  return apiFetch(`/api/blogs?limit=100`, { next: { revalidate: 60 } });
}

export async function getBlogBySlug(slug: string): Promise<Blog> {
  return apiFetch(`/api/blogs/${slug}`, { next: { revalidate: 60 } });
}

export async function getCertifications(): Promise<PaginatedResponse<Certification>> {
  return apiFetch("/api/certifications?limit=100", { next: { revalidate: 300 } });
}

export async function getTestimonials(): Promise<PaginatedResponse<Testimonial>> {
  return apiFetch("/api/testimonials?limit=100", { next: { revalidate: 300 } });
}

// ── Admin API helpers (used in Admin Server Components / client) ────────────

export async function adminFetch<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  return apiFetch(path, {
    ...init,
    cache: "no-store", // admin pages always show fresh data
  });
}

// ── Analytics helper (client-side only) ────────────────────────────────────

export function trackEvent(
  eventType: string,
  metadata: Record<string, unknown> = {}
): void {
  if (typeof window === "undefined") return;
  fetch("/api/analytics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ event_type: eventType, metadata }),
  }).catch(() => {});
}
