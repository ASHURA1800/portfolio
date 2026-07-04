'use client';

import { useState } from 'react';

// Snake_case, matching profileSchema / the DB row. `initial` is the raw row or null.
interface ProfileForm {
  name: string; username: string; github: string; email: string; bio: string; title: string;
  current_work: string; location: string; avatar: string; resume: string; linkedin: string;
  twitter: string; website: string; about_journey: string; about_current_focus: string;
  about_philosophy: string; about_learning: string; note: string; contact_note: string;
  skills_note: string; blog_intro: string;
}

const FIELDS: (keyof ProfileForm)[] = [
  'name', 'username', 'github', 'email', 'bio', 'title', 'current_work', 'location', 'avatar',
  'resume', 'linkedin', 'twitter', 'website', 'about_journey', 'about_current_focus',
  'about_philosophy', 'about_learning', 'note', 'contact_note', 'skills_note', 'blog_intro',
];

function toForm(initial: Partial<ProfileForm> | null): ProfileForm {
  const f = {} as ProfileForm;
  for (const k of FIELDS) f[k] = (initial?.[k] as string) ?? '';
  return f;
}

const inputClass =
  'w-full bg-white/5 border border-white/8 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-violet-500/50 transition-all disabled:opacity-50';
const labelClass = 'block text-xs text-gray-500 mb-1.5 font-medium';

// Module-scoped so they keep a stable identity across renders (defining them
// inside the component would remount on every keystroke and drop input focus).
function Field({ id, label, value, onChange, placeholder }: {
  id: string; label: string; value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className={labelClass}>{label}</label>
      <input id={id} value={value} onChange={(e) => onChange(e.target.value)} className={inputClass} placeholder={placeholder} />
    </div>
  );
}
function AreaField({ id, label, value, onChange, placeholder }: {
  id: string; label: string; value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className={labelClass}>{label}</label>
      <textarea id={id} rows={3} value={value} onChange={(e) => onChange(e.target.value)} className={inputClass} placeholder={placeholder} />
    </div>
  );
}

