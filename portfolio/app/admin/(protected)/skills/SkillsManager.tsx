'use client';

import { useState } from 'react';
import type { Skill, SkillCategory } from '@/types';

const CATEGORIES: SkillCategory[] = ['Frontend', 'Backend', 'AI', 'Database', 'DevOps', 'Tools'];

interface FormState {
  name: string;
  category: SkillCategory;
  proficiency: number;
  years: string;
  context: string;
  icon: string;
  order_index: number;
}

const EMPTY_FORM: FormState = {
  name: '', category: 'Frontend', proficiency: 70, years: '', context: '', icon: '', order_index: 0,
};

function toForm(s: Skill): FormState {
  return {
    name: s.name, category: s.category, proficiency: s.proficiency,
    years: s.years, context: s.context, icon: s.icon ?? '', order_index: s.order_index,
  };
}

function toPayload(f: FormState) {
  return {
    name: f.name.trim(),
    category: f.category,
    proficiency: Number(f.proficiency) || 0,
    years: f.years.trim(),
    context: f.context.trim(),
    icon: f.icon.trim() || undefined,
    order_index: Number(f.order_index) || 0,
  };
}

const inputClass =
  'w-full bg-white/5 border border-white/8 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-violet-500/50 transition-all disabled:opacity-50';
const labelClass = 'block text-xs text-gray-500 mb-1.5 font-medium';

export default function SkillsManager({ initial }: { initial: Skill[] }) {
  const [items, setItems] = useState<Skill[]>(initial);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const resetForm = () => { setForm(EMPTY_FORM); setEditingId(null); setError(''); setShowForm(false); };
  const startCreate = () => { setForm(EMPTY_FORM); setEditingId(null); setError(''); setShowForm(true); };
  const startEdit = (s: Skill) => { setForm(toForm(s)); setEditingId(s.id); setError(''); setShowForm(true); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    setError('');
    const url = editingId ? `/api/skills/${editingId}` : '/api/skills';
    const method = editingId ? 'PATCH' : 'POST';
    try {
      const res = await fetch(url, {
        method, headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(toPayload(form)),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) { setError(data.error ?? 'Save failed'); setSaving(false); return; }
      const saved = data.data as Skill;
      setItems((prev) => (editingId ? prev.map((x) => (x.id === saved.id ? saved : x)) : [...prev, saved]));
      resetForm();
    } catch {
      setError('Save failed. Check your connection and try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (s: Skill) => {
    if (!confirm(`Delete "${s.name}"?`)) return;
    const prev = items;
    setItems((list) => list.filter((x) => x.id !== s.id));
    try {
      const res = await fetch(`/api/skills/${s.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      if (editingId === s.id) resetForm();
    } catch {
      setItems(prev);
      setError('Delete failed.');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold text-white">Skills</h1>
        <button
          onClick={showForm ? resetForm : startCreate}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          {showForm ? 'Close' : '+ New Skill'}
        </button>
      </div>
      <p className="text-gray-500 text-sm mb-8">
        {items.length} {items.length === 1 ? 'entry' : 'entries'} · drives the public Skills section
      </p>

      {error && (
        <div role="alert" className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 bg-white/5 border border-white/8 rounded-2xl p-6 space-y-4">
          <h2 className="text-white font-semibold">{editingId ? 'Edit skill' : 'New skill'}</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className={labelClass}>Name</label>
              <input id="name" required value={form.name} onChange={(e) => set('name', e.target.value)} className={inputClass} placeholder="TypeScript" />
            </div>
            <div>
              <label htmlFor="category" className={labelClass}>Category</label>
              <select id="category" value={form.category} onChange={(e) => set('category', e.target.value as SkillCategory)} className={inputClass}>
                {CATEGORIES.map((c) => <option key={c} value={c} className="bg-gray-900">{c}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="proficiency" className={labelClass}>Proficiency ({form.proficiency})</label>
              <input id="proficiency" type="range" min={0} max={100} value={form.proficiency} onChange={(e) => set('proficiency', Number(e.target.value))} className="w-full accent-violet-600" />
            </div>
            <div>
              <label htmlFor="years" className={labelClass}>Years</label>
              <input id="years" value={form.years} onChange={(e) => set('years', e.target.value)} className={inputClass} placeholder="3+ years" />
            </div>
            <div>
              <label htmlFor="order_index" className={labelClass}>Order</label>
              <input id="order_index" type="number" value={form.order_index} onChange={(e) => set('order_index', Number(e.target.value))} className={inputClass} />
            </div>
          </div>

          <div>
            <label htmlFor="context" className={labelClass}>Context</label>
            <input id="context" value={form.context} onChange={(e) => set('context', e.target.value)} className={inputClass} placeholder="What you've actually used it for" />
          </div>

          <div>
            <label htmlFor="icon" className={labelClass}>Icon key (optional)</label>
            <input id="icon" value={form.icon} onChange={(e) => set('icon', e.target.value)} className={inputClass} placeholder="e.g. an icon slug or emoji" />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving} className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white text-sm font-semibold disabled:opacity-70 hover:opacity-90 transition-opacity">
              {saving ? 'Saving…' : editingId ? 'Save changes' : 'Create'}
            </button>
            <button type="button" onClick={resetForm} className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/8 text-sm text-gray-300 hover:text-white transition-all">Cancel</button>
          </div>
        </form>
      )}

      {items.length === 0 ? (
        <div className="p-8 text-center bg-white/5 border border-white/8 rounded-2xl text-gray-500 text-sm">
          No skills yet. Create one to populate the public section.
        </div>
      ) : (
        <ul className="space-y-3">
          {items.map((s) => (
            <li key={s.id} className="flex items-center gap-4 bg-white/5 border border-white/8 rounded-2xl p-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-white font-medium truncate">{s.name}</span>
                  <span className="px-2 py-0.5 rounded-md bg-violet-600/20 text-violet-300 text-[10px] uppercase tracking-wide">{s.category}</span>
                </div>
                <div className="text-gray-500 text-sm truncate">
                  {s.proficiency}% {s.years ? `· ${s.years}` : ''} {s.context ? `· ${s.context}` : ''}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => startEdit(s)} className="px-3 py-1.5 rounded-lg bg-white/5 text-gray-300 text-sm hover:text-white hover:bg-white/8 transition-all">Edit</button>
                <button onClick={() => handleDelete(s)} className="px-3 py-1.5 rounded-lg bg-white/5 text-gray-500 text-sm hover:text-red-400 hover:bg-red-500/10 transition-all">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
