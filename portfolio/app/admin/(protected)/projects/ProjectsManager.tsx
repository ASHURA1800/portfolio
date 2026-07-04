'use client';

import { useState } from 'react';
import type { Project, ProjectStatus, ProjectMetric } from '@/types';

const STATUSES: ProjectStatus[] = ['live', 'in-progress', 'archived', 'concept'];

const inputClass =
  'w-full bg-white/5 border border-white/8 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-violet-500/50 transition-all disabled:opacity-50';
const labelClass = 'block text-xs text-gray-500 mb-1.5 font-medium';

function TagInput({ label, tags, onChange, placeholder }: {
  label: string; tags: string[]; onChange: (t: string[]) => void; placeholder: string;
}) {
  const [draft, setDraft] = useState('');
  const add = () => {
    const v = draft.trim();
    if (!v || tags.some((t) => t.toLowerCase() === v.toLowerCase())) { setDraft(''); return; }
    onChange([...tags, v]); setDraft('');
  };
  return (
    <div>
      <label className={labelClass}>{label}</label>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {tags.map((t) => (
            <span key={t} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-violet-600/20 text-violet-300 text-xs">
              {t}
              <button type="button" onClick={() => onChange(tags.filter((x) => x !== t))} aria-label={`Remove ${t}`} className="text-violet-400 hover:text-white transition-colors">×</button>
            </span>
          ))}
        </div>
      )}
      <div className="flex gap-2">
        <input value={draft} onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); add(); } }}
          className={inputClass} placeholder={placeholder} />
        <button type="button" onClick={add} className="px-4 rounded-xl bg-white/5 border border-white/8 text-sm text-gray-300 hover:text-white hover:border-violet-500/50 transition-all">Add</button>
      </div>
    </div>
  );
}

