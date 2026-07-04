'use client';

import { useState } from 'react';
import type { BuildLogEntry, BuildStatus } from '@/types';

const STATUSES: BuildStatus[] = ['shipped', 'in-progress', 'planned'];

interface FormState { date: string; title: string; summary: string; status: BuildStatus }
const EMPTY_FORM: FormState = { date: '', title: '', summary: '', status: 'shipped' };

const inputClass =
  'w-full bg-white/5 border border-white/8 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-violet-500/50 transition-all disabled:opacity-50';
const labelClass = 'block text-xs text-gray-500 mb-1.5 font-medium';

export default function BuildLogManager({ initial }: { initial: BuildLogEntry[] }) {
  const [items, setItems] = useState<BuildLogEntry[]>(initial);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));
  const resetForm = () => { setForm(EMPTY_FORM); setEditingId(null); setError(''); setShowForm(false); };
  const startCreate = () => { setForm(EMPTY_FORM); setEditingId(null); setError(''); setShowForm(true); };
  const startEdit = (b: BuildLogEntry) => {
    setForm({ date: b.date, title: b.title, summary: b.summary, status: b.status });
    setEditingId(b.id); setError(''); setShowForm(true);
  };

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
          summary: form.summary.trim(), status: form.status,
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
    <div>
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold text-white">Build Log</h1>
        <button onClick={showForm ? resetForm : startCreate} className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white text-sm font-semibold hover:opacity-90 transition-opacity">
          {showForm ? 'Close' : '+ New Entry'}
        </button>
      </div>
      <p className="text-gray-500 text-sm mb-8">{items.length} {items.length === 1 ? 'entry' : 'entries'} · shows only when non-empty</p>

      {error && <div role="alert" className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 bg-white/5 border border-white/8 rounded-2xl p-6 space-y-4">
          <h2 className="text-white font-semibold">{editingId ? 'Edit entry' : 'New entry'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="date" className={labelClass}>Date (YYYY-MM or YYYY-MM-DD)</label>
              <input id="date" required value={form.date} onChange={(e) => set('date', e.target.value)} className={inputClass} placeholder="2026-07" />
            </div>
            <div>
              <label htmlFor="status" className={labelClass}>Status</label>
              <select id="status" value={form.status} onChange={(e) => set('status', e.target.value as BuildStatus)} className={inputClass}>
                {STATUSES.map((s) => <option key={s} value={s} className="bg-gray-900">{s}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="title" className={labelClass}>Title</label>
              <input id="title" required value={form.title} onChange={(e) => set('title', e.target.value)} className={inputClass} placeholder="Rebuilt portfolio architecture" />
            </div>
          </div>
          <div>
            <label htmlFor="summary" className={labelClass}>Summary</label>
            <textarea id="summary" rows={2} value={form.summary} onChange={(e) => set('summary', e.target.value)} className={inputClass} placeholder="What changed and why (optional)." />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving} className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white text-sm font-semibold disabled:opacity-70 hover:opacity-90 transition-opacity">{saving ? 'Saving…' : editingId ? 'Save changes' : 'Create'}</button>
            <button type="button" onClick={resetForm} className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/8 text-sm text-gray-300 hover:text-white transition-all">Cancel</button>
          </div>
        </form>
      )}

      {items.length === 0 ? (
        <div className="p-8 text-center bg-white/5 border border-white/8 rounded-2xl text-gray-500 text-sm">No build log entries yet.</div>
      ) : (
        <ul className="space-y-3">
          {items.map((b) => (
            <li key={b.id} className="flex items-start gap-4 bg-white/5 border border-white/8 rounded-2xl p-4">
              <div className="text-sm text-gray-500 shrink-0 w-24">{b.date}</div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-white font-medium truncate">{b.title}</span>
                  <span className="px-2 py-0.5 rounded-md bg-violet-600/20 text-violet-300 text-[10px] uppercase tracking-wide">{b.status}</span>
                </div>
                {b.summary && <div className="text-gray-500 text-sm mt-0.5">{b.summary}</div>}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => startEdit(b)} className="px-3 py-1.5 rounded-lg bg-white/5 text-gray-300 text-sm hover:text-white hover:bg-white/8 transition-all">Edit</button>
                <button onClick={() => handleDelete(b)} className="px-3 py-1.5 rounded-lg bg-white/5 text-gray-500 text-sm hover:text-red-400 hover:bg-red-500/10 transition-all">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
