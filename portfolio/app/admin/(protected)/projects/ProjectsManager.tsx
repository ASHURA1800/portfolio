'use client';

import { useMemo, useState } from 'react';
import type { Project, ProjectStatus, ProjectMetric } from '@/types';
import { CrudPage, CrudHeader, CrudEmptyState } from '@/components/admin/crud';
import { Button } from '@/components/admin/ui/Button';
import { DeleteDialog } from '@/components/admin/ui/ConfirmDialog';
import { ProjectsToolbar, ProjectsGrid, ProjectForm, type FormState } from '@/components/admin/projects';

const EMPTY_FORM: FormState = {
  title: '', slug: '', description: '', problem: '', solution: '', long_description: '',
  stack_reasoning: '', image: '', tech_stack: [], screenshots: [], learnings: [], challenges: [],
  metrics: [], github_url: '', live_url: '', category: '', status: 'concept', year: '',
  featured: false, case_study: false, order_index: 0,
};

function toForm(p: Project): FormState {
  return {
    title: p.title, slug: p.slug ?? '', description: p.description ?? '', problem: p.problem,
    solution: p.solution, long_description: p.long_description, stack_reasoning: p.stack_reasoning,
    image: p.image ?? '', tech_stack: p.tech_stack, screenshots: p.screenshots, learnings: p.learnings,
    challenges: p.challenges, metrics: p.metrics, github_url: p.github_url ?? '', live_url: p.live_url ?? '',
    category: p.category ?? '', status: p.status, year: p.year, featured: p.featured,
    case_study: p.case_study, order_index: p.order_index,
  };
}
function toPayload(f: FormState) {
  return {
    title: f.title.trim(), slug: f.slug.trim() || undefined, description: f.description.trim() || undefined,
    problem: f.problem.trim(), solution: f.solution.trim(), long_description: f.long_description.trim(),
    stack_reasoning: f.stack_reasoning.trim(), image: f.image.trim(), tech_stack: f.tech_stack,
    screenshots: f.screenshots, learnings: f.learnings, challenges: f.challenges,
    metrics: f.metrics.filter((m: ProjectMetric) => m.label.trim() && m.value.trim()),
    github_url: f.github_url.trim(), live_url: f.live_url.trim(), category: f.category.trim() || undefined,
    status: f.status, year: f.year.trim(), featured: f.featured, case_study: f.case_study,
    order_index: Number(f.order_index) || 0,
  };
}

