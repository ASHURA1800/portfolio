import { NextRequest } from 'next/server';
import { uploadFile, deleteFile, extractPathFromUrl } from '@/lib/storage/upload';
import { STORAGE_BUCKETS, type StorageBucket } from '@/lib/validation/schemas';
import { ok, err } from '@/lib/services/response';
import { requireAdmin, isAuthError } from '@/lib/auth/session';

type Params = { params: Promise<{ bucket: string }> };

// ── POST /api/storage/:bucket — upload a file ─────────────────────────────────
export async function POST(req: NextRequest, { params }: Params) {
  const auth = await requireAdmin();
  if (isAuthError(auth)) return auth;

  const { bucket } = await params;

  if (!STORAGE_BUCKETS.includes(bucket as StorageBucket)) {
    return err(`Invalid bucket. Must be one of: ${STORAGE_BUCKETS.join(', ')}`, 400);
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return err('Expected multipart/form-data');
  }

  const file = formData.get('file');
  if (!file || !(file instanceof File)) {
    return err('No file provided — include a "file" field in the form data');
  }

  // Sanitize the optional subfolder: allow only alphanumeric, dash, underscore,
  // dot, and forward-slash. Collapse consecutive dots (prevents ../ traversal)
  // and repeated slashes. Capped at 100 chars.
  const rawFolder = (formData.get('folder') as string | null) ?? '';
  const folder = rawFolder
    .replace(/[^a-zA-Z0-9._/-]/g, '')
    .replace(/\.{2,}/g, '.')   // collapse .. → . (prevents path traversal)
    .replace(/\/+/g, '/')
    .replace(/^\/|\/$/g, '')
    .slice(0, 100);

  try {
    const result = await uploadFile(file, bucket as StorageBucket, folder);
    return ok(result, 'File uploaded successfully');
  } catch (e) {
    console.error('[Storage] Upload error:', e);
    const msg = e instanceof Error ? e.message : '';
    // Only surface user-facing validation errors; hide internal SDK details
    const SAFE_PREFIXES = ['File is empty', 'File exceeds', 'Resume must be', 'File type', 'File extension'];
    const isSafe = SAFE_PREFIXES.some((p) => msg.startsWith(p));
    return err(isSafe ? msg : 'Upload failed', isSafe ? 400 : 500);
  }
}

// ── DELETE /api/storage/:bucket — delete a file by path or URL ────────────────
export async function DELETE(req: NextRequest, { params }: Params) {
  const auth = await requireAdmin();
  if (isAuthError(auth)) return auth;

  const { bucket } = await params;

  if (!STORAGE_BUCKETS.includes(bucket as StorageBucket)) {
    return err(`Invalid bucket`, 400);
  }

  const url = new URL(req.url);
  const pathParam = url.searchParams.get('path');
  const urlParam = url.searchParams.get('url');

  if (!pathParam && !urlParam) {
    return err('Provide either ?path= (storage path) or ?url= (public URL)');
  }

  const filePath = pathParam ?? extractPathFromUrl(urlParam ?? '');

  try {
    await deleteFile(filePath);
    return ok(null, 'File deleted');
  } catch (e) {
    console.error('[Storage] Delete error:', e);
    return err('Failed to delete file', 500);
  }
}
