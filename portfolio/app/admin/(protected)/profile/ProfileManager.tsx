'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import type { Skill } from '@/types';
import { CrudPage, CrudHeader } from '@/components/admin/crud';
import { GlassCard } from '@/components/admin/ui/GlassCard';
import { Button } from '@/components/admin/ui/Button';
import { Alert } from '@/components/admin/ui/Alert';
import { FloatingField } from '@/components/admin/profile/FloatingField';
import { FloatingTextarea } from '@/components/admin/profile/FloatingTextarea';
import { AvatarUploader } from '@/components/admin/profile/AvatarUploader';
import { AutosaveIndicator, type AutosaveState } from '@/components/admin/profile/AutosaveIndicator';
import { SkillsPreview } from '@/components/admin/profile/SkillsPreview';
import { PortfolioLinks } from '@/components/admin/profile/PortfolioLinks';

// Snake_case, matching profileSchema / the DB row. `initial` is the raw row or null.
// Unchanged from the audited original.
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

interface ProfileManagerProps {
  initial: Partial<ProfileForm> | null;
  skills: Skill[];
}

export default function ProfileManager({ initial, skills }: ProfileManagerProps) {
  const [form, setForm] = useState<ProfileForm>(toForm(initial));
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<'avatar' | 'resume' | null>(null);
  const [dirty, setDirty] = useState(false);

  const set = (key: keyof ProfileForm, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    setSaved(false);
    setDirty(true);
  };

  // Upload logic unchanged from the audited original — same endpoint,
  // same FormData shape, same error handling.
  const upload = async (file: File, bucket: 'avatars' | 'resume', field: 'avatar' | 'resume') => {
    setUploading(field);
    setError('');
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch(`/api/storage/${bucket}`, { method: 'POST', body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) {
        setError(data.error ?? 'Upload failed');
        return;
      }
      set(field, data.data.url as string);
    } catch {
      setError('Upload failed.');
    } finally {
      setUploading(null);
    }
  };

  // Save logic unchanged from the audited original — same endpoint,
  // method, and payload shape.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    setError('');
    setSaved(false);
    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(FIELDS.map((k) => [k, form[k].trim()]))),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) {
        setError(data.error ?? 'Save failed');
        setSaving(false);
        return;
      }
      setSaved(true);
      setDirty(false);
    } catch {
      setError('Save failed.');
    } finally {
      setSaving(false);
    }
  };

  const autosaveState: AutosaveState = saving ? 'saving' : saved ? 'saved' : dirty ? 'dirty' : 'idle';

  return (
    <CrudPage>
      <CrudHeader
        title="Profile"
        description="Single source of identity — drives the navbar, hero, about, footer, and SEO metadata."
        actions={<AutosaveIndicator state={autosaveState} />}
      />

      <AnimatePresence mode="wait">
        {error && (
          <Alert variant="error" key="profile-error" className="mb-6">
            {error}
          </Alert>
        )}
        {saved && !error && (
          <Alert variant="success" key="profile-saved" className="mb-6">
            Profile saved.
          </Alert>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <GlassCard className="flex flex-col gap-4">
            <h2 className="text-[var(--color-ink)] font-semibold">Identity</h2>
            <div className="flex items-center gap-4">
              <AvatarUploader
                value={form.avatar}
                uploading={uploading === 'avatar'}
                onFile={(f) => upload(f, 'avatars', 'avatar')}
                onRemove={() => set('avatar', '')}
                name={form.name}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FloatingField label="Name" value={form.name} onChange={(e) => set('name', e.target.value)} maxLength={80} showCount />
              <FloatingField label="Username / handle" value={form.username} onChange={(e) => set('username', e.target.value)} />
              <FloatingField label="Title" value={form.title} onChange={(e) => set('title', e.target.value)} maxLength={100} showCount />
              <FloatingField label="Current work" value={form.current_work} onChange={(e) => set('current_work', e.target.value)} />
              <FloatingField label="Location" value={form.location} onChange={(e) => set('location', e.target.value)} />
              <FloatingField label="Email" type="email" value={form.email} onChange={(e) => set('email', e.target.value)} />
            </div>
            <FloatingTextarea
              label="Bio"
              value={form.bio}
              onChange={(e) => set('bio', e.target.value)}
              hint="2–4 sentences, human voice."
              maxLength={280}
              showCount
            />
          </GlassCard>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.05 }}>
          <GlassCard className="flex flex-col gap-4">
            <h2 className="text-[var(--color-ink)] font-semibold">Social links</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FloatingField label="GitHub URL" type="url" value={form.github} onChange={(e) => set('github', e.target.value)} />
              <FloatingField label="LinkedIn URL" type="url" value={form.linkedin} onChange={(e) => set('linkedin', e.target.value)} />
              <FloatingField label="Twitter URL" type="url" value={form.twitter} onChange={(e) => set('twitter', e.target.value)} />
              <FloatingField label="Website URL" type="url" value={form.website} onChange={(e) => set('website', e.target.value)} />
            </div>
          </GlassCard>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }}>
          <GlassCard className="flex flex-col gap-4">
            <h2 className="text-[var(--color-ink)] font-semibold">Résumé</h2>
            <div>
              <input
                id="resume-file"
                type="file"
                accept="application/pdf"
                disabled={uploading === 'resume'}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) upload(f, 'resume', 'resume');
                }}
                className="block w-full text-sm text-[var(--color-faint)] file:mr-3 file:rounded-lg file:border-0 file:bg-[var(--color-accent-500)]/20 file:px-3 file:py-2 file:text-sm file:text-[var(--color-accent-300)] hover:file:bg-[var(--color-accent-500)]/30 disabled:opacity-50"
              />
              {uploading === 'resume' && <p className="text-xs text-[var(--color-faint)] mt-2">Uploading…</p>}
              {form.resume && uploading !== 'resume' && (
                <p className="text-xs text-[var(--color-faint)] mt-2 truncate">
                  Uploaded ·{' '}
                  <button type="button" onClick={() => set('resume', '')} className="text-[var(--color-faint)] hover:text-[var(--color-error)]">
                    remove
                  </button>
                </p>
              )}
            </div>
          </GlassCard>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.15 }}>
          <GlassCard className="flex flex-col gap-4">
            <h2 className="text-[var(--color-ink)] font-semibold">About narrative</h2>
            <FloatingTextarea label="Journey" value={form.about_journey} onChange={(e) => set('about_journey', e.target.value)} hint="How you got into building software." />
            <FloatingTextarea label="Current focus" value={form.about_current_focus} onChange={(e) => set('about_current_focus', e.target.value)} hint="What you're focused on right now." />
            <FloatingTextarea label="Philosophy" value={form.about_philosophy} onChange={(e) => set('about_philosophy', e.target.value)} hint="How you think about building." />
            <FloatingTextarea label="Learning" value={form.about_learning} onChange={(e) => set('about_learning', e.target.value)} hint="What you're learning or heading toward." />
          </GlassCard>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.2 }}>
          <GlassCard className="flex flex-col gap-4">
            <h2 className="text-[var(--color-ink)] font-semibold">Section copy</h2>
            <FloatingField label="Footer note" value={form.note} onChange={(e) => set('note', e.target.value)} />
            <FloatingField label="Contact note" value={form.contact_note} onChange={(e) => set('contact_note', e.target.value)} />
            <FloatingField label="Skills note" value={form.skills_note} onChange={(e) => set('skills_note', e.target.value)} />
            <FloatingField label="Blog intro" value={form.blog_intro} onChange={(e) => set('blog_intro', e.target.value)} />
          </GlassCard>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.25 }}>
          <GlassCard className="flex flex-col gap-4">
            <h2 className="text-[var(--color-ink)] font-semibold">Skills preview</h2>
            <SkillsPreview skills={skills} />
          </GlassCard>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.3 }}>
          <GlassCard className="flex flex-col gap-4">
            <h2 className="text-[var(--color-ink)] font-semibold">View live</h2>
            <PortfolioLinks />
          </GlassCard>
        </motion.div>

        <div className="flex gap-3">
          <Button type="submit" variant="primary" loading={saving} disabled={uploading !== null}>
            {saving ? 'Saving…' : 'Save profile'}
          </Button>
        </div>
      </form>
    </CrudPage>
  );
}
