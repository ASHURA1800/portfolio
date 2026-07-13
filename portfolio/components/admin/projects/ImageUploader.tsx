'use client';

import { useRef, useState, type DragEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, X, ImagePlus } from 'lucide-react';
import { Progress } from '@/components/admin/ui/Progress';
import { cn } from '@/lib/utils';

export interface ImageUploaderProps {
  /** Single cover image URL, or leave undefined when in `multiple` mode */
  value?: string;
  /** Existing screenshot URLs, for `multiple` mode */
  values?: string[];
  multiple?: boolean;
  uploading: boolean;
  /** Hands raw File(s) straight to the manager's existing upload handler
   *  (handleCover / handleScreenshots) — no fetch logic lives here. */
  onFiles: (files: FileList) => void;
  onRemove: (target?: string) => void;
  label: string;
}

/** Drag-and-drop image picker, used for both the single cover image and
 *  the multi-screenshot gallery. Purely presentational: onFiles/onRemove
 *  are the manager's real handlers (handleCover/handleScreenshots and the
 *  existing set('image'|'screenshots', ...) calls). */
export function ImageUploader({ value, values, multiple = false, uploading, onFiles, onRemove, label }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files.length) onFiles(e.dataTransfer.files);
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs text-[var(--color-faint)] font-medium">{label}</label>

      {multiple && values && values.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {values.map((src) => (
            <motion.div
              key={src}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative group"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="Screenshot" className="h-16 w-24 rounded-lg object-cover border border-[var(--color-border)]" />
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
          <img src={value} alt="Cover preview" className="h-16 w-16 rounded-lg object-cover border border-[var(--color-border)]" />
          <button
            type="button"
            onClick={() => onRemove()}
            className="text-xs text-[var(--color-faint)] hover:text-[var(--color-error)] transition-colors"
          >
            Remove
          </button>
        </div>
      )}

      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={cn(
          'relative flex flex-col items-center justify-center gap-1.5 rounded-[var(--radius-md)] border-2 border-dashed cursor-pointer py-5 text-center transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-500)]',
          dragging ? 'border-[var(--color-accent-500)] bg-[var(--color-accent-500)]/5' : 'border-[var(--color-border)] hover:border-[var(--color-border-hover)]'
        )}
      >
        <input
          ref={inputRef}
          type="file"
          multiple={multiple}
          accept="image/png,image/jpeg,image/webp,image/gif"
          disabled={uploading}
          onChange={(e) => e.target.files && e.target.files.length && onFiles(e.target.files)}
          className="hidden"
        />
        <ImagePlus size={18} className="text-[var(--color-faint)]" />
        <p className="text-xs text-[var(--color-faint)]">
          Drag & drop or click to upload{multiple ? ' (multiple allowed)' : ''}
        </p>

        <AnimatePresence>
          {dragging && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-[var(--color-accent-500)]/10 rounded-[var(--radius-md)]"
            >
              <Upload size={20} className="text-[var(--color-accent-400)]" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {uploading && <Progress size="sm" tone="accent" />}
    </div>
  );
}
