'use client';

import { AnimatePresence, motion } from 'motion/react';
import type { Certification } from '@/types';
import { fadeIn } from '@/components/admin/ui/motion-presets';
import { Input } from '@/components/admin/ui/Input';
import { Textarea } from '@/components/admin/ui/Textarea';
import { Button } from '@/components/admin/ui/Button';
import { Switch } from '@/components/admin/ui/Switch';
import { TagInput } from '@/components/admin/ui/TagInput';
import { ImageUploader } from '@/components/admin/projects/ImageUploader';
import { Alert } from '@/components/admin/ui/Alert';

export interface CertFormState {
  title: string;
  issuer: string;
  description: string;
  image: string;
  icon: string;
  issued_date: string;
  expiry_date: string;
  credential_url: string;
  skills: string[];
  is_featured: boolean;
  order_index: number;
}

export const EMPTY_CERT_FORM: CertFormState = {
  title: '', issuer: '', description: '', image: '', icon: '🏆',
  issued_date: '', expiry_date: '', credential_url: '', skills: [], is_featured: false, order_index: 0,
};

/** Certification → editable form state. */
export function toForm(c: Certification): CertFormState {
  return {
    title: c.title,
    issuer: c.issuer,
    description: c.description ?? '',
    image: c.image ?? '',
    icon: c.icon || '🏆',
    issued_date: c.issued_date ?? '',
    expiry_date: c.expiry_date ?? '',
    credential_url: c.credential_url ?? '',
    skills: c.skills ?? [],
    is_featured: c.is_featured,
    order_index: c.order_index,
  };
}

interface CertificationFormProps {
  open: boolean;
  editing: boolean;
  form: CertFormState;
  saving: boolean;
  uploading: boolean;
  error: string;
  onChange: <K extends keyof CertFormState>(key: K, value: CertFormState[K]) => void;
  onUpload: (file: File) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

/** Slide-down create/edit form for a certification entry. */
export function CertificationForm({ open, editing, form, saving, uploading, error, onChange, onUpload, onSubmit, onCancel }: CertificationFormProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.form
          initial="hidden" animate="show" exit="exit" variants={fadeIn}
          onSubmit={onSubmit}
          className="mb-8 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-6 space-y-4"
        >
          <h2 className="text-[var(--color-ink)] font-semibold">{editing ? 'Edit certification' : 'New certification'}</h2>

          {error && <Alert variant="error">{error}</Alert>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Title" required value={form.title} onChange={(e) => onChange('title', e.target.value)} placeholder="AWS Certified Solutions Architect" />
            <Input label="Issuer" required value={form.issuer} onChange={(e) => onChange('issuer', e.target.value)} placeholder="Amazon Web Services" />
          </div>

          <Textarea label="Description" rows={3} value={form.description} onChange={(e) => onChange('description', e.target.value)} placeholder="What this credential covers." />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input label="Icon (emoji)" value={form.icon} onChange={(e) => onChange('icon', e.target.value)} placeholder="🏆" maxLength={4} />
            <Input label="Issued date" type="date" value={form.issued_date} onChange={(e) => onChange('issued_date', e.target.value)} />
            <Input label="Expiry date" type="date" value={form.expiry_date} onChange={(e) => onChange('expiry_date', e.target.value)} hint="Leave blank if it doesn't expire" />
          </div>

          <Input label="Credential URL" value={form.credential_url} onChange={(e) => onChange('credential_url', e.target.value)} placeholder="https://credly.com/..." />

          <ImageUploader
            label="Badge image"
            value={form.image}
            uploading={uploading}
            onFiles={(files) => files[0] && onUpload(files[0])}
            onRemove={() => onChange('image', '')}
          />

          <TagInput label="Skills" values={form.skills} onChange={(v) => onChange('skills', v)} placeholder="Add a skill and press Enter" />

          <div className="flex items-center gap-6">
            <Switch label="Featured" checked={form.is_featured} onChange={(e) => onChange('is_featured', e.target.checked)} />
            <Input label="Order" type="number" value={form.order_index} onChange={(e) => onChange('order_index', Number(e.target.value))} containerClassName="w-28" />
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit" loading={saving}>{editing ? 'Save changes' : 'Create'}</Button>
            <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
