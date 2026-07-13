'use client';

import { Download } from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './Button';

export interface PreviewDialogProps {
  open: boolean;
  onClose: () => void;
  /** Image URL to preview. */
  src: string;
  /** Accessible label / filename shown above the image. */
  title?: string;
  /** Optional secondary action, e.g. "Replace" or "Remove" — rendered next to Close. */
  actions?: React.ReactNode;
}

/**
 * Full-size preview for an already-uploaded (or freshly-selected) image —
 * click any thumbnail in ImageUploader to open this instead of squinting
 * at a 64px crop. Includes a direct download link since blob URLs aren't
 * always convenient to right-click-save from.
 */
export function PreviewDialog({ open, onClose, src, title, actions }: PreviewDialogProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title ?? 'Preview'}
      size="lg"
      footer={
        <>
          {actions}
          <Button variant="secondary" icon={<Download size={14} />} onClick={() => window.open(src, '_blank')}>
            Download
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </>
      }
    >
      <div className="flex items-center justify-center bg-[var(--color-surface-hover)] rounded-[var(--radius-md)] p-2 max-h-[60vh] overflow-auto">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={title ?? 'Preview'} className="max-h-[56vh] max-w-full w-auto h-auto rounded-[var(--radius-sm)] object-contain" />
      </div>
    </Modal>
  );
}
