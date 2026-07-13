'use client';

import { useState, useMemo } from 'react';
import { Plus, X, Search } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import type { Skill, SkillCategory } from '@/types';
import { skillCategories } from '@/lib/content/skills';
import { SkillCard } from '@/components/admin/skills/SkillCard';
import { SkillForm, type SkillFormState } from '@/components/admin/skills/SkillForm';

const EMPTY_FORM: SkillFormState = {
  name: '', category: 'Frontend', proficiency: 70,
  years: '', context: '', icon: '', order_index: 0,
};

function toForm(s: Skill): SkillFormState {
  return {
    name: s.name, category: s.category, proficiency: s.proficiency,
    years: s.years, context: s.context, icon: s.icon ?? '', order_index: s.order_index,
  };
}

export default function SkillsManager({ initial }: { initial: Skill[] }) {
  const [items, setItems] = useState<Skill[]>(initial);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<SkillFormState>(EMPTY_FORM);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [activeCategory, setActiveCategory] = useState<SkillCategory | 'All'>('All');
  const [search, setSearch] = useState('');

  const set = <K extends keyof SkillFormState>(k: K, v: SkillFormState[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const resetForm = () => { setForm(EMPTY_FORM); setEditingId(null); setError(''); setShowForm(false); };
  const startCreate = () => { setForm(EMPTY_FORM); setEditingId(null); setError(''); setShowForm(true); };
  const startEdit = (s: Skill) => { setForm(toForm(s)); setEditingId(s.id); setError(''); setShowForm(true); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;
    setSaving(true); setError('');
    const url = editingId ? `/api/skills/${editingId}` : '/api/skills';
    try {
      const res = await fetch(url, {
        method: editingId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(), category: form.category,
          proficiency: Number(form.proficiency) || 0, years: form.years.trim(),
          context: form.context.trim(), icon: form.icon.trim() || undefined,
          order_index: Number(form.order_index) || 0,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) { setError(data.error ?? 'Save failed'); setSaving(false); return; }
      const saved = data.data as Skill;
      setItems((prev) => editingId ? prev.map((x) => x.id === saved.id ? saved : x) : [...prev, saved]);
      resetForm();
    } catch { setError('Save failed. Check your connection.'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (s: Skill) => {
    if (!confirm(`Delete "${s.name}"?`)) return;
    const prev = items;
    setItems((list) => list.filter((x) => x.id !== s.id));
    try {
      const res = await fetch(`/api/skills/${s.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      if (editingId === s.id) resetForm();
    } catch { setItems(prev); setError('Delete failed.'); }
  };

  // Category counts
  const counts = useMemo(() => {
    const map: Record<string, number> = { All: items.length };
    for (const c of skillCategories) {
      map[c] = items.filter((s) => s.category === c).length;
    }
    return map;
  }, [items]);

  const filtered = useMemo(() => {
    let list = activeCategory === 'All' ? items : items.filter((s) => s.category === activeCategory);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((s) =>
        s.name.toLowerCase().includes(q) ||
        s.context?.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q)
      );
    }
    return list.sort((a, b) => a.order_index - b.order_index || a.name.localeCompare(b.name));
  }, [items, activeCategory, search]);

  return (
    <div>
      {/* ── Page header ──────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h1 style={{ fontSize: 'var(--admin-text-page-title)', fontWeight: 700, color: 'var(--color-ink)', letterSpacing: 'var(--tracking-tight)' }}>
            Skills
          </h1>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-faint)', marginTop: '0.25rem' }}>
            {items.length} {items.length === 1 ? 'entry' : 'entries'} · drives the public Skills section
          </p>
        </div>
        <button
          onClick={showForm ? resetForm : startCreate}
          className="admin-btn admin-btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}
        >
          {showForm ? <X size={14} /> : <Plus size={14} />}
          {showForm ? 'Close' : 'New Skill'}
        </button>
      </div>

      {/* ── Slide-down form ──────────────────────────────── */}
      <SkillForm
        open={showForm} editing={!!editingId} form={form}
        saving={saving} error={error}
        onChange={set} onSubmit={handleSubmit} onCancel={resetForm}
      />

      {/* ── Toolbar: search + category tabs ─────────────── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
        {/* Search */}
        <div style={{ position: 'relative', maxWidth: '20rem' }}>
          <Search size={13} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-faint)', pointerEvents: 'none' }} />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search skills…"
            className="admin-input"
            style={{ paddingLeft: '2.125rem', width: '100%', boxSizing: 'border-box' }}
          />
        </div>

        {/* Category tabs */}
        <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
          {(['All', ...skillCategories] as const).map((cat) => {
            const active = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: '0.3125rem 0.75rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: 'var(--text-xs)',
                  fontWeight: active ? 600 : 500,
                  letterSpacing: 'var(--tracking-tight)',
                  border: `1px solid ${active ? 'rgba(124,77,255,0.4)' : 'rgba(255,255,255,0.07)'}`,
                  background: active ? 'rgba(124,77,255,0.15)' : 'rgba(255,255,255,0.025)',
                  color: active ? 'var(--color-accent-300)' : 'var(--color-faint)',
                  cursor: 'pointer',
                  transition: 'all 150ms ease',
                }}
              >
                {cat} {counts[cat] > 0 && <span style={{ opacity: 0.7 }}>{counts[cat]}</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Grid ─────────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div
          style={{
            padding: '3rem 1.5rem',
            textAlign: 'center',
            background: 'var(--color-bg-elevated)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 'var(--radius-xl)',
            color: 'var(--color-faint)',
            fontSize: 'var(--text-sm)',
          }}
        >
          {search ? `No skills match "${search}"` : items.length === 0 ? 'No skills yet. Create one to populate the public section.' : `No skills in ${activeCategory}.`}
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(14rem, 1fr))',
            gap: '0.75rem',
          }}
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((s, i) => (
              <SkillCard key={s.id} skill={s} onEdit={startEdit} onDelete={handleDelete} index={i} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
