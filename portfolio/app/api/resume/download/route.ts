import { NextRequest } from 'next/server';
import { list } from '@vercel/blob';
import { db, analytics } from '@/lib/db';
import { rateLimit, getIP } from '@/lib/validation/rate-limit';
import { err } from '@/lib/services/response';

/**
 * GET /api/resume/download
 * Finds the resume in Vercel Blob (under the `resume/` prefix), tracks the
 * download event, and redirects to the blob's public URL.
 */
export async function GET(req: NextRequest) {
  const ip = getIP(req);
  const rl = rateLimit({ key: `resume:${ip}`, limit: 5, windowMs: 60_000 });
  if (!rl.allowed) return err('Too many requests', 429);

  try {
    // Most recent file uploaded under the resume bucket prefix.
    const { blobs } = await list({ prefix: 'resume/' });
    if (blobs.length === 0) {
      return err('Resume not found. Please upload a resume via the admin storage panel.', 404);
    }

    const latest = blobs.reduce((a, b) =>
      a.uploadedAt > b.uploadedAt ? a : b
    );

    // Track the download (non-blocking — never block the redirect).
    trackDownload(ip, req).catch((e) => console.error('[Resume Download] track:', e));

    return Response.redirect(latest.url, 302);
  } catch (e) {
    console.error('[Resume Download]', e);
    return err('Failed to process download', 500);
  }
}

async function trackDownload(ip: string, req: NextRequest) {
  await db.insert(analytics).values({
    event_type: 'resume_download',
    metadata: {},
    ip_address: ip,
    user_agent: req.headers.get('user-agent') ?? undefined,
    referrer: req.headers.get('referer') ?? undefined,
  });
}
