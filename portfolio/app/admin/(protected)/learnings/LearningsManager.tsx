'use client';

import { useState } from 'react';
import type { Learning } from '@/types';

interface FormState { title: string; description: string; order_index: number }
const EMPTY_FORM: FormState = { title: '', description: '', order_index: 0 };

const inputClass =
  'w-full bg-white/5 border border-white/8 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-violet-500/50 transition-all disabled:opacity-50';
const labelClass = 'block text-xs text-gray-500 mb-1.5 font-medium';

export default function LearningsManager({ initial }: { initial: Learning[] }) {
  const [items, setItems] = useState<Learning[]>(initial);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));
  const resetForm = () => { setForm(EMPTY_FORM); setEditingId(null); setError(''); setShowForm(false); };
  const startCreate = () => { setForm(EMPTY_FORM); setEditingId(null); setError(''); setShowForm(true); };
  const startEdit = (l: Learning) => {
    setForm({ title: l.title, description: l.description, order_index: l.order_index });
    setEditingId(l.id); setError(''); setShowForm(true);
  };

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
          title: form.title.trim(),
          description: form.description.trim(),
          order_index: Number(form.order_index) || 0,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) { setError(data.error ?? 'Save failed'); setSaving(false); return; }
      const saved = data.data as Learning;
      setItems((prev) => (editingId ? prev.map((x) => (x.id === saved.id ? saved : x)) : [...prev, saved]));
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
    <div>
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold text-white">Learnings</h1>
        <button onClick={showForm ? resetForm : startCreate} className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white text-sm font-semibold hover:opacity-90 transition-opacity">
          {showForm ? 'Close' : '+ New Learning'}
        </button>
      </div>
      <p className="text-gray-500 text-sm mb-8">{items.length} {items.length === 1 ? 'entry' : 'entries'} · shows only when non-empty</p>

      {error && <div role="alert" className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 bg-white/5 border border-white/8 rounded-2xl p-6 space-y-4">
          <h2 className="text-white font-semibold">{editingId ? 'Edit learning' : 'New learning'}</h2>
          <div>
            <label htmlFor="title" className={labelClass}>Title</label>
            <input id="title" required value={form.title} onChange={(e) => set('title', e.target.value)} className={inputClass} placeholder="What you figured out" />
          </div>
          <div>
            <label htmlFor="description" className={labelClass}>Description</label>
            <textarea id="description" rows={3} value={form.description} onChange={(e) => set('description', e.target.value)} className={inputClass} placeholder="The concrete lesson, in your words." />
          </div>
          <div>
            <label htmlFor="order_index" className={labelClass}>Order</label>
            <input id="order_index" type="number" value={form.order_index} onChange={(e) => set('order_index', Number(e.target.value))} className={inputClass} />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving} className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white text-sm font-semibold disabled:opacity-70 hover:opacity-90 transition-opacity">{saving ? 'Saving…' : editingId ? 'Save changes' : 'Create'}</button>
            <button type="button" onClick={resetForm} className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/8 text-sm text-gray-300 hover:text-white transition-all">Cancel</button>
          </div>
        </form>
      )}

      {items.length === 0 ? (
        <div className="p-8 text-center bg-white/5 border border-white/8 rounded-2xl text-gray-500 text-sm">No learnings yet.</div>
      ) : (
        <ul className="space-y-3">
          {items.map((l) => (
            <li key={l.id} className="flex items-start gap-4 bg-white/5 border border-white/8 rounded-2xl p-4">
              <div className="min-w-0 flex-1">
                <div className="text-white font-medium">{l.title}</div>
                {l.description && <div className="text-gray-500 text-sm mt-0.5">{l.description}</div>}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => startEdit(l)} className="px-3 py-1.5 rounded-lg bg-white/5 text-gray-300 text-sm hover:text-white hover:bg-white/8 transition-all">Edit</button>
                <button onClick={() => handleDelete(l)} className="px-3 py-1.5 rounded-lg bg-white/5 text-gray-500 text-sm hover:text-red-400 hover:bg-red-500/10 transition-all">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