export default function ProjectsManager({ initial }: { initial: Project[] }) {
  const [items, setItems] = useState<Project[]>(initial);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);

  // New, UI-only client-side state — search/filter/sort/view over the
  // already-loaded `items` array. No new API calls; the real /api/projects
  // GET route's page/limit params aren't touched by this.
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | ''>('');
  const [sort, setSort] = useState('order');
  const [view, setView] = useState<'grid' | 'list'>('grid');

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));
  const resetForm = () => { setForm(EMPTY_FORM); setEditingId(null); setError(''); setShowForm(false); };
  const startCreate = () => { setForm(EMPTY_FORM); setEditingId(null); setError(''); setShowForm(true); };
  const startEdit = (p: Project) => { setForm(toForm(p)); setEditingId(p.id); setError(''); setShowForm(true); };

  // ── Uploads → existing Vercel Blob pipeline — unchanged from audit ──────
  const uploadOne = async (file: File): Promise<string | null> => {
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/storage/projects', { method: 'POST', body: fd });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.success) { setError(data.error ?? 'Upload failed'); return null; }
    return data.data.url as string;
  };
  const handleCover = async (file: File) => {
    setUploading(true); setError('');
    const url = await uploadOne(file);
    if (url) set('image', url);
    setUploading(false);
  };
  const handleScreenshots = async (files: FileList) => {
    setUploading(true); setError('');
    const urls: string[] = [];
    for (const file of Array.from(files)) {
      const url = await uploadOne(file);
      if (url) urls.push(url);
    }
    if (urls.length) set('screenshots', [...form.screenshots, ...urls]);
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;
    setSaving(true); setError('');
    const url = editingId ? `/api/projects/${editingId}` : '/api/projects';
    try {
      const res = await fetch(url, {
        method: editingId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(toPayload(form)),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) { setError(data.error ?? 'Save failed'); setSaving(false); return; }
      const saved = data.data as Project;
      setItems((prev) => (editingId ? prev.map((x) => (x.id === saved.id ? saved : x)) : [...prev, saved]));
      resetForm();
    } catch { setError('Save failed.'); } finally { setSaving(false); }
  };

  const toggleFeatured = async (p: Project) => {
    const next = !p.featured;
    setItems((prev) => prev.map((x) => (x.id === p.id ? { ...x, featured: next } : x)));
    try {
      const res = await fetch(`/api/projects/${p.id}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: next }),
      });
      if (!res.ok) throw new Error();
    } catch {
      setItems((prev) => prev.map((x) => (x.id === p.id ? { ...x, featured: p.featured } : x)));
      setError('Could not update featured state.');
    }
  };

  // Same delete call as the audited original — only the confirmation UI
  // changed, from window.confirm() to the real DeleteDialog component.
  const confirmDelete = async () => {
    const p = deleteTarget;
    if (!p) return;
    const prev = items;
    setItems((list) => list.filter((x) => x.id !== p.id));
    try {
      const res = await fetch(`/api/projects/${p.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      if (editingId === p.id) resetForm();
    } catch {
      setItems(prev);
      setError('Delete failed.');
    }
  };

  // Client-side search/filter/sort — presentational only, doesn't touch
  // the real data or the CRUD logic above.
  const visibleItems = useMemo(() => {
    let list = items;
    if (statusFilter) list = list.filter((p) => p.status === statusFilter);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          (p.category ?? '').toLowerCase().includes(q) ||
          p.tech_stack.some((t) => t.toLowerCase().includes(q))
      );
    }
    const sorted = [...list];
    if (sort === 'title') sorted.sort((a, b) => a.title.localeCompare(b.title));
    else if (sort === 'year') sorted.sort((a, b) => (b.year ?? '').localeCompare(a.year ?? ''));
    else sorted.sort((a, b) => Number(b.featured) - Number(a.featured) || a.order_index - b.order_index);
    return sorted;
  }, [items, search, statusFilter, sort]);

  return (
    <CrudPage>
      <CrudHeader
        title="Projects"
        description={`${items.length} ${items.length === 1 ? 'project' : 'projects'} · drives the public Projects section & case studies`}
        actions={
          <Button variant="primary" onClick={showForm ? resetForm : startCreate}>
            {showForm ? 'Close' : '+ New Project'}
          </Button>
        }
      />

      <ProjectsToolbar
        search={search}
        onSearchChange={setSearch}
        status={statusFilter}
        onStatusChange={setStatusFilter}
        sort={sort}
        onSortChange={setSort}
        view={view}
        onViewChange={setView}
      />

      <ProjectForm
        open={showForm}
        editingId={editingId}
        form={form}
        set={set}
        error={error}
        saving={saving}
        uploading={uploading}
        onSubmit={handleSubmit}
        onClose={resetForm}
        onCover={handleCover}
        onScreenshots={handleScreenshots}
      />

      {items.length === 0 ? (
        <CrudEmptyState
          title="No projects yet"
          description="Create one to populate the public section."
          action={
            <Button variant="primary" onClick={startCreate}>
              + New Project
            </Button>
          }
        />
      ) : visibleItems.length === 0 ? (
        <CrudEmptyState title="No matches" description="Try a different search or filter." />
      ) : (
        <ProjectsGrid
          projects={visibleItems}
          view={view}
          onEdit={startEdit}
          onDelete={setDeleteTarget}
          onToggleFeatured={toggleFeatured}
        />
      )}

      <DeleteDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        itemName={deleteTarget?.title ?? ''}
        itemType="project"
      />
    </CrudPage>
  );
}
