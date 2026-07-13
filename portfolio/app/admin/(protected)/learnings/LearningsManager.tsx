'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { BookOpen, Eye, ExternalLink, Pencil, Plus, Trash2, X } from 'lucide-react';
import type { Learning, LearningDifficulty, LearningResource } from '@/types';
import { CrudPage } from '@/components/admin/crud/CrudPage';
import { CrudHeader } from '@/components/admin/crud/CrudHeader';
import { CrudToolbar } from '@/components/admin/crud/CrudToolbar';
import { CrudSearch } from '@/components/admin/crud/CrudSearch';
import { CrudFilters } from '@/components/admin/crud/CrudFilters';
import { CrudGrid } from '@/components/admin/crud/CrudGrid';
import { CrudEmptyState } from '@/components/admin/crud/CrudEmptyState';
import { MarkdownLite } from '@/components/admin/crud/MarkdownLite';
import { Button } from '@/components/admin/ui/Button';
import { IconButton } from '@/components/admin/ui/IconButton';
import { Input } from '@/components/admin/ui/Input';
import { Textarea } from '@/components/admin/ui/Textarea';
import { Select } from '@/components/admin/ui/Select';
import { Badge, type BadgeTone } from '@/components/admin/ui/Badge';
import { Alert } from '@/components/admin/ui/Alert';
import { fadeIn } from '@/components/admin/ui/motion-presets';

const DIFFICULTIES: LearningDifficulty[] = ['beginner', 'intermediate', 'advanced'];
const DIFFICULTY_TONE: Record<LearningDifficulty, BadgeTone> = {
  beginner: 'success',
  intermediate: 'warning',
  advanced: 'error',
};

interface FormState {
  title: string;
  description: string;
  category: string;
  difficulty: LearningDifficulty;
  resources: LearningResource[];
  order_index: number;
}
const EMPTY_FORM: FormState = { title: '', description: '', category: 'general', difficulty: 'beginner', resources: [], order_index: 0 };

