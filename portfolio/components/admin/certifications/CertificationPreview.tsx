'use client';

import type { Certification } from '@/types';
import { PreviewDialog } from '@/components/admin/ui/PreviewDialog';

interface CertificationPreviewProps {
  cert: Certification | null;
  onClose: () => void;
}

/** Full-size badge image preview for a certification, built on the shared
 *  PreviewDialog. No-ops (renders nothing) when there's no image or no
 *  cert selected, since emoji-icon-only certs have nothing to preview. */
export function CertificationPreview({ cert, onClose }: CertificationPreviewProps) {
  if (!cert || !cert.image) return null;
  return <PreviewDialog open={!!cert} onClose={onClose} src={cert.image} title={cert.title} />;
}
