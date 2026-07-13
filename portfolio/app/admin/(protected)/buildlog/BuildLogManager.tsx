'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Eye, Pencil, Plus, Trash2, Hammer } from 'lucide-react';
import type { BuildLogEntry, BuildStatus } from '@/types';
import { CrudPage } from '@/components/admin/crud/CrudPage';
import { CrudHeader } from '@/components/admin/crud/CrudHeader';
import { CrudToolbar } from '@/components/admin/crud/CrudToolbar';
import { CrudSearch } from '@/components/admin/crud/CrudSearch';
import { CrudFilters } from '@/components/admin/crud/CrudFilters';
import { CrudEmptyState } from '@/components/admin/crud/CrudEmptyState';
import { MarkdownLite } from '@/components/admin/crud/MarkdownLite';
import { TagListInput } from '@/components/admin/crud/TagListInput';
import { Button } from '@/components/admin/ui/Button';
import { IconButton } from '@/components/admin/ui/IconButton';
import { Input } from '@/components/admin/ui/Input';
import { Textarea } from '@/components/admin/ui/Textarea';
import { Select } from '@/components/admin/ui/Select';
import { Badge, type BadgeTone } from '@/components/admin/ui/Badge';
import { Alert } from '@/components/admin/ui/Alert';
import { Chip } from '@/components/admin/ui/Chip';
import { fadeIn } from '@/components/admin/ui/motion-presets';

const STATUSES: BuildStatus[] = ['shipped', 'in-progress', 'planned'];
const STATUS_TONE: Record<BuildStatus, BadgeTone> = {
  shipped: 'success',
  'in-progress': 'info',
  planned: 'neutral',
};

interface FormState {
  date: string;
  title: string;
  summary: string;
  status: BuildStatus;
  tags: string[];
}
const EMPTY_FORM: FormState = { date: '', title: '', summary: '', status: 'shipped', tags: [] };

