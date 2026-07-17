'use client';

import { useCallback, useEffect, useId, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';
import { X, ChevronDown } from 'lucide-react';
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

/** Section divider with label — purely visual, no logic. */
function SectionHeader({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 pt-2">
      <span className="text-[11px] font-semibold uppercase tracking-widest text-[var(--color-faint)]">
        {label}
      </span>
      <div className="flex-1 h-px bg-[var(--color-border)]" />
    </div>
  );
}

/** Collapsible wrapper for the Order field — hides visual clutter without
 *  removing backend support. State is local; no logic changes. */
function AdvancedSettings({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 text-xs text-[var(--color-faint)] hover:text-[var(--color-ink)] transition-colors w-fit"
        aria-expanded={open}
      >
        <ChevronDown
          size={13}
          className="transition-transform duration-150"
          style={{ transform: open ? 'rotate(0deg)' : 'rotate(-90deg)' }}
        />
        Advanced settings
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-1">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
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
            {/* ── Header ── */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border)] shrink-0">
              <h2 id={titleId} className="text-[var(--color-ink)] font-semibold">
                {editingId ? 'Edit project' : 'New project'}
              </h2>
              <IconButton label="Close" icon={<X size={16} />} variant="ghost" onClick={handleClose} />
            </div>

            <form onSubmit={onSubmit} className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-5">
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

              {/* ── Basic Information ── */}
              <SectionHeader label="Basic Information" />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

              {/* ── Project Details ── */}
              <SectionHeader label="Project Details" />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

              {/* ── Metadata ── */}
              <SectionHeader label="Metadata" />

              {/*
                Desktop: 3 cols — Category | Status | Year
                Tablet:  2 cols
                Mobile:  1 col
                Select uses size="lg" (h-12) to match FloatingField height.
              */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <FloatingField
                  label="Category"
                  value={form.category}
                  onChange={(e) => set('category', e.target.value)}
                  placeholder="FinTech"
                />
                <Select
                  label="Status"
                  size="lg"
                  value={form.status}
                  onChange={(e) => set('status', e.target.value as ProjectStatus)}
                  options={STATUS_OPTIONS}
                />
                <FloatingField
                  label="Year"
                  value={form.year}
                  onChange={(e) => set('year', e.target.value)}
                  placeholder="2025"
                />
              </div>

              {/* ── Links ── */}
              <SectionHeader label="Links" />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FloatingField label="GitHub URL" type="url" value={form.github_url} onChange={(e) => set('github_url', e.target.value)} />
                <FloatingField label="Live URL" type="url" value={form.live_url} onChange={(e) => set('live_url', e.target.value)} />
              </div>

              {/* ── Technology ── */}
              <SectionHeader label="Technology" />

              <ProjectTags label="Tech stack" tags={form.tech_stack} onChange={(t) => set('tech_stack', t)} placeholder="Add a technology" />

              {/* ── Learnings & Challenges ── */}
              <SectionHeader label="Learnings & Challenges" />

              <ProjectTags label="Learnings" tags={form.learnings} onChange={(t) => set('learnings', t)} placeholder="Add a learning" />
              <ProjectTags label="Challenges" tags={form.challenges} onChange={(t) => set('challenges', t)} placeholder="Add a challenge" />

              {/* ── Metrics ── */}
              <SectionHeader label="Metrics" />

              <div className="flex flex-col gap-3">
                {form.metrics.map((m, i) => (
                  <div key={i} className="grid grid-cols-[1fr_1fr_auto] items-start gap-3">
                    <FloatingField
                      label="Metric name"
                      value={m.label}
                      onChange={(e) => setMetric(i, 'label', e.target.value)}
                      placeholder="Users"
                    />
                    <FloatingField
                      label="Metric value"
                      value={m.value}
                      onChange={(e) => setMetric(i, 'value', e.target.value)}
                      placeholder="10k"
                    />
                    <div className="pt-[26px]">
                      <IconButton
                        label="Remove metric"
                        icon={<X size={14} />}
                        variant="ghost"
                        onClick={() => removeMetric(i)}
                      />
                    </div>
                  </div>
                ))}
                <Button type="button" variant="ghost" size="sm" onClick={addMetric} className="w-fit">
                  + Add metric
                </Button>
              </div>

              {/* ── Media ── */}
              <SectionHeader label="Media" />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ImageUploader
                  label="Cover image"
                  value={form.image}
                  uploading={uploading}
                  onFiles={(files) => onCover(files[0])}
                  onRemove={() => set('image', '')}
                />
                <ImageUploader
                  label="Screenshots"
                  multiple
                  values={form.screenshots}
                  uploading={uploading}
                  onFiles={onScreenshots}
                  onRemove={(src) => src && set('screenshots', form.screenshots.filter((s) => s !== src))}
                />
              </div>

              {/* ── Visibility ── */}
              <SectionHeader label="Visibility" />

              <div className="flex flex-wrap gap-6">
                <Switch label="Featured" checked={form.featured} onChange={(e) => set('featured', e.target.checked)} />
                <Switch label="Case study" description="Needs a slug" checked={form.case_study} onChange={(e) => set('case_study', e.target.checked)} />
              </div>

              {/* ── Advanced (Order field hidden from normal view) ── */}
              <AdvancedSettings>
                <FloatingField
                  label="Order"
                  type="number"
                  value={form.order_index}
                  onChange={(e) => set('order_index', Number(e.target.value))}
                  className="max-w-[160px]"
                />
              </AdvancedSettings>

              {/* ── Actions ── */}
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