export default function LearningsManager({ initial }: { initial: Learning[] }) {
  const [items, setItems] = useState<Learning[]>(initial);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [preview, setPreview] = useState(false);
  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [resourceDraft, setResourceDraft] = useState({ label: '', url: '' });

  const categories = useMemo(() => ['all', ...Array.from(new Set(items.map((i) => i.category)))], [items]);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));
  const resetForm = () => { setForm(EMPTY_FORM); setEditingId(null); setError(''); setShowForm(false); setPreview(false); setResourceDraft({ label: '', url: '' }); };
  const startCreate = () => { setForm({ ...EMPTY_FORM, order_index: items.length }); setEditingId(null); setError(''); setShowForm(true); setPreview(false); };
  const startEdit = (l: Learning) => {
    setForm({ title: l.title, description: l.description, category: l.category, difficulty: l.difficulty, resources: l.resources ?? [], order_index: l.order_index });
    setEditingId(l.id); setError(''); setShowForm(true); setPreview(false);
  };

  const addResource = () => {
    const label = resourceDraft.label.trim();
    const url = resourceDraft.url.trim();
    if (!label || !url) return;
    set('resources', [...form.resources, { label, url }]);
    setResourceDraft({ label: '', url: '' });
  };

  const filtered = useMemo(() => {
    return items
      .filter((l) => categoryFilter === 'all' || l.category === categoryFilter)
      .filter((l) => {
        if (!query.trim()) return true;
        const q = query.toLowerCase();
        return l.title.toLowerCase().includes(q) || l.description.toLowerCase().includes(q);
      });
  }, [items, query, categoryFilter]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;
    setSaving(true); setError('');
    const url = editingId ? `/api/learnings/${editingId}` : '/api/learnings';
    try {
      const res = await fetch(url, {
        method: editingId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title.trim(), description: form.description.trim(),
          category: form.category.trim() || 'general', difficulty: form.difficulty,
          resources: form.resources, order_index: form.order_index,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) { setError(data.error ?? 'Save failed'); setSaving(false); return; }
      const saved = data.data as Learning;
      setItems((prev) => {
        const next = editingId ? prev.map((x) => (x.id === saved.id ? saved : x)) : [...prev, saved];
        return [...next].sort((a, b) => a.order_index - b.order_index);
      });
      resetForm();
    } catch { setError('Save failed.'); } finally { setSaving(false); }
  };

  const handleDelete = async (l: Learning) => {
    if (!confirm(`Delete "${l.title}"?`)) return;
    const prev = items;
    setItems((list) => list.filter((x) => x.id !== l.id));
    try {
      const res = await fetch(`/api/learnings/${l.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      if (editingId === l.id) resetForm();
    } catch { setItems(prev); setError('Delete failed.'); }
  };

  return (
    <CrudPage>
      <CrudHeader
        title="Learnings"
        description={`${items.length} ${items.length === 1 ? 'card' : 'cards'}`}
        actions={
          <Button variant={showForm ? 'secondary' : 'primary'} icon={<Plus size={16} />} onClick={showForm ? resetForm : startCreate}>
            {showForm ? 'Close' : 'New Learning'}
          </Button>
        }
      />

      {error && <Alert variant="error" className="mb-6">{error}</Alert>}

      <AnimatePresence>
        {showForm && (
          <motion.form
            initial="hidden" animate="show" exit="exit" variants={fadeIn}
            onSubmit={handleSubmit}
            className="mb-8 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-6 space-y-4"
          >
            <h2 className="text-[var(--color-ink)] font-semibold">{editingId ? 'Edit learning' : 'New learning'}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input label="Title" required value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="Streaming SSR with React 19" />
              <Input label="Category" required value={form.category} onChange={(e) => set('category', e.target.value)} placeholder="frontend" />
              <Select
                label="Difficulty"
                value={form.difficulty}
                onChange={(e) => set('difficulty', e.target.value as LearningDifficulty)}
                options={DIFFICULTIES.map((d) => ({ value: d, label: d }))}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="description" className="text-sm font-medium text-[var(--color-ink)]">Description</label>
                <button type="button" onClick={() => setPreview((p) => !p)} className="inline-flex items-center gap-1.5 text-xs text-[var(--color-accent-400)] hover:text-[var(--color-accent-300)] transition-colors">
                  <Eye size={13} /> {preview ? 'Edit' : 'Preview'}
                </button>
              </div>
              {preview ? (
                <div className="min-h-[6rem] rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-hover)] px-3.5 py-3">
                  <MarkdownLite text={form.description} />
                </div>
              ) : (
                <Textarea id="description" rows={4} value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="What you learned. Supports **bold**, *italic*, `code`, lists, and [links](url)." />
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-[var(--color-ink)] mb-1.5 block">Resources</label>
              <div className="flex flex-col gap-2">
                {form.resources.map((r, i) => (
                  <div key={i} className="flex items-center gap-2 bg-[var(--color-surface-hover)] border border-[var(--color-border)] rounded-[var(--radius-md)] px-3 py-2">
                    <ExternalLink size={13} className="text-[var(--color-faint)] shrink-0" />
                    <span className="text-sm text-[var(--color-ink)] truncate">{r.label}</span>
                    <span className="text-xs text-[var(--color-faint)] truncate flex-1">{r.url}</span>
                    <IconButton label="Remove resource" icon={<X size={13} />} size="sm" variant="ghost" onClick={() => set('resources', form.resources.filter((_, idx) => idx !== i))} />
                  </div>
                ))}
                <div className="flex flex-col sm:flex-row gap-2">
                  <Input size="sm" value={resourceDraft.label} onChange={(e) => setResourceDraft((d) => ({ ...d, label: e.target.value }))} placeholder="Label" containerClassName="flex-1" />
                  <Input size="sm" value={resourceDraft.url} onChange={(e) => setResourceDraft((d) => ({ ...d, url: e.target.value }))} placeholder="https://…" containerClassName="flex-1" />
                  <Button type="button" size="sm" variant="secondary" onClick={addResource}>Add</Button>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="submit" loading={saving}>{editingId ? 'Save changes' : 'Create'}</Button>
              <Button type="button" variant="secondary" onClick={resetForm}>Cancel</Button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      <CrudToolbar
        search={<CrudSearch value={query} onChange={(e) => setQuery(e.target.value)} onClear={() => setQuery('')} placeholder="Search learnings…" />}
        filters={
          <CrudFilters>
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategoryFilter(c)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border transition-colors ${
                  categoryFilter === c
                    ? 'bg-[var(--color-accent-500)] text-white border-[var(--color-accent-500)]'
                    : 'bg-[var(--color-surface)] text-[var(--color-muted)] border-[var(--color-border)] hover:border-[var(--color-border-hover)]'
                }`}
              >
                {c === 'all' ? 'All' : c}
              </button>
            ))}
          </CrudFilters>
        }
      />

      {filtered.length === 0 ? (
        <CrudEmptyState icon={<BookOpen />} title="No learnings" description={query || categoryFilter !== 'all' ? 'No cards match your filters.' : 'Add your first learning card.'} action={!showForm ? <Button size="sm" icon={<Plus size={14} />} onClick={startCreate}>New Learning</Button> : undefined} />
      ) : (
        <CrudGrid cols={3}>
          {filtered.map((l) => (
            <div key={l.id} className="flex flex-col bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-4 hover:border-[var(--color-border-hover)] transition-colors">
              <div className="flex items-start justify-between gap-2 mb-2">
                <Badge tone="neutral" size="sm">{l.category}</Badge>
                <Badge tone={DIFFICULTY_TONE[l.difficulty]} size="sm">{l.difficulty}</Badge>
              </div>
              <h3 className="text-[var(--color-ink)] font-medium mb-1.5">{l.title}</h3>
              <div className="flex-1">
                <MarkdownLite text={l.description} />
              </div>
              {l.resources?.length > 0 && (
                <div className="flex flex-col gap-1 mt-3 pt-3 border-t border-[var(--color-border)]">
                  {l.resources.map((r, i) => (
                    <a key={i} href={r.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs text-[var(--color-accent-400)] hover:text-[var(--color-accent-300)] transition-colors truncate">
                      <ExternalLink size={11} className="shrink-0" /> {r.label}
                    </a>
                  ))}
                </div>
              )}
              <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-[var(--color-border)] justify-end">
                <IconButton label="Edit" icon={<Pencil size={14} />} size="sm" variant="ghost" onClick={() => startEdit(l)} />
                <IconButton label="Delete" icon={<Trash2 size={14} />} size="sm" variant="danger" onClick={() => handleDelete(l)} />
              </div>
            </div>
          ))}
        </CrudGrid>
      )}
    </CrudPage>
  );
}
