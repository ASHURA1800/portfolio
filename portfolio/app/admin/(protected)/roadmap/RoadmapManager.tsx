'use client';

import { useState } from 'react';
import type { RoadmapItem, RoadmapStatus } from '@/types';

const STATUSES: RoadmapStatus[] = ['planned', 'in-progress', 'done'];

interface FormState { task: string; status: RoadmapStatus; order_index: number }
const EMPTY_FORM: FormState = { task: '', status: 'planned', order_index: 0 };

const inputClass =
  'w-full bg-white/5 border border-white/8 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-violet-500/50 transition-all disabled:opacity-50';
const labelClass = 'block text-xs text-gray-500 mb-1.5 font-medium';

export default function RoadmapManager({ initial }: { initial: RoadmapItem[] }) {
  const [items, setItems] = useState<RoadmapItem[]>(initial);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));
  const resetForm = () => { setForm(EMPTY_FORM); setEditingId(null); setError(''); setShowForm(false); };
  const startCreate = () => { setForm(EMPTY_FORM); setEditingId(null); setError(''); setShowForm(true); };
  const startEdit = (r: RoadmapItem) => {
    setForm({ task: r.task, status: r.status, order_index: r.order_index });
    setEditingId(r.id); setError(''); setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;
    setSaving(true); setError('');
    const url = editingId ? `/api/roadmap/${editingId}` : '/api/roadmap';
    try {
      const res = await fetch(url, {
        method: editingId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task: form.task.trim(), status: form.status, order_index: Number(form.order_index) || 0 }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) { setError(data.error ?? 'Save failed'); setSaving(false); return; }
      const saved = data.data as RoadmapItem;
      setItems((prev) => (editingId ? prev.map((x) => (x.id === saved.id ? saved : x)) : [...prev, saved]));
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
    <div>
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold text-white">Roadmap</h1>
        <button onClick={showForm ? resetForm : startCreate} className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white text-sm font-semibold hover:opacity-90 transition-opacity">
          {showForm ? 'Close' : '+ New Item'}
        </button>
      </div>
      <p className="text-gray-500 text-sm mb-8">{items.length} {items.length === 1 ? 'item' : 'items'} · shows only when non-empty</p>

      {error && <div role="alert" className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 bg-white/5 border border-white/8 rounded-2xl p-6 space-y-4">
          <h2 className="text-white font-semibold">{editingId ? 'Edit item' : 'New item'}</h2>
          <div>
            <label htmlFor="task" className={labelClass}>Task</label>
            <input id="task" required value={form.task} onChange={(e) => set('task', e.target.value)} className={inputClass} placeholder="What you plan to build or improve" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="status" className={labelClass}>Status</label>
              <select id="status" value={form.status} onChange={(e) => set('status', e.target.value as RoadmapStatus)} className={inputClass}>
                {STATUSES.map((s) => <option key={s} value={s} className="bg-gray-900">{s}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="order_index" className={labelClass}>Order</label>
              <input id="order_index" type="number" value={form.order_index} onChange={(e) => set('order_index', Number(e.target.value))} className={inputClass} />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving} className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white text-sm font-semibold disabled:opacity-70 hover:opacity-90 transition-opacity">{saving ? 'Saving…' : editingId ? 'Save changes' : 'Create'}</button>
            <button type="button" onClick={resetForm} className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/8 text-sm text-gray-300 hover:text-white transition-all">Cancel</button>
          </div>
        </form>
      )}

      {items.length === 0 ? (
        <div className="p-8 text-center bg-white/5 border border-white/8 rounded-2xl text-gray-500 text-sm">No roadmap items yet.</div>
      ) : (
        <ul className="space-y-3">
          {items.map((r) => (
            <li key={r.id} className="flex items-center gap-4 bg-white/5 border border-white/8 rounded-2xl p-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-white font-medium truncate">{r.task}</span>
                  <span className="px-2 py-0.5 rounded-md bg-violet-600/20 text-violet-300 text-[10px] uppercase tracking-wide">{r.status}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => startEdit(r)} className="px-3 py-1.5 rounded-lg bg-white/5 text-gray-300 text-sm hover:text-white hover:bg-white/8 transition-all">Edit</button>
                <button onClick={() => handleDelete(r)} className="px-3 py-1.5 rounded-lg bg-white/5 text-gray-500 text-sm hover:text-red-400 hover:bg-red-500/10 transition-all">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
