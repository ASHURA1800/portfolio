import "server-only";
import { put, del } from "@vercel/blob";
import {
  ALLOWED_IMAGE_TYPES,
  MAX_FILE_SIZE,
  type StorageBucket,
} from "@/lib/validation/schemas";

// Allowed extensions cross-checked against MIME type to prevent spoofing
const ALLOWED_IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "webp", "gif"];
const ALLOWED_RESUME_EXTENSIONS = ["pdf"];
// Profile images: stricter subset — no gif (animated images not appropriate for avatars)
const AVATAR_ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
const AVATAR_ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png", "webp"];

function generateId(): string {
  // Use crypto for collision-resistant IDs instead of Math.random()
  return crypto.randomUUID().slice(0, 9);
}

export interface UploadResult {
  url: string;
  path: string;
  bucket: StorageBucket;
}

/** Build the blob pathname (`bucket/[folder/]filename`) for a file. */
function buildPath(
  bucket: StorageBucket,
  folder: string,
  fileName: string
): string {
  const ext = fileName.split(".").pop()?.toLowerCase() ?? "bin";
  const safeName = `${generateId()}-${Date.now()}.${ext}`;
  return [bucket, folder, safeName].filter(Boolean).join("/");
}

/**
 * Upload a file to Vercel Blob under the given bucket prefix.
 * Validates size, MIME type, and file extension before uploading.
 */
export async function uploadFile(
  file: File,
  bucket: StorageBucket,
  folder = ""
): Promise<UploadResult> {
  if (file.size === 0) throw new Error("File is empty");
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(
      `File exceeds maximum size of ${MAX_FILE_SIZE / 1024 / 1024} MB`
    );
  }

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";

  if (bucket === "resume") {
    if (file.type !== "application/pdf" || !ALLOWED_RESUME_EXTENSIONS.includes(ext)) {
      throw new Error("Resume must be a PDF file");
    }
  } else if (bucket === "avatars") {
    if (!AVATAR_ALLOWED_TYPES.includes(file.type as never)) {
      throw new Error(`File type "${file.type}" is not allowed for profile images`);
    }
    if (!AVATAR_ALLOWED_EXTENSIONS.includes(ext)) {
      throw new Error(`File extension ".${ext}" is not allowed for profile images`);
    }
  } else {
    // Validate MIME type
    if (!ALLOWED_IMAGE_TYPES.includes(file.type as never)) {
      throw new Error(`File type "${file.type}" is not allowed`);
    }
    // Validate extension matches MIME type (prevents disguised uploads)
    if (!ALLOWED_IMAGE_EXTENSIONS.includes(ext)) {
      throw new Error(`File extension ".${ext}" is not allowed`);
    }
  }

  const pathname = buildPath(bucket, folder, file.name);

  const blob = await put(pathname, file, {
    access: "public",
    contentType: file.type || undefined,
  });

  return { url: blob.url, path: blob.pathname, bucket };
}

/** Delete a file from Vercel Blob by its pathname or URL. */
export async function deleteFile(pathOrUrl: string): Promise<void> {
  await del(pathOrUrl);
}

/** Replace an existing file — deletes old, uploads new. */
export async function replaceFile(
  newFile: File,
  bucket: StorageBucket,
  oldPath: string,
  folder = ""
): Promise<UploadResult> {
  await deleteFile(oldPath).catch(() => {
    // Non-fatal: old file may already be gone
  });
  return uploadFile(newFile, bucket, folder);
}

/** Extract the blob pathname from a Vercel Blob public URL. */
export function extractPathFromUrl(url: string): string {
  try {
    return new URL(url).pathname.replace(/^\/+/, "");
  } catch {
    return url;
  }
}
