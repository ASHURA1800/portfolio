'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ImagePlus, Eye } from 'lucide-react';
import { Progress } from '@/components/admin/ui/Progress';
import { DropZone } from '@/components/admin/ui/DropZone';
import { PreviewDialog } from '@/components/admin/ui/PreviewDialog';
import { ValidationMessage } from '@/components/admin/ui/ValidationMessage';

export interface ImageUploaderProps {
  /** Single cover image URL, or leave undefined when in `multiple` mode */
  value?: string;
  /** Existing screenshot URLs, for `multiple` mode */
  values?: string[];
  multiple?: boolean;
  uploading: boolean;
  /** 0–100. Optional — shows a determinate bar instead of an indeterminate one when provided. */
  progress?: number;
  /** Surfaced under the dropzone, e.g. "File exceeds 5MB" from a failed upload. */
  error?: string;
  /** Hands raw File(s) straight to the manager's existing upload handler
   *  (handleCover / handleScreenshots) — no fetch logic lives here. */
  onFiles: (files: FileList) => void;
  onRemove: (target?: string) => void;
  label: string;
}

/** Drag-and-drop image picker, used for both the single cover image and
 *  the multi-screenshot gallery. Purely presentational: onFiles/onRemove
 *  are the manager's real handlers. Built on the shared DropZone; clicking
 *  an existing thumbnail opens a full-size PreviewDialog instead of just
 *  showing a 64px crop. */
export function ImageUploader({ value, values, multiple = false, uploading, progress, error, onFiles, onRemove, label }: ImageUploaderProps) {
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs text-[var(--color-faint)] font-medium">{label}</label>

      {multiple && values && values.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {values.map((src) => (
            <motion.div key={src} initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} className="relative group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt="Screenshot"
                onClick={() => setPreviewSrc(src)}
                className="h-16 w-24 rounded-lg object-cover border border-[var(--color-border)] cursor-pointer"
              />
              <button
                type="button"
                onClick={() => setPreviewSrc(src)}
                aria-label="Preview screenshot"
                className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/0 group-hover:bg-black/30 opacity-0 group-hover:opacity-100 transition-all"
              >
                <Eye size={14} className="text-white" />
              </button>
              <button
                type="button"
                onClick={() => onRemove(src)}
                aria-label="Remove screenshot"
                className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-faint)] hover:text-[var(--color-error)] text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={10} />
              </button>
            </motion.div>
          ))}
        </div>
      )}

      {!multiple && value && (
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="Cover preview"
            onClick={() => setPreviewSrc(value)}
            className="h-16 w-16 rounded-lg object-cover border border-[var(--color-border)] cursor-pointer"
          />
          <div className="flex flex-col gap-1 items-start">
            <button type="button" onClick={() => setPreviewSrc(value)} className="text-xs text-[var(--color-accent-400)] hover:text-[var(--color-accent-300)] transition-colors">
              Preview
            </button>
            <button type="button" onClick={() => onRemove()} className="text-xs text-[var(--color-faint)] hover:text-[var(--color-error)] transition-colors">
              Remove
            </button>
          </div>
        </div>
      )}

      <DropZone
        accept="image/png,image/jpeg,image/webp,image/gif"
        multiple={multiple}
        disabled={uploading}
        onFiles={onFiles}
      >
        <ImagePlus size={18} className="text-[var(--color-faint)]" />
        <p className="text-xs text-[var(--color-faint)]">
          Drag & drop or click to upload{multiple ? ' (multiple allowed)' : ''}
        </p>
      </DropZone>

      <AnimatePresence>
        {uploading && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
            <Progress size="sm" tone="accent" value={progress} showValue={progress !== undefined} />
          </motion.div>
        )}
      </AnimatePresence>

      {error && <ValidationMessage tone="error">{error}</ValidationMessage>}

      {previewSrc && (
        <PreviewDialog open={!!previewSrc} onClose={() => setPreviewSrc(null)} src={previewSrc} title={label} />
      )}
    </div>
  );
}
