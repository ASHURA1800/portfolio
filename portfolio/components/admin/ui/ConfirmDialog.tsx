'use client';

import { useState } from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './Button';

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'default' | 'danger';
}

/**
 * Generic confirm dialog — the direct replacement for `window.confirm()`
 * calls across every admin manager. Confirm button shows a loading state
 * while `onConfirm` resolves, and the dialog only closes after it
 * succeeds (so a failed delete doesn't silently dismiss).
 */
export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'default',
}: ConfirmDialogProps) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={loading ? () => {} : onClose}
      size="sm"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button variant={variant === 'danger' ? 'danger' : 'primary'} onClick={handleConfirm} loading={loading}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      <div className="flex gap-3">
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
            variant === 'danger' ? 'bg-error-bg text-error' : 'bg-accent-500/10 text-accent-300'
          }`}
        >
          <AlertTriangle size={18} />
        </span>
        <div>
          <h3 className="text-sm font-semibold text-ink">{title}</h3>
          <p className="mt-1 text-sm text-muted">{description}</p>
        </div>
      </div>
    </Modal>
  );
}

interface DeleteDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  /** The name of the specific item being deleted, e.g. a project title. */
  itemName: string;
  /** What kind of thing it is, e.g. "project", "certification". */
  itemType: string;
}

/** Specialized ConfirmDialog for destructive delete actions. */
export function DeleteDialog({ open, onClose, onConfirm, itemName, itemType }: DeleteDialogProps) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={loading ? () => {} : onClose}
      size="sm"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="danger" icon={<Trash2 size={14} />} onClick={handleConfirm} loading={loading}>
            Delete {itemType}
          </Button>
        </>
      }
    >
      <div className="flex gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-error-bg text-error">
          <Trash2 size={18} />
        </span>
        <div>
          <h3 className="text-sm font-semibold text-ink">Delete &ldquo;{itemName}&rdquo;?</h3>
          <p className="mt-1 text-sm text-muted">
            This {itemType} will be permanently removed. This action can&apos;t be undone.
          </p>
        </div>
      </div>
    </Modal>
  );
}