interface FormState {
  title: string; slug: string; description: string; problem: string; solution: string;
  long_description: string; stack_reasoning: string; image: string; tech_stack: string[];
  screenshots: string[]; learnings: string[]; challenges: string[]; metrics: ProjectMetric[];
  github_url: string; live_url: string; category: string; status: ProjectStatus; year: string;
  featured: boolean; case_study: boolean; order_index: number;
}
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
    metrics: f.metrics.filter((m) => m.label.trim() && m.value.trim()),
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

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));
  const resetForm = () => { setForm(EMPTY_FORM); setEditingId(null); setError(''); setShowForm(false); };
  const startCreate = () => { setForm(EMPTY_FORM); setEditingId(null); setError(''); setShowForm(true); };
  const startEdit = (p: Project) => { setForm(toForm(p)); setEditingId(p.id); setError(''); setShowForm(true); };

  // ── Uploads → existing Vercel Blob pipeline ─────────────────────────────────
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

  // ── Metrics editor ──────────────────────────────────────────────────────────
  const setMetric = (i: number, key: keyof ProjectMetric, value: string) =>
    set('metrics', form.metrics.map((m, idx) => (idx === i ? { ...m, [key]: value } : m)));
  const addMetric = () => set('metrics', [...form.metrics, { label: '', value: '' }]);
  const removeMetric = (i: number) => set('metrics', form.metrics.filter((_, idx) => idx !== i));

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

  const handleDelete = async (p: Project) => {
    if (!confirm(`Delete "${p.title}"? This cannot be undone.`)) return;
    const prev = items;
    setItems((list) => list.filter((x) => x.id !== p.id));
    try {
      const res = await fetch(`/api/projects/${p.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      if (editingId === p.id) resetForm();
    } catch { setItems(prev); setError('Delete failed.'); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold text-white">Projects</h1>
        <button onClick={showForm ? resetForm : startCreate} className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white text-sm font-semibold hover:opacity-90 transition-opacity">
          {showForm ? 'Close' : '+ New Project'}
        </button>
      </div>
      <p className="text-gray-500 text-sm mb-8">{items.length} {items.length === 1 ? 'project' : 'projects'} · drives the public Projects section & case studies</p>

      {error && <div role="alert" className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 bg-white/5 border border-white/8 rounded-2xl p-6 space-y-4">
          <h2 className="text-white font-semibold">{editingId ? 'Edit project' : 'New project'}</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label htmlFor="title" className={labelClass}>Title</label><input id="title" required value={form.title} onChange={(e) => set('title', e.target.value)} className={inputClass} /></div>
            <div><label htmlFor="slug" className={labelClass}>Slug (for /projects/&lt;slug&gt;)</label><input id="slug" value={form.slug} onChange={(e) => set('slug', e.target.value)} className={inputClass} placeholder="my-project" /></div>
          </div>

          <div><label htmlFor="description" className={labelClass}>Short description</label><input id="description" value={form.description} onChange={(e) => set('description', e.target.value)} className={inputClass} /></div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label htmlFor="problem" className={labelClass}>Problem</label><textarea id="problem" rows={3} value={form.problem} onChange={(e) => set('problem', e.target.value)} className={inputClass} /></div>
            <div><label htmlFor="solution" className={labelClass}>Solution</label><textarea id="solution" rows={3} value={form.solution} onChange={(e) => set('solution', e.target.value)} className={inputClass} /></div>
          </div>

          <div><label htmlFor="long_description" className={labelClass}>Long description (detail page body)</label><textarea id="long_description" rows={4} value={form.long_description} onChange={(e) => set('long_description', e.target.value)} className={inputClass} /></div>
          <div><label htmlFor="stack_reasoning" className={labelClass}>Stack reasoning (why this stack)</label><textarea id="stack_reasoning" rows={2} value={form.stack_reasoning} onChange={(e) => set('stack_reasoning', e.target.value)} className={inputClass} /></div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div><label htmlFor="category" className={labelClass}>Category</label><input id="category" value={form.category} onChange={(e) => set('category', e.target.value)} className={inputClass} placeholder="FinTech" /></div>
            <div>
              <label htmlFor="status" className={labelClass}>Status</label>
              <select id="status" value={form.status} onChange={(e) => set('status', e.target.value as ProjectStatus)} className={inputClass}>
                {STATUSES.map((s) => <option key={s} value={s} className="bg-gray-900">{s}</option>)}
              </select>
            </div>
            <div><label htmlFor="year" className={labelClass}>Year</label><input id="year" value={form.year} onChange={(e) => set('year', e.target.value)} className={inputClass} placeholder="2025" /></div>
            <div><label htmlFor="order_index" className={labelClass}>Order</label><input id="order_index" type="number" value={form.order_index} onChange={(e) => set('order_index', Number(e.target.value))} className={inputClass} /></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label htmlFor="github_url" className={labelClass}>GitHub URL</label><input id="github_url" type="url" value={form.github_url} onChange={(e) => set('github_url', e.target.value)} className={inputClass} placeholder="https://github.com/…" /></div>
            <div><label htmlFor="live_url" className={labelClass}>Live URL</label><input id="live_url" type="url" value={form.live_url} onChange={(e) => set('live_url', e.target.value)} className={inputClass} placeholder="https://…" /></div>
          </div>

          <TagInput label="Tech stack" tags={form.tech_stack} onChange={(t) => set('tech_stack', t)} placeholder="Add a technology" />
          <TagInput label="Learnings" tags={form.learnings} onChange={(t) => set('learnings', t)} placeholder="Add a learning" />
          <TagInput label="Challenges" tags={form.challenges} onChange={(t) => set('challenges', t)} placeholder="Add a challenge" />

          {/* Metrics */}
          <div>
            <label className={labelClass}>Metrics</label>
            <div className="space-y-2">
              {form.metrics.map((m, i) => (
                <div key={i} className="flex gap-2">
                  <input value={m.label} onChange={(e) => setMetric(i, 'label', e.target.value)} className={inputClass} placeholder="Label (e.g. Users)" />
                  <input value={m.value} onChange={(e) => setMetric(i, 'value', e.target.value)} className={inputClass} placeholder="Value (e.g. 10k)" />
                  <button type="button" onClick={() => removeMetric(i)} aria-label="Remove metric" className="px-3 rounded-xl bg-white/5 border border-white/8 text-gray-500 hover:text-red-400 transition-all">×</button>
                </div>
              ))}
              <button type="button" onClick={addMetric} className="text-xs text-violet-400 hover:text-violet-300">+ Add metric</button>
            </div>
          </div>

          {/* Cover image */}
          <div>
            <label htmlFor="cover" className={labelClass}>Cover image</label>
            <div className="flex items-center gap-4">
              {form.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={form.image} alt="Cover preview" className="h-16 w-16 rounded-lg object-cover border border-white/8" />
              )}
              <div className="flex-1">
                <input id="cover" type="file" accept="image/png,image/jpeg,image/webp,image/gif" disabled={uploading}
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) handleCover(f); }}
                  className="block w-full text-sm text-gray-400 file:mr-3 file:rounded-lg file:border-0 file:bg-violet-600/20 file:px-3 file:py-2 file:text-sm file:text-violet-300 hover:file:bg-violet-600/30 disabled:opacity-50" />
                {form.image && <button type="button" onClick={() => set('image', '')} className="text-xs text-gray-500 hover:text-red-400 mt-1 transition-colors">Remove cover</button>}
              </div>
            </div>
          </div>

          {/* Screenshots */}
          <div>
            <label htmlFor="screenshots" className={labelClass}>Screenshots</label>
            {form.screenshots.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {form.screenshots.map((src) => (
                  <div key={src} className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt="Screenshot" className="h-16 w-24 rounded-lg object-cover border border-white/8" />
                    <button type="button" onClick={() => set('screenshots', form.screenshots.filter((s) => s !== src))} aria-label="Remove screenshot" className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-gray-900 border border-white/8 text-gray-400 hover:text-red-400 text-xs">×</button>
                  </div>
                ))}
              </div>
            )}
            <input id="screenshots" type="file" multiple accept="image/png,image/jpeg,image/webp,image/gif" disabled={uploading}
              onChange={(e) => { const fs = e.target.files; if (fs && fs.length) handleScreenshots(fs); }}
              className="block w-full text-sm text-gray-400 file:mr-3 file:rounded-lg file:border-0 file:bg-violet-600/20 file:px-3 file:py-2 file:text-sm file:text-violet-300 hover:file:bg-violet-600/30 disabled:opacity-50" />
            {uploading && <p className="text-xs text-gray-500 mt-1">Uploading…</p>}
          </div>

          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2 text-sm text-gray-300">
              <input type="checkbox" checked={form.featured} onChange={(e) => set('featured', e.target.checked)} className="h-4 w-4 rounded border-white/8 bg-white/5 accent-violet-600" />
              Featured
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-300">
              <input type="checkbox" checked={form.case_study} onChange={(e) => set('case_study', e.target.checked)} className="h-4 w-4 rounded border-white/8 bg-white/5 accent-violet-600" />
              Case study (needs a slug)
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving || uploading} className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white text-sm font-semibold disabled:opacity-70 hover:opacity-90 transition-opacity">{saving ? 'Saving…' : editingId ? 'Save changes' : 'Create'}</button>
            <button type="button" onClick={resetForm} className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/8 text-sm text-gray-300 hover:text-white transition-all">Cancel</button>
          </div>
        </form>
      )}

      {items.length === 0 ? (
        <div className="p-8 text-center bg-white/5 border border-white/8 rounded-2xl text-gray-500 text-sm">No projects yet. Create one to populate the public section.</div>
      ) : (
        <ul className="space-y-3">
          {items.map((p) => (
            <li key={p.id} className="flex items-center gap-4 bg-white/5 border border-white/8 rounded-2xl p-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-white font-medium truncate">{p.title}</span>
                  {p.featured && <span className="px-2 py-0.5 rounded-md bg-violet-600/20 text-violet-300 text-[10px] uppercase tracking-wide">Featured</span>}
                  {p.case_study && <span className="px-2 py-0.5 rounded-md bg-white/8 text-gray-400 text-[10px] uppercase tracking-wide">Case study</span>}
                </div>
                <div className="text-gray-500 text-sm truncate">{p.category ?? 'Uncategorised'} · {p.status} {p.year ? `· ${p.year}` : ''} {p.slug ? `· /${p.slug}` : ''}</div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => toggleFeatured(p)} aria-pressed={p.featured} title={p.featured ? 'Unfeature' : 'Feature'} className={`px-2.5 py-1.5 rounded-lg text-sm transition-all ${p.featured ? 'bg-violet-600/20 text-violet-300' : 'bg-white/5 text-gray-500 hover:text-white'}`}>★</button>
                <button onClick={() => startEdit(p)} className="px-3 py-1.5 rounded-lg bg-white/5 text-gray-300 text-sm hover:text-white hover:bg-white/8 transition-all">Edit</button>
                <button onClick={() => handleDelete(p)} className="px-3 py-1.5 rounded-lg bg-white/5 text-gray-500 text-sm hover:text-red-400 hover:bg-red-500/10 transition-all">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
