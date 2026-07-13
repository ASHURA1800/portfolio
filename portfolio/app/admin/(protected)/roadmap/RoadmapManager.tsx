'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CheckCircle2, ListTodo, Pencil, Plus, Trash2 } from 'lucide-react';
import type { RoadmapItem, RoadmapStatus, RoadmapPriority } from '@/types';
import { CrudPage } from '@/components/admin/crud/CrudPage';
import { CrudHeader } from '@/components/admin/crud/CrudHeader';
import { CrudToolbar } from '@/components/admin/crud/CrudToolbar';
import { CrudSearch } from '@/components/admin/crud/CrudSearch';
import { CrudFilters } from '@/components/admin/crud/CrudFilters';
import { CrudEmptyState } from '@/components/admin/crud/CrudEmptyState';
import { TagListInput } from '@/components/admin/crud/TagListInput';
import { Button } from '@/components/admin/ui/Button';
import { IconButton } from '@/components/admin/ui/IconButton';
import { Input } from '@/components/admin/ui/Input';
import { Select } from '@/components/admin/ui/Select';
import { Badge, type BadgeTone } from '@/components/admin/ui/Badge';
import { Alert } from '@/components/admin/ui/Alert';
import { Progress } from '@/components/admin/ui/Progress';
import { fadeIn } from '@/components/admin/ui/motion-presets';

const STATUSES: RoadmapStatus[] = ['planned', 'in-progress', 'done'];
const PRIORITIES: RoadmapPriority[] = ['low', 'medium', 'high', 'critical'];
const STATUS_TONE: Record<RoadmapStatus, BadgeTone> = { planned: 'neutral', 'in-progress': 'info', done: 'success' };
const PRIORITY_TONE: Record<RoadmapPriority, BadgeTone> = { low: 'neutral', medium: 'info', high: 'warning', critical: 'error' };

interface FormState {
  task: string;
  status: RoadmapStatus;
  priority: RoadmapPriority;
  milestone: string;
  target_date: string;
  deliverables: string[];
  progress: number;
  order_index: number;
}
const EMPTY_FORM: FormState = { task: '', status: 'planned', priority: 'medium', milestone: '', target_date: '', deliverables: [], progress: 0, order_index: 0 };

