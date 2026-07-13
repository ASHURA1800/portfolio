'use client';

import { useState, useMemo } from 'react';
import { Plus, X } from 'lucide-react';
import type { Certification } from '@/types';
import {
  CertificationForm, EMPTY_CERT_FORM, toForm, type CertFormState,
} from '@/components/admin/certifications/CertificationForm';
import { CertificationGrid } from '@/components/admin/certifications/CertificationGrid';
import { CertificationPreview } from '@/components/admin/certifications/CertificationPreview';
import { CertificationToolbar, type SortOption, type FilterOption } from '@/components/admin/certifications/CertificationToolbar';

// ── payload helper (identical to original toPayload) ─────────────────────────
function toPayload(f: CertFormState) {
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

function isExpired(expiry: string | null | undefined): boolean {
  if (!expiry) return false;
  return new Date(expiry) < new Date();
}

export default function CertificationsManager({ initial }: { initial: Certification[] }) {
  const [items, setItems] = useState<Certification[]>(initial);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CertFormState>(EMPTY_CERT_FORM);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [preview, setPreview] = useState<Certification | null>(null);

  // Toolbar state
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortOption>('order');
  const [filter, setFilter] = useState<FilterOption>('all');

  const set = <K extends keyof CertFormState>(k: K, v: CertFormState[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const resetForm = () => { setForm(EMPTY_CERT_FORM); setEditingId(null); setError(''); setShowForm(false); };
  const startCreate = () => { setForm(EMPTY_CERT_FORM); setEditingId(null); setError(''); setShowForm(true); };
  const startEdit = (c: Certification) => { setForm(toForm(c)); setEditingId(c.id); setError(''); setShowForm(true); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  // ── Image upload — preserves exact original Vercel Blob pipeline ─────────────
  const handleUpload = async (file: File) => {
    setUploading(true); setError('');
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/storage/certifications', { method: 'POST', body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) { setError(data.error ?? 'Upload failed'); return; }
      set('image', data.data.url as string);
    } catch { setError('Upload failed. Check your connection and try again.'); }
    finally { setUploading(false); }
  };

  // ── CRUD ─────────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;
    setSaving(true); setError('');
    const url = editingId ? `/api/certifications/${editingId}` : '/api/certifications';
    try {
      const res = await fetch(url, {
        method: editingId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(toPayload(form)),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) { setError(data.error ?? 'Save failed'); setSaving(false); return; }
      const saved = data.data as Certification;
      setItems((prev) => editingId ? prev.map((c) => c.id === saved.id ? saved : c) : [...prev, saved]);
      resetForm();
    } catch { setError('Save failed. Check your connection and try again.'); }
    finally { setSaving(false); }
  };

  const toggleFeatured = async (c: Certification) => {
    const next = !c.is_featured;
    setItems((prev) => prev.map((x) => x.id === c.id ? { ...x, is_featured: next } : x));
    try {
      const res = await fetch(`/api/certifications/${c.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_featured: next }),
      });
      if (!res.ok) throw new Error();
    } catch {
      setItems((prev) => prev.map((x) => x.id === c.id ? { ...x, is_featured: c.is_featured } : x));
      setError('Could not update featured state.');
    }
  };

  const handleDelete = async (c: Certification) => {
    if (!confirm(`Delete "${c.title}"? This cannot be undone.`)) return;
    const prev = items;
    setItems((list) => list.filter((x) => x.id !== c.id));
    try {
      const res = await fetch(`/api/certifications/${c.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      if (editingId === c.id) resetForm();
    } catch { setItems(prev); setError('Delete failed.'); }
  };

  // ── Filtered + sorted view ───────────────────────────────────────────────────
  const visible = useMemo(() => {
    let list = [...items];

    // Filter
    if (filter === 'featured') list = list.filter((c) => c.is_featured);
    else if (filter === 'active') list = list.filter((c) => !isExpired(c.expiry_date));
    else if (filter === 'expired') list = list.filter((c) => isExpired(c.expiry_date));

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((c) =>
        c.title.toLowerCase().includes(q) ||
        c.issuer.toLowerCase().includes(q) ||
        c.skills?.some((s) => s.toLowerCase().includes(q))
      );
    }

    // Sort
    if (sort === 'order') list.sort((a, b) => a.order_index - b.order_index);
    else if (sort === 'date_desc') list.sort((a, b) => (b.issued_date ?? '').localeCompare(a.issued_date ?? ''));
    else if (sort === 'date_asc') list.sort((a, b) => (a.issued_date ?? '').localeCompare(b.issued_date ?? ''));
    else if (sort === 'title') list.sort((a, b) => a.title.localeCompare(b.title));

    return list;
  }, [items, filter, search, sort]);

  return (
    <div>
      {/* ── Header ───────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h1 style={{ fontSize: 'var(--admin-text-page-title)', fontWeight: 700, color: 'var(--color-ink)', letterSpacing: 'var(--tracking-tight)' }}>
            Certifications
          </h1>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-faint)', marginTop: '0.25rem' }}>
            {items.length} {items.length === 1 ? 'entry' : 'entries'} · drives the public Certifications section
          </p>
        </div>
        <button
          onClick={showForm ? resetForm : startCreate}
          className="admin-btn admin-btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}
        >
          {showForm ? <X size={14} /> : <Plus size={14} />}
          {showForm ? 'Close' : 'New Certification'}
        </button>
      </div>

      {/* ── Slide-down form ──────────────────────────────── */}
      <CertificationForm
        open={showForm} editing={!!editingId} form={form}
        saving={saving} uploading={uploading} error={error}
        onChange={set} onUpload={handleUpload}
        onSubmit={handleSubmit} onCancel={resetForm}
      />

      {/* ── Toolbar ───────────────────────────────────────── */}
      <CertificationToolbar
        search={search} onSearch={setSearch}
        sort={sort} onSort={setSort}
        filter={filter} onFilter={setFilter}
        total={items.length} visible={visible.length}
      />

      {/* ── Grid ─────────────────────────────────────────── */}
      <CertificationGrid
        certs={visible}
        onEdit={startEdit}
        onDelete={handleDelete}
        onToggleFeatured={toggleFeatured}
        onPreview={setPreview}
      />

      {/* ── Image preview modal ───────────────────────────── */}
      <CertificationPreview cert={preview} onClose={() => setPreview(null)} />
    </div>
  );
}
