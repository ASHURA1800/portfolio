'use client';

import { useState, useRef, useCallback, useId } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, X, ImageIcon, CheckCircle, AlertCircle } from 'lucide-react';
import Image from 'next/image';

type UploadState = 'idle' | 'dragging' | 'uploading' | 'success' | 'error';

interface ImageUploaderProps {
  /** Current image URL (controlled) */
  value: string;
  onChange: (url: string) => void;
  /** POST endpoint that accepts FormData { file } and returns { url: string } */
  uploadEndpoint: string;
  label?: string;
  helperText?: string;
  /** Accept string, e.g. "image/*" */
  accept?: string;
  /** Max file size in bytes. Default 5 MB. */
  maxBytes?: number;
  disabled?: boolean;
  className?: string;
  /** Aspect ratio hint for the preview (CSS value like "16/9" or "1") */
  aspectRatio?: string;
}

/**
 * ImageUploader
 * Drop zone with live preview, upload progress bar, and error state.
 * Calls uploadEndpoint via FormData POST; expects { url } response.
 * Overlay "Change" button on hover lets user replace without clearing first.
 */
export default function ImageUploader({
  value,
  onChange,
  uploadEndpoint,
  label = 'Image',
  helperText,
  accept = 'image/*',
  maxBytes = 5 * 1024 * 1024,
  disabled,
  className,
  aspectRatio = '16/9',
}: ImageUploaderProps) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [state, setState] = useState<UploadState>('idle');
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');

  const upload = useCallback(
    async (file: File) => {
      if (file.size > maxBytes) {
        setErrorMsg(`File too large (max ${Math.round(maxBytes / 1024 / 1024)} MB)`);
        setState('error');
        return;
      }

      setState('uploading');
      setProgress(0);
      setErrorMsg('');

      // Fake progress while XHR is in-flight — gives snappy feel
      const tick = setInterval(() => {
        setProgress((p) => Math.min(p + 8, 85));
      }, 80);

      try {
        const fd = new FormData();
        fd.append('file', file);
        const res = await fetch(uploadEndpoint, { method: 'POST', body: fd });
        const data = await res.json().catch(() => ({}));
        clearInterval(tick);

        if (!res.ok || !data.url) {
          throw new Error(data.error ?? 'Upload failed');
        }

        setProgress(100);
        setState('success');
        onChange(data.url);
        // brief success pause then back to idle
        setTimeout(() => setState('idle'), 1400);
      } catch (err) {
        clearInterval(tick);
        setErrorMsg(err instanceof Error ? err.message : 'Upload failed');
        setState('error');
      }
    },
    [uploadEndpoint, maxBytes, onChange]
  );

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    upload(files[0]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (disabled) return;
    setState('idle');
    handleFiles(e.dataTransfer.files);
  };

  const clear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setState('idle');
    setErrorMsg('');
    if (inputRef.current) inputRef.current.value = '';
  };

  const borderColor =
    state === 'error'
      ? 'var(--color-error)'
      : state === 'dragging'
      ? 'var(--color-accent-400)'
      : state === 'success'
      ? 'var(--color-success)'
      : 'var(--color-border)';

  const bgColor =
    state === 'dragging'
      ? 'rgba(124, 77, 255, 0.06)'
      : 'rgba(255,255,255,0.02)';

  return (
    <div className={className}>
      {label && (
        <p
          style={{
            fontSize: 'var(--text-xs)',
            fontWeight: 600,
            letterSpacing: 'var(--tracking-wide)',
            textTransform: 'uppercase',
            color: 'var(--color-faint)',
            marginBottom: '0.5rem',
          }}
        >
          {label}
        </p>
      )}

      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label={`Upload ${label}`}
        onClick={() => !disabled && inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            if (!disabled) inputRef.current?.click();
          }
        }}
        onDragOver={(e) => { e.preventDefault(); if (!disabled) setState('dragging'); }}
        onDragLeave={() => setState(value ? 'idle' : 'idle')}
        onDrop={handleDrop}
        style={{
          position: 'relative',
          border: `2px dashed ${borderColor}`,
          borderRadius: 'var(--radius-lg)',
          background: bgColor,
          cursor: disabled ? 'not-allowed' : 'pointer',
          overflow: 'hidden',
          aspectRatio,
          transition: 'border-color 0.18s ease, background 0.18s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Preview */}
        {value && (
          <>
            <Image
              src={value}
              alt="Preview"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              style={{ objectFit: 'cover' }}
            />
            {/* Overlay on hover */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(8, 9, 13, 0.6)',
                opacity: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                transition: 'opacity 0.2s ease',
              }}
              className="uploader-overlay"
            >
              <Upload size={20} color="white" />
              <span style={{ color: 'white', fontSize: 'var(--text-xs)', fontWeight: 600 }}>
                Change image
              </span>
            </div>
            {/* Clear button */}
            <button
              type="button"
              onClick={clear}
              aria-label="Remove image"
              style={{
                position: 'absolute',
                top: '0.5rem',
                right: '0.5rem',
                width: '1.75rem',
                height: '1.75rem',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(8,9,13,0.8)',
                border: '1px solid rgba(255,255,255,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'white',
                zIndex: 2,
              }}
            >
              <X size={12} strokeWidth={2.5} />
            </button>
          </>
        )}

        {/* Empty state */}
        {!value && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.625rem',
              padding: '2rem',
              textAlign: 'center',
              pointerEvents: 'none',
            }}
          >
            <AnimatePresence mode="wait">
              {state === 'error' ? (
                <motion.div key="err" initial={{ scale: 0.7 }} animate={{ scale: 1 }}>
                  <AlertCircle size={28} color="var(--color-error)" />
                </motion.div>
              ) : state === 'success' ? (
                <motion.div key="ok" initial={{ scale: 0.7 }} animate={{ scale: 1 }}>
                  <CheckCircle size={28} color="var(--color-success)" />
                </motion.div>
              ) : (
                <motion.div key="base" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <ImageIcon size={28} color="var(--color-faint)" />
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <p
                style={{
                  fontSize: 'var(--text-sm)',
                  color:
                    state === 'error'
                      ? 'var(--color-error)'
                      : state === 'success'
                      ? 'var(--color-success)'
                      : 'var(--color-muted)',
                  fontWeight: 500,
                }}
              >
                {state === 'error'
                  ? errorMsg
                  : state === 'uploading'
                  ? 'Uploading…'
                  : state === 'success'
                  ? 'Uploaded'
                  : state === 'dragging'
                  ? 'Drop to upload'
                  : 'Drop image or click to browse'}
              </p>
              {state === 'idle' && (
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-faint)', marginTop: '0.25rem' }}>
                  {helperText ?? `PNG, JPG, WebP up to ${Math.round(maxBytes / 1024 / 1024)} MB`}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Progress bar */}
        <AnimatePresence>
          {state === 'uploading' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '3px',
                background: 'rgba(255,255,255,0.08)',
              }}
            >
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: `${progress}%` }}
                transition={{ ease: 'easeOut' }}
                style={{
                  height: '100%',
                  background:
                    'linear-gradient(90deg, var(--color-accent-500), var(--color-accent2-500))',
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={accept}
        disabled={disabled}
        onChange={(e) => handleFiles(e.target.files)}
        style={{ display: 'none' }}
      />

      {/* Overlay hover via CSS (avoids JS listener noise) */}
      <style>{`
        [role="button"]:hover .uploader-overlay { opacity: 1 !important; }
      `}</style>
    </div>
  );
}
