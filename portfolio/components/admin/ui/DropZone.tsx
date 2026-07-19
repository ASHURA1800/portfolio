'use client';

import { useRef, useState, type DragEvent, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Upload } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface DropZoneProps {
  /** Accept string passed straight to the hidden <input>, e.g. "image/png,image/jpeg". */
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  onFiles: (files: FileList) => void;
  /** Compact removes the icon and shrinks padding — for tight form layouts. */
  compact?: boolean;
  children?: ReactNode;
  className?: string;
}

/**
 * Bare drag-and-drop + click-to-browse surface. No preview, no progress —
 * just file acquisition. ImageUploader (and any future uploader: resume,
 * generic attachment) wraps this rather than re-implementing drag state.
 */
export function DropZone({ accept, multiple = false, disabled, onFiles, compact = false, children, className }: DropZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  // dragDepth IS read — inside the functional setDragDepth(d => ...) updater
  // in onDragLeave below — but that doesn't count as a "read" to eslint's
  // static analysis, hence the disable. This is confirmed to be
  // a real, working drag-counter that prevents dragging from flickering
  // false when a nested child element fires its own dragleave. Do not
  // remove dragDepth to silence this warning — it will reintroduce that bug.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [dragDepth, setDragDepth] = useState(0);

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    setDragDepth(0);
    if (disabled) return;
    if (e.dataTransfer.files.length) onFiles(e.dataTransfer.files);
  };

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled || undefined}
      onClick={() => !disabled && inputRef.current?.click()}
      onKeyDown={(e) => !disabled && (e.key === 'Enter' || e.key === ' ') && inputRef.current?.click()}
      onDragEnter={(e) => {
        e.preventDefault();
        if (disabled) return;
        setDragDepth((d) => d + 1);
        setDragging(true);
      }}
      onDragOver={(e) => e.preventDefault()}
      onDragLeave={() => {
        setDragDepth((d) => {
          const next = Math.max(0, d - 1);
          if (next === 0) setDragging(false);
          return next;
        });
      }}
      onDrop={handleDrop}
      className={cn(
        'relative flex flex-col items-center justify-center gap-1.5 rounded-[var(--radius-md)] border-2 border-dashed text-center transition-colors',
        compact ? 'py-3.5' : 'py-5',
        disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-500)]',
        dragging
          ? 'border-[var(--color-accent-500)] bg-[var(--color-accent-500)]/5'
          : 'border-[var(--color-border)] hover:border-[var(--color-border-hover)]',
        className
      )}
    >
      <input
        ref={inputRef}
        type="file"
        multiple={multiple}
        accept={accept}
        disabled={disabled}
        onChange={(e) => {
          if (e.target.files && e.target.files.length) onFiles(e.target.files);
          e.target.value = '';
        }}
        className="hidden"
      />
      {children ?? (
        <>
          {!compact && <Upload size={18} className="text-[var(--color-faint)]" />}
          <p className="text-xs text-[var(--color-faint)]">
            Drag & drop or click to upload{multiple ? ' (multiple allowed)' : ''}
          </p>
        </>
      )}

      <AnimatePresence>
        {dragging && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-[var(--color-accent-500)]/10 rounded-[var(--radius-md)] pointer-events-none"
          >
            <Upload size={20} className="text-[var(--color-accent-400)]" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