export default function ProfileManager({ initial }: { initial: Partial<ProfileForm> | null }) {
  const [form, setForm] = useState<ProfileForm>(toForm(initial));
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<'avatar' | 'resume' | null>(null);

  const set = (key: keyof ProfileForm, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    setSaved(false);
  };

  const upload = async (file: File, bucket: 'avatars' | 'resume', field: 'avatar' | 'resume') => {
    setUploading(field); setError('');
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch(`/api/storage/${bucket}`, { method: 'POST', body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) { setError(data.error ?? 'Upload failed'); return; }
      set(field, data.data.url as string);
    } catch { setError('Upload failed.'); } finally { setUploading(null); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;
    setSaving(true); setError(''); setSaved(false);
    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(FIELDS.map((k) => [k, form[k].trim()]))),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) { setError(data.error ?? 'Save failed'); setSaving(false); return; }
      setSaved(true);
    } catch { setError('Save failed.'); } finally { setSaving(false); }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-2">Profile</h1>
      <p className="text-gray-500 text-sm mb-8">Single source of identity — drives the navbar, hero, about, footer, and SEO metadata.</p>

      {error && <div role="alert" className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}
      {saved && <div role="status" className="mb-6 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">Profile saved.</div>}

      <form onSubmit={handleSubmit} className="space-y-8">
        <section className="bg-white/5 border border-white/8 rounded-2xl p-6 space-y-4">
          <h2 className="text-white font-semibold">Identity</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field id="name" label="Name" value={form.name} onChange={(v) => set('name', v)} placeholder="Your name" />
            <Field id="username" label="Username / handle" value={form.username} onChange={(v) => set('username', v)} placeholder="handle (no @)" />
            <Field id="title" label="Title" value={form.title} onChange={(v) => set('title', v)} placeholder="Full-stack developer" />
            <Field id="current_work" label="Current work" value={form.current_work} onChange={(v) => set('current_work', v)} placeholder="Building independently" />
            <Field id="location" label="Location" value={form.location} onChange={(v) => set('location', v)} placeholder="City, Country" />
            <Field id="email" label="Email" value={form.email} onChange={(v) => set('email', v)} placeholder="you@example.com" />
          </div>
          <AreaField id="bio" label="Bio" value={form.bio} onChange={(v) => set('bio', v)} placeholder="2–4 sentences, human voice." />
        </section>

        <section className="bg-white/5 border border-white/8 rounded-2xl p-6 space-y-4">
          <h2 className="text-white font-semibold">Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field id="github" label="GitHub URL" value={form.github} onChange={(v) => set('github', v)} placeholder="https://github.com/…" />
            <Field id="linkedin" label="LinkedIn URL" value={form.linkedin} onChange={(v) => set('linkedin', v)} placeholder="https://linkedin.com/in/…" />
            <Field id="twitter" label="Twitter URL" value={form.twitter} onChange={(v) => set('twitter', v)} placeholder="https://twitter.com/…" />
            <Field id="website" label="Website URL" value={form.website} onChange={(v) => set('website', v)} placeholder="https://…" />
          </div>
        </section>

        <section className="bg-white/5 border border-white/8 rounded-2xl p-6 space-y-4">
          <h2 className="text-white font-semibold">Media</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="avatar-file" className={labelClass}>Avatar</label>
              <div className="flex items-center gap-4">
                {form.avatar && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={form.avatar} alt="Avatar" className="h-14 w-14 rounded-full object-cover border border-white/8" />
                )}
                <input id="avatar-file" type="file" accept="image/png,image/jpeg,image/webp,image/gif" disabled={uploading === 'avatar'}
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f, 'avatars', 'avatar'); }}
                  className="block w-full text-sm text-gray-400 file:mr-3 file:rounded-lg file:border-0 file:bg-violet-600/20 file:px-3 file:py-2 file:text-sm file:text-violet-300 hover:file:bg-violet-600/30 disabled:opacity-50" />
              </div>
              {form.avatar && <button type="button" onClick={() => set('avatar', '')} className="text-xs text-gray-500 hover:text-red-400 mt-1 transition-colors">Remove avatar</button>}
            </div>
            <div>
              <label htmlFor="resume-file" className={labelClass}>Résumé (PDF)</label>
              <input id="resume-file" type="file" accept="application/pdf" disabled={uploading === 'resume'}
                onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f, 'resume', 'resume'); }}
                className="block w-full text-sm text-gray-400 file:mr-3 file:rounded-lg file:border-0 file:bg-violet-600/20 file:px-3 file:py-2 file:text-sm file:text-violet-300 hover:file:bg-violet-600/30 disabled:opacity-50" />
              {form.resume && (
                <p className="text-xs text-gray-500 mt-1 truncate">
                  Uploaded · <button type="button" onClick={() => set('resume', '')} className="text-gray-500 hover:text-red-400">remove</button>
                </p>
              )}
            </div>
          </div>
        </section>

        <section className="bg-white/5 border border-white/8 rounded-2xl p-6 space-y-4">
          <h2 className="text-white font-semibold">About narrative</h2>
          <AreaField id="about_journey" label="Journey" value={form.about_journey} onChange={(v) => set('about_journey', v)} placeholder="How you got into building software." />
          <AreaField id="about_current_focus" label="Current focus" value={form.about_current_focus} onChange={(v) => set('about_current_focus', v)} placeholder="What you're focused on right now." />
          <AreaField id="about_philosophy" label="Philosophy" value={form.about_philosophy} onChange={(v) => set('about_philosophy', v)} placeholder="How you think about building." />
          <AreaField id="about_learning" label="Learning" value={form.about_learning} onChange={(v) => set('about_learning', v)} placeholder="What you're learning or heading toward." />
        </section>

        <section className="bg-white/5 border border-white/8 rounded-2xl p-6 space-y-4">
          <h2 className="text-white font-semibold">Section copy</h2>
          <Field id="note" label="Footer note" value={form.note} onChange={(v) => set('note', v)} placeholder="Built to track what I'm making and how I'm improving." />
          <Field id="contact_note" label="Contact note" value={form.contact_note} onChange={(v) => set('contact_note', v)} placeholder="One line under the Contact heading." />
          <Field id="skills_note" label="Skills note" value={form.skills_note} onChange={(v) => set('skills_note', v)} placeholder="One line under the Skills heading." />
          <Field id="blog_intro" label="Blog intro" value={form.blog_intro} onChange={(v) => set('blog_intro', v)} placeholder="Blog page lead + meta description." />
        </section>

        <div className="flex gap-3">
          <button type="submit" disabled={saving || uploading !== null} className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white text-sm font-semibold disabled:opacity-70 hover:opacity-90 transition-opacity">
            {saving ? 'Saving…' : 'Save profile'}
          </button>
        </div>
      </form>
    </div>
  );
}