export default function BuildLogManager({ initial }: { initial: BuildLogEntry[] }) {
  const [items, setItems] = useState<BuildLogEntry[]>(initial);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [preview, setPreview] = useState(false);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<BuildStatus | 'all'>('all');

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));
  const resetForm = () => { setForm(EMPTY_FORM); setEditingId(null); setError(''); setShowForm(false); setPreview(false); };
  const startCreate = () => { setForm(EMPTY_FORM); setEditingId(null); setError(''); setShowForm(true); setPreview(false); };
  const startEdit = (b: BuildLogEntry) => {
    setForm({ date: b.date, title: b.title, summary: b.summary, status: b.status, tags: b.tags ?? [] });
    setEditingId(b.id); setError(''); setShowForm(true); setPreview(false);
  };

  const filtered = useMemo(() => {
    return items
      .filter((b) => statusFilter === 'all' || b.status === statusFilter)
      .filter((b) => {
        if (!query.trim()) return true;
        const q = query.toLowerCase();
        return b.title.toLowerCase().includes(q) || b.summary.toLowerCase().includes(q) || b.tags?.some((t) => t.toLowerCase().includes(q));
      });
  }, [items, query, statusFilter]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;
    setSaving(true); setError('');
    const url = editingId ? `/api/buildlog/${editingId}` : '/api/buildlog';
    try {
      const res = await fetch(url, {
        method: editingId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: form.date.trim(), title: form.title.trim(),
          summary: form.summary.trim(), status: form.status, tags: form.tags,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) { setError(data.error ?? 'Save failed'); setSaving(false); return; }
      const saved = data.data as BuildLogEntry;
      setItems((prev) => {
        const next = editingId ? prev.map((x) => (x.id === saved.id ? saved : x)) : [...prev, saved];
        return [...next].sort((a, b) => b.date.localeCompare(a.date));
      });
      resetForm();
    } catch { setError('Save failed.'); } finally { setSaving(false); }
  };

  const handleDelete = async (b: BuildLogEntry) => {
    if (!confirm(`Delete "${b.title}"?`)) return;
    const prev = items;
    setItems((list) => list.filter((x) => x.id !== b.id));
    try {
      const res = await fetch(`/api/buildlog/${b.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      if (editingId === b.id) resetForm();
    } catch { setItems(prev); setError('Delete failed.'); }
  };

  return (
    <CrudPage>
      <CrudHeader
        title="Build Log"
        description={`${items.length} ${items.length === 1 ? 'entry' : 'entries'}`}
        actions={
          <Button variant={showForm ? 'secondary' : 'primary'} icon={<Plus size={16} />} onClick={showForm ? resetForm : startCreate}>
            {showForm ? 'Close' : 'New Entry'}
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
            <h2 className="text-[var(--color-ink)] font-semibold">{editingId ? 'Edit entry' : 'New entry'}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input label="Date" required value={form.date} onChange={(e) => set('date', e.target.value)} placeholder="2026-07" hint="YYYY-MM or YYYY-MM-DD" />
              <Select
                label="Status"
                value={form.status}
                onChange={(e) => set('status', e.target.value as BuildStatus)}
                options={STATUSES.map((s) => ({ value: s, label: s }))}
              />
              <Input label="Title" required value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="Rebuilt portfolio architecture" />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="summary" className="text-sm font-medium text-[var(--color-ink)]">Summary</label>
                <button
                  type="button"
                  onClick={() => setPreview((p) => !p)}
                  className="inline-flex items-center gap-1.5 text-xs text-[var(--color-accent-400)] hover:text-[var(--color-accent-300)] transition-colors"
                >
                  <Eye size={13} /> {preview ? 'Edit' : 'Preview'}
                </button>
              </div>
              {preview ? (
                <div className="min-h-[6rem] rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-hover)] px-3.5 py-3">
                  <MarkdownLite text={form.summary} />
                </div>
              ) : (
                <Textarea id="summary" rows={4} value={form.summary} onChange={(e) => set('summary', e.target.value)} placeholder="What changed and why. Supports **bold**, *italic*, `code`, lists, and [links](url)." />
              )}
            </div>

            <TagListInput label="Tags" values={form.tags} onChange={(v) => set('tags', v)} placeholder="Add a tag and press Enter" />

            <div className="flex gap-3 pt-2">
              <Button type="submit" loading={saving}>{editingId ? 'Save changes' : 'Create'}</Button>
              <Button type="button" variant="secondary" onClick={resetForm}>Cancel</Button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      <CrudToolbar
        search={<CrudSearch value={query} onChange={(e) => setQuery(e.target.value)} onClear={() => setQuery('')} placeholder="Search entries…" />}
        filters={
          <CrudFilters>
            {(['all', ...STATUSES] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border transition-colors ${
                  statusFilter === s
                    ? 'bg-[var(--color-accent-500)] text-white border-[var(--color-accent-500)]'
                    : 'bg-[var(--color-surface)] text-[var(--color-muted)] border-[var(--color-border)] hover:border-[var(--color-border-hover)]'
                }`}
              >
                {s === 'all' ? 'All' : s}
              </button>
            ))}
          </CrudFilters>
        }
      />

      {filtered.length === 0 ? (
        <CrudEmptyState icon={<Hammer />} title="No build log entries" description={query || statusFilter !== 'all' ? 'No entries match your filters.' : 'Create your first entry to start the timeline.'} action={!showForm ? <Button size="sm" icon={<Plus size={14} />} onClick={startCreate}>New Entry</Button> : undefined} />
      ) : (
        <ol className="relative pl-6 sm:pl-8">
          <div aria-hidden="true" className="absolute left-[7px] sm:left-[11px] top-2 bottom-2 w-px bg-[var(--color-border)]" />
          {filtered.map((b) => (
            <li key={b.id} className="relative pb-6 last:pb-0">
              <span
                aria-hidden="true"
                className="absolute -left-6 sm:-left-8 top-1.5 w-3.5 h-3.5 rounded-full border-2 border-[var(--color-bg)] ring-2 ring-[var(--color-border)]"
                style={{ background: b.status === 'shipped' ? 'var(--color-success)' : b.status === 'in-progress' ? 'var(--color-accent-500)' : 'var(--color-faint)' }}
              />
              <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-4 hover:border-[var(--color-border-hover)] transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs text-[var(--color-faint)] tabular-nums">{b.date}</span>
                      <Badge tone={STATUS_TONE[b.status]} size="sm">{b.status}</Badge>
                    </div>
                    <h3 className="text-[var(--color-ink)] font-medium mt-1 truncate">{b.title}</h3>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <IconButton label="Edit" icon={<Pencil size={15} />} variant="ghost" onClick={() => startEdit(b)} />
                    <IconButton label="Delete" icon={<Trash2 size={15} />} variant="danger" onClick={() => handleDelete(b)} />
                  </div>
                </div>
                {b.summary && <div className="mt-2"><MarkdownLite text={b.summary} /></div>}
                {b.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {b.tags.map((t) => <Chip key={t} size="sm">{t}</Chip>)}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ol>
      )}
    </CrudPage>
  );
}
