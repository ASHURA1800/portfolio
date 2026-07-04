'use client';

import { useState } from 'react';
import type { Certification } from '@/types';

// ── Form state ────────────────────────────────────────────────────────────────
// Mirrors certificationSchema (lib/validation/schemas.ts). Dates are kept as
// "YYYY-MM-DD" strings so <input type="date"> binds directly.
interface FormState {
  title: string;
  issuer: string;
  description: string;
  image: string;
  icon: string;
  issued_date: string;
  expiry_date: string;
  credential_url: string;
  skills: string[];
  is_featured: boolean;
  order_index: number;
}

const EMPTY_FORM: FormState = {
  title: '',
  issuer: '',
  description: '',
  image: '',
  icon: '🏆',
  issued_date: '',
  expiry_date: '',
  credential_url: '',
  skills: [],
  is_featured: false,
  order_index: 0,
};

function toForm(c: Certification): FormState {
  return {
    title: c.title,
    issuer: c.issuer,
    description: c.description ?? '',
    image: c.image ?? '',
    icon: c.icon || '🏆',
    issued_date: c.issued_date ?? '',
    expiry_date: c.expiry_date ?? '',
    credential_url: c.credential_url ?? '',
    skills: c.skills ?? [],
    is_featured: c.is_featured,
    order_index: c.order_index,
  };
}

// Strip empty optional fields so Zod's optional/default rules apply cleanly
// (e.g. omit issued_date rather than sending "").
function toPayload(f: FormState) {
  return {
    title: f.title.trim(),
    issuer: f.issuer.trim(),
    description: f.description.trim() || undefined,
    image: f.image.trim(),
    icon: f.icon.trim() || '🏆',
    issued_date: f.issued_date || undefined,
    expiry_date: f.expiry_date || undefined,
    credential_url: f.credential_url.trim(),
    skills: f.skills,
    is_featured: f.is_featured,
    order_index: Number(f.order_index) || 0,
  };
}

const inputClass =
  'w-full bg-white/5 border border-white/8 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-violet-500/50 transition-all disabled:opacity-50';
const labelClass = 'block text-xs text-gray-500 mb-1.5 font-medium';

