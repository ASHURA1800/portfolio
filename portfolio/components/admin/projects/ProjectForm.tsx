'use client';

import { useCallback, useEffect, useId, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';
import { X } from 'lucide-react';
import type { ProjectStatus, ProjectMetric } from '@/types';
import { backdropFade, drawerSlide } from '@/components/admin/ui/motion-presets';
import { useFocusTrap } from '@/components/admin/ui/useFocusTrap';
import { FloatingField } from '@/components/admin/profile/FloatingField';
import { FloatingTextarea } from '@/components/admin/profile/FloatingTextarea';
import { Select } from '@/components/admin/ui/Select';
import { Switch } from '@/components/admin/ui/Switch';
import { Button } from '@/components/admin/ui/Button';
import { IconButton } from '@/components/admin/ui/IconButton';
import { Alert } from '@/components/admin/ui/Alert';
import { ProjectTags } from './ProjectTags';
import { ImageUploader } from './ImageUploader';
import { ProjectPreview } from './ProjectPreview';

const STATUSES: ProjectStatus[] = ['live', 'in-progress', 'archived', 'concept'];
const STATUS_OPTIONS = STATUSES.map((s) => ({ value: s, label: s }));

// Unchanged from the audited ProjectsManager.
export interface FormState {
  title: string; slug: string; description: string; problem: string; solution: string;
  long_description: string; stack_reasoning: string; image: string; tech_stack: string[];
  screenshots: string[]; learnings: string[]; challenges: string[]; metrics: ProjectMetric[];
  github_url: string; live_url: string; category: string; status: ProjectStatus; year: string;
  featured: boolean; case_study: boolean; order_index: number;
}

export interface ProjectFormProps {
  open: boolean;
  editingId: string | null;
  form: FormState;
  set: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
  error: string;
  saving: boolean;
  uploading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
  onCover: (file: File) => void;
  onScreenshots: (files: FileList) => void;
}

/** Wide slide-over editing panel. All form state, upload calls, and the
 *  submit handler are owned by the parent (ProjectsManager) exactly as in
 *  the audited original — this component only renders the fields. Built
 *  on the same backdropFade/drawerSlide motion presets the real Drawer
 *  component uses, at a wider max-width since this form has ~20 fields
 *  plus tag/metric/image editors. */
export function ProjectForm({
  open,
  editingId,
  form,
  set,
  error,
  saving,
  uploading,
  onSubmit,
  onClose,
  onCover,
  onScreenshots,
}: ProjectFormProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const titleId = useId();
  const handleClose = useCallback(() => onClose(), [onClose]);
  const containerRef = useFocusTrap<HTMLDivElement>(open, handleClose);

  const setMetric = (i: number, key: keyof ProjectMetric, value: string) =>
    set('metrics', form.metrics.map((m, idx) => (idx === i ? { ...m, [key]: value } : m)));
  const addMetric = () => set('metrics', [...form.metrics, { label: '', value: '' }]);
  const removeMetric = (i: number) => set('metrics', form.metrics.filter((_, idx) => idx !== i));

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100]">
          <motion.div
            variants={backdropFade}
            initial="hidden"
            animate="show"
            exit="exit"
            className="absolute inset-0 bg-black/60"
            onClick={handleClose}
          />
          <motion.div
            ref={containerRef}
            variants={drawerSlide}
            initial="hidden"
            animate="show"
            exit="exit"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="absolute right-0 top-0 h-full w-full max-w-3xl bg-[var(--color-bg)] border-l border-[var(--color-border)] shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border)] shrink-0">
              <h2 id={titleId} className="text-[var(--color-ink)] font-semibold">
                {editingId ? 'Edit project' : 'New project'}
              </h2>
              <IconButton label="Close" icon={<X size={16} />} variant="ghost" onClick={handleClose} />
            </div>

            <form onSubmit={onSubmit} className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-6">
              <AnimatePresence mode="wait">
                {error && (
                  <Alert variant="error" key="project-form-error">
                    {error}
                  </Alert>
                )}
              </AnimatePresence>

              <ProjectPreview
                title={form.title}
                description={form.description}
                image={form.image}
                techStack={form.tech_stack}
                status={form.status}
                featured={form.featured}
                githubUrl={form.github_url}
                liveUrl={form.live_url}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FloatingField label="Title" required value={form.title} onChange={(e) => set('title', e.target.value)} />
                <FloatingField
                  label="Slug"
                  hint="for /projects/<slug>"
                  value={form.slug}
                  onChange={(e) => set('slug', e.target.value)}
                  placeholder="my-project"
                />
              </div>

              <FloatingField
                label="Short description"
                value={form.description}
                onChange={(e) => set('description', e.target.value)}
                maxLength={160}
                showCount
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FloatingTextarea label="Problem" value={form.problem} onChange={(e) => set('problem', e.target.value)} />
                <FloatingTextarea label="Solution" value={form.solution} onChange={(e) => set('solution', e.target.value)} />
              </div>

              <FloatingTextarea
                label="Long description"
                hint="Detail page body"
                rows={4}
                value={form.long_description}
                onChange={(e) => set('long_description', e.target.value)}
              />
              <FloatingTextarea
                label="Stack reasoning"
                hint="Why this stack"
                rows={2}
                value={form.stack_reasoning}
                onChange={(e) => set('stack_reasoning', e.target.value)}
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <FloatingField label="Category" value={form.category} onChange={(e) => set('category', e.target.value)} placeholder="FinTech" />
                <Select
                  label="Status"
                  size="lg"
                  value={form.status}
                  onChange={(e) => set('status', e.target.value as ProjectStatus)}
                  options={STATUS_OPTIONS}
                />
                <FloatingField label="Year" value={form.year} onChange={(e) => set('year', e.target.value)} placeholder="2025" />
                {/* Order hidden from UI — backend/validation unchanged */}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FloatingField label="GitHub URL" type="url" value={form.github_url} onChange={(e) => set('github_url', e.target.value)} />
                <FloatingField label="Live URL" type="url" value={form.live_url} onChange={(e) => set('live_url', e.target.value)} />
              </div>

              <ProjectTags label="Tech stack" tags={form.tech_stack} onChange={(t) => set('tech_stack', t)} placeholder="Add a technology" />
              <ProjectTags label="Learnings" tags={form.learnings} onChange={(t) => set('learnings', t)} placeholder="Add a learning" />
              <ProjectTags label="Challenges" tags={form.challenges} onChange={(t) => set('challenges', t)} placeholder="Add a challenge" />

              <div className="flex flex-col gap-2">
                <label className="text-xs text-[var(--color-faint)] font-medium">Metrics</label>
                <div className="flex flex-col gap-2">
                  {form.metrics.map((m, i) => (
                    <div key={i} className="grid grid-cols-[1fr_1fr_auto] items-end gap-3">
                      <FloatingField label="Label" value={m.label} onChange={(e) => setMetric(i, 'label', e.target.value)} placeholder="Users" />
                      <FloatingField label="Value" value={m.value} onChange={(e) => setMetric(i, 'value', e.target.value)} placeholder="10k" />
                      <div className="pb-[3px]">
                        <IconButton label="Remove metric" icon={<X size={14} />} variant="ghost" onClick={() => removeMetric(i)} />
                      </div>
                    </div>
                  ))}
                  <Button type="button" variant="ghost" size="sm" onClick={addMetric} className="w-fit">
                    + Add metric
                  </Button>
                </div>
              </div>

              <ImageUploader label="Cover image" value={form.image} uploading={uploading} onFiles={(files) => onCover(files[0])} onRemove={() => set('image', '')} />
              <ImageUploader
                label="Screenshots"
                multiple
                values={form.screenshots}
                uploading={uploading}
                onFiles={onScreenshots}
                onRemove={(src) => src && set('screenshots', form.screenshots.filter((s) => s !== src))}
              />

              <div className="flex flex-wrap gap-6">
                <Switch label="Featured" checked={form.featured} onChange={(e) => set('featured', e.target.checked)} />
                <Switch label="Case study" description="Needs a slug" checked={form.case_study} onChange={(e) => set('case_study', e.target.checked)} />
              </div>

              <div className="flex gap-3 pt-2 pb-2">
                <Button type="submit" variant="primary" loading={saving} disabled={uploading}>
                  {saving ? 'Saving…' : editingId ? 'Save changes' : 'Create'}
                </Button>
                <Button type="button" variant="secondary" onClick={handleClose}>
                  Cancel
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
