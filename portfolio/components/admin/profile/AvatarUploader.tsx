'use client';

import { useRef, useState, type DragEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import { Upload, X, Check } from 'lucide-react';
import { Progress } from '@/components/admin/ui/Progress';
import { cn } from '@/lib/utils';

export interface AvatarUploaderProps {
  value: string;
  uploading: boolean;
  /** Called with the picked file — the manager's existing upload() function
   *  still owns the actual fetch to /api/storage/avatars. */
  onFile: (file: File) => void;
  onRemove: () => void;
  name?: string;
}

/** Drag-and-drop-capable avatar picker with live preview. No new upload
 *  logic — onFile hands the raw File straight to the manager's existing
 *  upload handler, same as the plain <input type="file"> it replaces. */
export function AvatarUploader({ value, uploading, onFile, onRemove, name }: AvatarUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [justUploaded, setJustUploaded] = useState(false);

  const handleFiles = (files: FileList | null) => {
    const file = files?.[0];
    if (file) onFile(file);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const initial = (name?.trim().charAt(0) || '?').toUpperCase();

  return (
    <div className="flex items-center gap-4">
      <div
        role="button"
        tabIndex={0}
        aria-label="Upload avatar"
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={cn(
          'relative w-20 h-20 rounded-full shrink-0 cursor-pointer overflow-hidden',
          'border-2 transition-colors duration-[var(--admin-duration-fast)]',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-500)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]',
          dragging ? 'border-[var(--color-accent-500)]' : 'border-[var(--color-border)] hover:border-[var(--color-border-hover)]'
        )}
      >
        {value ? (
          <Image src={value} alt="Avatar preview" width={80} height={80} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[var(--color-surface)] text-[var(--color-faint)] text-xl font-semibold">
            {initial}
          </div>
        )}

        <AnimatePresence>
          {(dragging || uploading) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-black/60"
            >
              <Upload size={18} className="text-white" />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {justUploaded && (
            <motion.div
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-[var(--color-success)]/80"
              onAnimationComplete={() => setTimeout(() => setJustUploaded(false), 700)}
            >
              <Check size={20} className="text-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex-1 min-w-0 flex flex-col gap-2">
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          disabled={uploading}
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />
        <p className="text-xs text-[var(--color-faint)]">
          Click or drag an image — JPG, PNG, or WebP.
        </p>
        {uploading && <Progress size="sm" tone="accent" />}
        {value && !uploading && (
          <button
            type="button"
            onClick={onRemove}
            className="inline-flex items-center gap-1 text-xs text-[var(--color-faint)] hover:text-[var(--color-error)] transition-colors w-fit"
          >
            <X size={12} /> Remove avatar
          </button>
        )}
      </div>
    </div>
  );
}
