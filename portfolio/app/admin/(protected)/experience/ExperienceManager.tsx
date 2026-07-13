'use client';

import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import type { Experience, EmploymentType } from '@/types';
import { ExperienceCard } from '@/components/admin/experience/ExperienceCard';
import { TagInput } from '@/components/admin/shared/TagInput';

const TYPES: EmploymentType[] = ['full-time', 'part-time', 'contract', 'internship', 'freelance'];

interface FormState {
  company: string; role: string; start_date: string; end_date: string;
  location: string; type: EmploymentType; description: string;
  tech_stack: string[]; impact: string[]; achievements: string[];
  current: boolean; order_index: number;
}

const EMPTY_FORM: FormState = {
  company: '', role: '', start_date: '', end_date: '', location: '',
  type: 'full-time', description: '', tech_stack: [], impact: [],
  achievements: [], current: false, order_index: 0,
};

function toForm(x: Experience): FormState {
  return {
    company: x.company, role: x.role, start_date: x.start_date, end_date: x.end_date,
    location: x.location, type: x.type, description: x.description,
    tech_stack: x.tech_stack, impact: x.impact, achievements: x.achievements,
    current: x.current, order_index: x.order_index,
  };
}

export default function ExperienceManager({ initial }: { initial: Experience[] }) {
  const [items, setItems] = useState<Experience[]>(initial);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const reduce = useReducedMotion();

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((f) => ({ ...f, [k]: v }));
  const resetForm = () => { setForm(EMPTY_FORM); setEditingId(null); setError(''); setShowForm(false); };
  const startCreate = () => { setForm(EMPTY_FORM); setEditingId(null); setError(''); setShowForm(true); };
  const startEdit = (x: Experience) => { setForm(toForm(x)); setEditingId(x.id); setError(''); setShowForm(true); window.scrollTo({ top: 0, behavior: 'smooth' }); };

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
          company: form.company.trim(), role: form.role.trim(),
          start_date: form.start_date.trim(), end_date: form.end_date.trim(),
          location: form.location.trim(), type: form.type,
          description: form.description.trim(), tech_stack: form.tech_stack,
          impact: form.impact, achievements: form.achievements,
          current: form.current, order_index: Number(form.order_index) || 0,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) { setError(data.error ?? 'Save failed'); setSaving(false); return; }
      const saved = data.data as Experience;
      setItems((prev) => editingId ? prev.map((x) => x.id === saved.id ? saved : x) : [...prev, saved]);
      resetForm();
    } catch { setError('Save failed. Check your connection.'); }
    finally { setSaving(false); }
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

  const sorted = [...items].sort((a, b) => a.order_index - b.order_index);

  return (
    <div>
      {/* ── Header ──────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h1 style={{ fontSize: 'var(--admin-text-page-title)', fontWeight: 700, color: 'var(--color-ink)', letterSpacing: 'var(--tracking-tight)' }}>
            Experience
          </h1>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-faint)', marginTop: '0.25rem' }}>
            {items.length} {items.length === 1 ? 'role' : 'roles'} · empty falls back to profile.currentWork
          </p>
        </div>
        <button
          onClick={showForm ? resetForm : startCreate}
          className="admin-btn admin-btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}
        >
          {showForm ? <X size={14} /> : <Plus size={14} />}
          {showForm ? 'Close' : 'New Role'}
        </button>
      </div>

      {/* ── Slide-down form ──────────────────────────────── */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: 'hidden', marginBottom: '1.5rem' }}
          >
            <form
              onSubmit={handleSubmit}
              style={{
                background: 'var(--color-bg-elevated)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 'var(--radius-xl)',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
              }}
            >
              <h2 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-ink)' }}>
                {editingId ? 'Edit role' : 'New role'}
              </h2>

              {error && (
                <div role="alert" style={{ padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-md)', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: 'rgb(248,113,113)', fontSize: 'var(--text-sm)' }}>
                  {error}
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label htmlFor="exp-company" className="admin-label">Company *</label>
                  <input id="exp-company" required className="admin-input" value={form.company} onChange={(e) => set('company', e.target.value)} placeholder="Acme Corp" style={{ width: '100%', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label htmlFor="exp-role" className="admin-label">Role *</label>
                  <input id="exp-role" required className="admin-input" value={form.role} onChange={(e) => set('role', e.target.value)} placeholder="Senior Engineer" style={{ width: '100%', boxSizing: 'border-box' }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 0.8fr', gap: '0.75rem' }}>
                <div>
                  <label htmlFor="exp-start" className="admin-label">Start *</label>
                  <input id="exp-start" required className="admin-input" value={form.start_date} onChange={(e) => set('start_date', e.target.value)} placeholder="Jan 2022" style={{ width: '100%', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label htmlFor="exp-end" className="admin-label">End</label>
                  <input id="exp-end" className="admin-input" value={form.end_date} onChange={(e) => set('end_date', e.target.value)} placeholder="(blank if current)" style={{ width: '100%', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label htmlFor="exp-type" className="admin-label">Type</label>
                  <select id="exp-type" className="admin-input" value={form.type} onChange={(e) => set('type', e.target.value as EmploymentType)} style={{ width: '100%', boxSizing: 'border-box' }}>
                    {TYPES.map((t) => <option key={t} value={t} style={{ background: 'var(--color-bg)' }}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="exp-order" className="admin-label">Order</label>
                  <input id="exp-order" type="number" className="admin-input" value={form.order_index} onChange={(e) => set('order_index', Number(e.target.value))} style={{ width: '100%', boxSizing: 'border-box' }} />
                </div>
              </div>

              <div>
                <label htmlFor="exp-location" className="admin-label">Location</label>
                <input id="exp-location" className="admin-input" value={form.location} onChange={(e) => set('location', e.target.value)} placeholder="Reykjavík, IS" style={{ width: '100%', boxSizing: 'border-box' }} />
              </div>

              <div>
                <label htmlFor="exp-desc" className="admin-label">Description</label>
                <textarea id="exp-desc" rows={2} className="admin-input" value={form.description} onChange={(e) => set('description', e.target.value)} style={{ width: '100%', boxSizing: 'border-box', resize: 'vertical' }} />
              </div>

              <TagInput label="Tech stack" tags={form.tech_stack} onChange={(t) => set('tech_stack', t)} placeholder="Add a technology" variant="cyan" />
              <TagInput label="Impact (rendered as bullets)" tags={form.impact} onChange={(t) => set('impact', t)} placeholder="Lead with the outcome" />
              <TagInput label="Achievements" tags={form.achievements} onChange={(t) => set('achievements', t)} placeholder="Add an achievement" variant="neutral" />

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: 'var(--text-sm)', color: 'var(--color-muted)', cursor: 'pointer' }}>
                <input type="checkbox" checked={form.current} onChange={(e) => set('current', e.target.checked)} style={{ accentColor: 'var(--color-accent-500)' }} />
                Current role
              </label>

              <div style={{ display: 'flex', gap: '0.625rem', paddingTop: '0.25rem' }}>
                <button type="submit" disabled={saving} className="admin-btn admin-btn-primary" style={{ minWidth: '8rem', justifyContent: 'center' }}>
                  {saving ? 'Saving…' : editingId ? 'Save changes' : 'Create role'}
                </button>
                <button type="button" onClick={resetForm} className="admin-btn">Cancel</button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Timeline list ──────────────────────────────────── */}
      {sorted.length === 0 ? (
        <div style={{ padding: '3rem 1.5rem', textAlign: 'center', background: 'var(--color-bg-elevated)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 'var(--radius-xl)', color: 'var(--color-faint)', fontSize: 'var(--text-sm)' }}>
          No experience yet.
        </div>
      ) : (
        <div>
          {sorted.map((x, i) => (
            <ExperienceCard
              key={x.id} item={x}
              onEdit={startEdit} onDelete={handleDelete}
              isLast={i === sorted.length - 1} index={i}
            />
          ))}
        </div>
      )}
    </div>
  );
}