export default function RoadmapManager({ initial }: { initial: RoadmapItem[] }) {
  const [items, setItems] = useState<RoadmapItem[]>(initial);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<RoadmapStatus | 'all'>('all');

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));
  const resetForm = () => { setForm(EMPTY_FORM); setEditingId(null); setError(''); setShowForm(false); };
  const startCreate = () => { setForm({ ...EMPTY_FORM, order_index: items.length }); setEditingId(null); setError(''); setShowForm(true); };
  const startEdit = (r: RoadmapItem) => {
    setForm({
      task: r.task, status: r.status, priority: r.priority, milestone: r.milestone,
      target_date: r.target_date, deliverables: r.deliverables ?? [], progress: r.progress, order_index: r.order_index,
    });
    setEditingId(r.id); setError(''); setShowForm(true);
  };

  const filtered = useMemo(() => {
    return items
      .filter((r) => statusFilter === 'all' || r.status === statusFilter)
      .filter((r) => {
        if (!query.trim()) return true;
        const q = query.toLowerCase();
        return r.task.toLowerCase().includes(q) || r.milestone.toLowerCase().includes(q);
      });
  }, [items, query, statusFilter]);

  const grouped = useMemo(() => {
    const map = new Map<string, RoadmapItem[]>();
    for (const item of filtered) {
      const key = item.milestone.trim() || 'Unassigned';
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(item);
    }
    return Array.from(map.entries());
  }, [filtered]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;
    setSaving(true); setError('');
    const url = editingId ? `/api/roadmap/${editingId}` : '/api/roadmap';
    try {
      const res = await fetch(url, {
        method: editingId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task: form.task.trim(), status: form.status, priority: form.priority,
          milestone: form.milestone.trim(), target_date: form.target_date.trim(),
          deliverables: form.deliverables, progress: form.progress, order_index: form.order_index,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) { setError(data.error ?? 'Save failed'); setSaving(false); return; }
      const saved = data.data as RoadmapItem;
      setItems((prev) => {
        const next = editingId ? prev.map((x) => (x.id === saved.id ? saved : x)) : [...prev, saved];
        return [...next].sort((a, b) => a.order_index - b.order_index);
      });
      resetForm();
    } catch { setError('Save failed.'); } finally { setSaving(false); }
  };

  const handleDelete = async (r: RoadmapItem) => {
    if (!confirm(`Delete "${r.task}"?`)) return;
    const prev = items;
    setItems((list) => list.filter((x) => x.id !== r.id));
    try {
      const res = await fetch(`/api/roadmap/${r.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      if (editingId === r.id) resetForm();
    } catch { setItems(prev); setError('Delete failed.'); }
  };

  return (
    <CrudPage>
      <CrudHeader
        title="Roadmap"
        description={`${items.length} ${items.length === 1 ? 'item' : 'items'}`}
        actions={
          <Button variant={showForm ? 'secondary' : 'primary'} icon={<Plus size={16} />} onClick={showForm ? resetForm : startCreate}>
            {showForm ? 'Close' : 'New Item'}
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
            <h2 className="text-[var(--color-ink)] font-semibold">{editingId ? 'Edit item' : 'New item'}</h2>
            <Input label="Task" required value={form.task} onChange={(e) => set('task', e.target.value)} placeholder="Migrate to React 19" />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Select label="Status" value={form.status} onChange={(e) => set('status', e.target.value as RoadmapStatus)} options={STATUSES.map((s) => ({ value: s, label: s }))} />
              <Select label="Priority" value={form.priority} onChange={(e) => set('priority', e.target.value as RoadmapPriority)} options={PRIORITIES.map((p) => ({ value: p, label: p }))} />
              <Input label="Milestone" value={form.milestone} onChange={(e) => set('milestone', e.target.value)} placeholder="Phase 7" />
              <Input label="Target date" value={form.target_date} onChange={(e) => set('target_date', e.target.value)} placeholder="2026-09" hint="YYYY-MM" />
            </div>

            <div>
              <label htmlFor="progress" className="text-sm font-medium text-[var(--color-ink)] mb-1.5 block">
                Progress — {form.progress}%
              </label>
              <input
                id="progress" type="range" min={0} max={100} step={5}
                value={form.progress}
                onChange={(e) => set('progress', Number(e.target.value))}
                className="w-full accent-[var(--color-accent-500)]"
              />
              <Progress value={form.progress} size="sm" className="mt-2" />
            </div>

            <TagListInput label="Deliverables" values={form.deliverables} onChange={(v) => set('deliverables', v)} placeholder="Add a deliverable and press Enter" />

            <div className="flex gap-3 pt-2">
              <Button type="submit" loading={saving}>{editingId ? 'Save changes' : 'Create'}</Button>
              <Button type="button" variant="secondary" onClick={resetForm}>Cancel</Button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      <CrudToolbar
        search={<CrudSearch value={query} onChange={(e) => setQuery(e.target.value)} onClear={() => setQuery('')} placeholder="Search roadmap…" />}
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
        <CrudEmptyState icon={<ListTodo />} title="No roadmap items" description={query || statusFilter !== 'all' ? 'No items match your filters.' : 'Add your first roadmap item.'} action={!showForm ? <Button size="sm" icon={<Plus size={14} />} onClick={startCreate}>New Item</Button> : undefined} />
      ) : (
        <div className="flex flex-col gap-6">
          {grouped.map(([milestone, rItems]) => (
            <div key={milestone}>
              <h2 className="text-sm font-semibold text-[var(--color-muted)] mb-3 flex items-center gap-2">
                {milestone}
                <span className="text-xs text-[var(--color-faint)] font-normal">
                  {rItems.filter((i) => i.status === 'done').length}/{rItems.length} done
                </span>
              </h2>
              <ul className="flex flex-col gap-3">
                {rItems.map((r) => (
                  <li key={r.id} className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-4 hover:border-[var(--color-border-hover)] transition-colors">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-1.5">
                          <Badge tone={STATUS_TONE[r.status]} size="sm" icon={r.status === 'done' ? <CheckCircle2 /> : undefined}>{r.status}</Badge>
                          <Badge tone={PRIORITY_TONE[r.priority]} size="sm">{r.priority}</Badge>
                          {r.target_date && <span className="text-xs text-[var(--color-faint)]">{r.target_date}</span>}
                        </div>
                        <p className="text-[var(--color-ink)] font-medium">{r.task}</p>
                        <div className="mt-2 max-w-xs">
                          <Progress value={r.progress} size="sm" showValue tone={r.status === 'done' ? 'success' : 'accent'} />
                        </div>
                        {r.deliverables?.length > 0 && (
                          <ul className="mt-3 space-y-1">
                            {r.deliverables.map((d, i) => (
                              <li key={i} className="text-xs text-[var(--color-muted)] flex items-start gap-1.5">
                                <span className="text-[var(--color-faint)] mt-0.5">•</span> {d}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <IconButton label="Edit" icon={<Pencil size={15} />} variant="ghost" onClick={() => startEdit(r)} />
                        <IconButton label="Delete" icon={<Trash2 size={15} />} variant="danger" onClick={() => handleDelete(r)} />
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </CrudPage>
  );
}
