'use client';

import type { ReactNode } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './Button';

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

/** Generic content dialog — for anything that isn't a yes/no confirmation. */
export function Dialog({ open, onClose, title, children, footer, size = 'md' }: DialogProps) {
  return (
    <Modal open={open} onClose={onClose} title={title} size={size} footer={footer}>
      {children}
    </Modal>
  );
}

/** Convenience variant: success feedback with an animated check, auto-styled. */
export function SuccessDialog({
  open,
  onClose,
  title,
  description,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
}) {
  return (
    <Modal open={open} onClose={onClose} size="sm" hideCloseButton footer={<Button onClick={onClose} className="w-full">Done</Button>}>
      <div className="flex flex-col items-center gap-3 py-2 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-success-bg text-success">
          <CheckCircle2 size={26} />
        </span>
        <h3 className="text-base font-semibold text-ink">{title}</h3>
        {description && <p className="text-sm text-muted">{description}</p>}
      </div>
    </Modal>
  );
}

/** Convenience variant: error feedback, matches SuccessDialog's shape. */
export function ErrorDialog({
  open,
  onClose,
  title,
  description,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
}) {
  return (
    <Modal open={open} onClose={onClose} size="sm" hideCloseButton footer={<Button variant="secondary" onClick={onClose} className="w-full">Close</Button>}>
      <div className="flex flex-col items-center gap-3 py-2 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-error-bg text-error">
          <XCircle size={26} />
        </span>
        <h3 className="text-base font-semibold text-ink">{title}</h3>
        {description && <p className="text-sm text-muted">{description}</p>}
      </div>
    </Modal>
  );
}
