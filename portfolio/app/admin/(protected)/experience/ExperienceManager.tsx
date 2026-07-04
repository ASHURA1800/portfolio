'use client';

import { useState } from 'react';
import type { Experience, EmploymentType } from '@/types';

const TYPES: EmploymentType[] = ['full-time', 'part-time', 'contract', 'internship', 'freelance'];

const inputClass =
  'w-full bg-white/5 border border-white/8 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-violet-500/50 transition-all disabled:opacity-50';
const labelClass = 'block text-xs text-gray-500 mb-1.5 font-medium';

// ── Reusable tag input ────────────────────────────────────────────────────────
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
  company: string; role: string; start_date: string; end_date: string; location: string;
  type: EmploymentType; description: string; tech_stack: string[]; impact: string[];
  achievements: string[]; current: boolean; order_index: number;
}
const EMPTY_FORM: FormState = {
  company: '', role: '', start_date: '', end_date: '', location: '', type: 'full-time',
  description: '', tech_stack: [], impact: [], achievements: [], current: false, order_index: 0,
};
function toForm(x: Experience): FormState {
  return {
    company: x.company, role: x.role, start_date: x.start_date, end_date: x.end_date,
    location: x.location, type: x.type, description: x.description, tech_stack: x.tech_stack,
    impact: x.impact, achievements: x.achievements, current: x.current, order_index: x.order_index,
  };
}

export default function ExperienceManager({ initial }: { initial: Experience[] }) {
  const [items, setItems] = useState<Experience[]>(initial);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));
  const resetForm = () => { setForm(EMPTY_FORM); setEditingId(null); setError(''); setShowForm(false); };
  const startCreate = () => { setForm(EMPTY_FORM); setEditingId(null); setError(''); setShowForm(true); };
  const startEdit = (x: Experience) => { setForm(toForm(x)); setEditingId(x.id); setError(''); setShowForm(true); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;
    setSaving(true); setError('');
    const url = editingId ? `/api/experience/${editingId}` : '/api/experience';
    try {
      const res = await fetch(url, {
        method: editingId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company: form.company.trim(), role: form.role.trim(), start_date: form.start_date.trim(),
          end_date: form.end_date.trim(), location: form.location.trim(), type: form.type,
          description: form.description.trim(), tech_stack: form.tech_stack, impact: form.impact,
          achievements: form.achievements, current: form.current, order_index: Number(form.order_index) || 0,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) { setError(data.error ?? 'Save failed'); setSaving(false); return; }
      const saved = data.data as Experience;
      setItems((prev) => (editingId ? prev.map((x) => (x.id === saved.id ? saved : x)) : [...prev, saved]));
      resetForm();
    } catch { setError('Save failed.'); } finally { setSaving(false); }
  };

  const handleDelete = async (x: Experience) => {
    if (!confirm(`Delete "${x.role} @ ${x.company}"?`)) return;
    const prev = items;
    setItems((list) => list.filter((i) => i.id !== x.id));
    try {
      const res = await fetch(`/api/experience/${x.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      if (editingId === x.id) resetForm();
    } catch { setItems(prev); setError('Delete failed.'); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold text-white">Experience</h1>
        <button onClick={showForm ? resetForm : startCreate} className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white text-sm font-semibold hover:opacity-90 transition-opacity">
          {showForm ? 'Close' : '+ New Role'}
        </button>
      </div>
      <p className="text-gray-500 text-sm mb-8">{items.length} {items.length === 1 ? 'role' : 'roles'} · empty falls back to profile.currentWork</p>

      {error && <div role="alert" className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 bg-white/5 border border-white/8 rounded-2xl p-6 space-y-4">
          <h2 className="text-white font-semibold">{editingId ? 'Edit role' : 'New role'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label htmlFor="company" className={labelClass}>Company</label><input id="company" required value={form.company} onChange={(e) => set('company', e.target.value)} className={inputClass} /></div>
            <div><label htmlFor="role" className={labelClass}>Role</label><input id="role" required value={form.role} onChange={(e) => set('role', e.target.value)} className={inputClass} /></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div><label htmlFor="start_date" className={labelClass}>Start</label><input id="start_date" required value={form.start_date} onChange={(e) => set('start_date', e.target.value)} className={inputClass} placeholder="Jan 2023" /></div>
            <div><label htmlFor="end_date" className={labelClass}>End</label><input id="end_date" value={form.end_date} onChange={(e) => set('end_date', e.target.value)} className={inputClass} placeholder="(blank if current)" /></div>
            <div>
              <label htmlFor="type" className={labelClass}>Type</label>
              <select id="type" value={form.type} onChange={(e) => set('type', e.target.value as EmploymentType)} className={inputClass}>
                {TYPES.map((t) => <option key={t} value={t} className="bg-gray-900">{t}</option>)}
              </select>
            </div>
            <div><label htmlFor="order_index" className={labelClass}>Order</label><input id="order_index" type="number" value={form.order_index} onChange={(e) => set('order_index', Number(e.target.value))} className={inputClass} /></div>
          </div>
          <div><label htmlFor="location" className={labelClass}>Location</label><input id="location" value={form.location} onChange={(e) => set('location', e.target.value)} className={inputClass} /></div>
          <div><label htmlFor="description" className={labelClass}>Description</label><textarea id="description" rows={2} value={form.description} onChange={(e) => set('description', e.target.value)} className={inputClass} /></div>
          <TagInput label="Tech stack" tags={form.tech_stack} onChange={(t) => set('tech_stack', t)} placeholder="Add a technology" />
          <TagInput label="Impact (rendered bullets)" tags={form.impact} onChange={(t) => set('impact', t)} placeholder="Lead with the outcome" />
          <TagInput label="Achievements (kept for reference)" tags={form.achievements} onChange={(t) => set('achievements', t)} placeholder="Add an achievement" />
          <label className="flex items-center gap-2 text-sm text-gray-300">
            <input type="checkbox" checked={form.current} onChange={(e) => set('current', e.target.checked)} className="h-4 w-4 rounded border-white/8 bg-white/5 accent-violet-600" />
            Current role
          </label>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving} className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white text-sm font-semibold disabled:opacity-70 hover:opacity-90 transition-opacity">{saving ? 'Saving…' : editingId ? 'Save changes' : 'Create'}</button>
            <button type="button" onClick={resetForm} className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/8 text-sm text-gray-300 hover:text-white transition-all">Cancel</button>
          </div>
        </form>
      )}

      {items.length === 0 ? (
        <div className="p-8 text-center bg-white/5 border border-white/8 rounded-2xl text-gray-500 text-sm">No experience yet.</div>
      ) : (
        <ul className="space-y-3">
          {items.map((x) => (
            <li key={x.id} className="flex items-center gap-4 bg-white/5 border border-white/8 rounded-2xl p-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-white font-medium truncate">{x.role} · {x.company}</span>
                  {x.current && <span className="px-2 py-0.5 rounded-md bg-violet-600/20 text-violet-300 text-[10px] uppercase tracking-wide">Current</span>}
                </div>
                <div className="text-gray-500 text-sm truncate">{x.start_date}{x.end_date ? ` — ${x.end_date}` : x.current ? ' — Present' : ''} · {x.type}</div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => startEdit(x)} className="px-3 py-1.5 rounded-lg bg-white/5 text-gray-300 text-sm hover:text-white hover:bg-white/8 transition-all">Edit</button>
                <button onClick={() => handleDelete(x)} className="px-3 py-1.5 rounded-lg bg-white/5 text-gray-500 text-sm hover:text-red-400 hover:bg-red-500/10 transition-all">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