export default function CertificationsManager({
  initial,
}: {
  initial: Certification[];
}) {
  const [items, setItems] = useState<Certification[]>(initial);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [skillDraft, setSkillDraft] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setSkillDraft('');
    setEditingId(null);
    setError('');
    setShowForm(false);
  };

  const startCreate = () => {
    setForm(EMPTY_FORM);
    setSkillDraft('');
    setEditingId(null);
    setError('');
    setShowForm(true);
  };

  const startEdit = (c: Certification) => {
    setForm(toForm(c));
    setSkillDraft('');
    setEditingId(c.id);
    setError('');
    setShowForm(true);
  };

  // ── Skill tags ──────────────────────────────────────────────────────────────
  const addSkill = () => {
    const value = skillDraft.trim();
    if (!value) return;
    if (form.skills.some((s) => s.toLowerCase() === value.toLowerCase())) {
      setSkillDraft('');
      return;
    }
    if (form.skills.length >= 20) return;
    set('skills', [...form.skills, value]);
    setSkillDraft('');
  };

  const removeSkill = (skill: string) =>
    set(
      'skills',
      form.skills.filter((s) => s !== skill)
    );

  // ── Image upload → existing Vercel Blob pipeline ──────────────────────────────
  const handleUpload = async (file: File) => {
    setUploading(true);
    setError('');
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/storage/certifications', {
        method: 'POST',
        body: fd,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) {
        setError(data.error ?? 'Upload failed');
        return;
      }
      // Store the returned public path — never a hardcoded name.
      set('image', data.data.url as string);
    } catch {
      setError('Upload failed. Check your connection and try again.');
    } finally {
      setUploading(false);
    }
  };

  // ── Create / update ───────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    setError('');

    const url = editingId
      ? `/api/certifications/${editingId}`
      : '/api/certifications';
    const method = editingId ? 'PATCH' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(toPayload(form)),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) {
        setError(data.error ?? 'Save failed');
        setSaving(false);
        return;
      }
      const saved = data.data as Certification;
      setItems((prev) =>
        editingId
          ? prev.map((c) => (c.id === saved.id ? saved : c))
          : [...prev, saved]
      );
      resetForm();
    } catch {
      setError('Save failed. Check your connection and try again.');
    } finally {
      setSaving(false);
    }
  };

  // ── Toggle featured (optimistic PATCH) ────────────────────────────────────────
  const toggleFeatured = async (c: Certification) => {
    const next = !c.is_featured;
    setItems((prev) =>
      prev.map((x) => (x.id === c.id ? { ...x, is_featured: next } : x))
    );
    try {
      const res = await fetch(`/api/certifications/${c.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_featured: next }),
      });
      if (!res.ok) throw new Error();
    } catch {
      // Roll back on failure
      setItems((prev) =>
        prev.map((x) => (x.id === c.id ? { ...x, is_featured: c.is_featured } : x))
      );
      setError('Could not update featured state.');
    }
  };

  // ── Delete ────────────────────────────────────────────────────────────────────
  const handleDelete = async (c: Certification) => {
    if (!confirm(`Delete "${c.title}"? This cannot be undone.`)) return;
    const prev = items;
    setItems((list) => list.filter((x) => x.id !== c.id));
    try {
      const res = await fetch(`/api/certifications/${c.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      if (editingId === c.id) resetForm();
    } catch {
      setItems(prev); // restore
      setError('Delete failed.');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold text-white">Certifications</h1>
        <button
          onClick={showForm ? resetForm : startCreate}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          {showForm ? 'Close' : '+ New Certification'}
        </button>
      </div>
      <p className="text-gray-500 text-sm mb-8">
        {items.length} {items.length === 1 ? 'entry' : 'entries'} · drives the
        public Certifications section
      </p>

      {error && (
        <div
          role="alert"
          className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
        >
          {error}
        </div>
      )}

      {/* ── Editor ─────────────────────────────────────────────────────────── */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-8 bg-white/5 border border-white/8 rounded-2xl p-6 space-y-4"
        >
          <h2 className="text-white font-semibold">
            {editingId ? 'Edit certification' : 'New certification'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="title" className={labelClass}>
                Title
              </label>
              <input
                id="title"
                required
                value={form.title}
                onChange={(e) => set('title', e.target.value)}
                className={inputClass}
                placeholder="AWS Certified Solutions Architect"
              />
            </div>
            <div>
              <label htmlFor="issuer" className={labelClass}>
                Issuer
              </label>
              <input
                id="issuer"
                required
                value={form.issuer}
                onChange={(e) => set('issuer', e.target.value)}
                className={inputClass}
                placeholder="Amazon Web Services"
              />
            </div>
          </div>

          <div>
            <label htmlFor="description" className={labelClass}>
              Description
            </label>
            <textarea
              id="description"
              rows={3}
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              className={inputClass}
              placeholder="What this credential covers (optional)."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="issued_date" className={labelClass}>
                Issue date
              </label>
              <input
                id="issued_date"
                type="date"
                value={form.issued_date}
                onChange={(e) => set('issued_date', e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="expiry_date" className={labelClass}>
                Expiry date
              </label>
              <input
                id="expiry_date"
                type="date"
                value={form.expiry_date}
                onChange={(e) => set('expiry_date', e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="order_index" className={labelClass}>
                Order
              </label>
              <input
                id="order_index"
                type="number"
                value={form.order_index}
                onChange={(e) => set('order_index', Number(e.target.value))}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label htmlFor="credential_url" className={labelClass}>
              Credential URL
            </label>
            <input
              id="credential_url"
              type="url"
              value={form.credential_url}
              onChange={(e) => set('credential_url', e.target.value)}
              className={inputClass}
              placeholder="https://…"
            />
          </div>

          {/* Skill tags */}
          <div>
            <label htmlFor="skill-input" className={labelClass}>
              Skill tags
            </label>
            {form.skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {form.skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-violet-600/20 text-violet-300 text-xs"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      aria-label={`Remove ${skill}`}
                      className="text-violet-400 hover:text-white transition-colors"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <input
                id="skill-input"
                value={skillDraft}
                onChange={(e) => setSkillDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ',') {
                    e.preventDefault();
                    addSkill();
                  }
                }}
                className={inputClass}
                placeholder="Type a skill and press Enter"
              />
              <button
                type="button"
                onClick={addSkill}
                className="px-4 rounded-xl bg-white/5 border border-white/8 text-sm text-gray-300 hover:text-white hover:border-violet-500/50 transition-all"
              >
                Add
              </button>
            </div>
          </div>

          {/* Certificate image */}
          <div>
            <label htmlFor="cert-image" className={labelClass}>
              Certificate image
            </label>
            <div className="flex items-center gap-4">
              {form.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={form.image}
                  alt="Certificate preview"
                  className="h-16 w-16 rounded-lg object-cover border border-white/8"
                />
              )}
              <div className="flex-1">
                <input
                  id="cert-image"
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  disabled={uploading}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleUpload(file);
                  }}
                  className="block w-full text-sm text-gray-400 file:mr-3 file:rounded-lg file:border-0 file:bg-violet-600/20 file:px-3 file:py-2 file:text-sm file:text-violet-300 hover:file:bg-violet-600/30 disabled:opacity-50"
                />
                {uploading && (
                  <p className="text-xs text-gray-500 mt-1">Uploading…</p>
                )}
                {form.image && (
                  <button
                    type="button"
                    onClick={() => set('image', '')}
                    className="text-xs text-gray-500 hover:text-red-400 mt-1 transition-colors"
                  >
                    Remove image
                  </button>
                )}
              </div>
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-300">
            <input
              type="checkbox"
              checked={form.is_featured}
              onChange={(e) => set('is_featured', e.target.checked)}
              className="h-4 w-4 rounded border-white/8 bg-white/5 accent-violet-600"
            />
            Featured
          </label>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving || uploading}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white text-sm font-semibold disabled:opacity-70 hover:opacity-90 transition-opacity"
            >
              {saving ? 'Saving…' : editingId ? 'Save changes' : 'Create'}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/8 text-sm text-gray-300 hover:text-white transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* ── List ───────────────────────────────────────────────────────────── */}
      {items.length === 0 ? (
        <div className="p-8 text-center bg-white/5 border border-white/8 rounded-2xl text-gray-500 text-sm">
          No certifications yet. Create one to populate the public section.
        </div>
      ) : (
        <ul className="space-y-3">
          {items.map((c) => (
            <li
              key={c.id}
              className="flex items-center gap-4 bg-white/5 border border-white/8 rounded-2xl p-4"
            >
              <div className="text-2xl shrink-0" aria-hidden="true">
                {c.icon || '🏆'}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-white font-medium truncate">{c.title}</span>
                  {c.is_featured && (
                    <span className="px-2 py-0.5 rounded-md bg-violet-600/20 text-violet-300 text-[10px] uppercase tracking-wide">
                      Featured
                    </span>
                  )}
                </div>
                <div className="text-gray-500 text-sm truncate">
                  {c.issuer}
                  {c.issued_date ? ` · ${c.issued_date}` : ''}
                </div>
                {c.skills?.length > 0 && (
                  <div className="mt-1 flex flex-wrap gap-1">
                    {c.skills.map((s) => (
                      <span
                        key={s}
                        className="px-2 py-0.5 rounded-md bg-white/5 text-gray-400 text-[11px]"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => toggleFeatured(c)}
                  aria-pressed={c.is_featured}
                  title={c.is_featured ? 'Unfeature' : 'Feature'}
                  className={`px-2.5 py-1.5 rounded-lg text-sm transition-all ${
                    c.is_featured
                      ? 'bg-violet-600/20 text-violet-300'
                      : 'bg-white/5 text-gray-500 hover:text-white'
                  }`}
                >
                  ★
                </button>
                <button
                  onClick={() => startEdit(c)}
                  className="px-3 py-1.5 rounded-lg bg-white/5 text-gray-300 text-sm hover:text-white hover:bg-white/8 transition-all"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(c)}
                  className="px-3 py-1.5 rounded-lg bg-white/5 text-gray-500 text-sm hover:text-red-400 hover:bg-red-500/10 transition-all"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
