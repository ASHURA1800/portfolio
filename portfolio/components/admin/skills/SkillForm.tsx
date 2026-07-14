'use client';

import { AnimatePresence, motion } from 'motion/react';
import type { SkillCategory } from '@/types';
import { skillCategories } from '@/lib/content/skills';
import { fadeIn } from '@/components/admin/ui/motion-presets';
import { Input } from '@/components/admin/ui/Input';
import { Textarea } from '@/components/admin/ui/Textarea';
import { Select } from '@/components/admin/ui/Select';
import { Button } from '@/components/admin/ui/Button';
import { Alert } from '@/components/admin/ui/Alert';

export interface SkillFormState {
  name: string;
  category: SkillCategory;
  proficiency: number;
  years: string;
  context: string;
  icon: string;
  order_index: number;
}

interface SkillFormProps {
  open: boolean;
  editing: boolean;
  form: SkillFormState;
  saving: boolean;
  error: string;
  onChange: <K extends keyof SkillFormState>(key: K, value: SkillFormState[K]) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

/** Slide-down create/edit form for a single skill entry. */
export function SkillForm({ open, editing, form, saving, error, onChange, onSubmit, onCancel }: SkillFormProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.form
          initial="hidden" animate="show" exit="exit" variants={fadeIn}
          onSubmit={onSubmit}
          className="mb-8 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-6 space-y-4"
        >
          <h2 className="text-[var(--color-ink)] font-semibold">{editing ? 'Edit skill' : 'New skill'}</h2>

          {error && <Alert variant="error">{error}</Alert>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Name" required value={form.name} onChange={(e) => onChange('name', e.target.value)} placeholder="TypeScript" />
            <Select
              label="Category"
              value={form.category}
              onChange={(e) => onChange('category', e.target.value as SkillCategory)}
              options={skillCategories.map((c) => ({ value: c, label: c }))}
            />
          </div>

          <div>
            <label htmlFor="skill-proficiency" className="text-sm font-medium text-[var(--color-ink)] mb-1.5 block">
              Proficiency — {form.proficiency}%
            </label>
            <input
              id="skill-proficiency" type="range" min={0} max={100} step={5}
              value={form.proficiency}
              onChange={(e) => onChange('proficiency', Number(e.target.value))}
              className="w-full accent-[var(--color-accent-500)]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input label="Years" value={form.years} onChange={(e) => onChange('years', e.target.value)} placeholder="3+ years" />
            <Input label="Icon (emoji)" value={form.icon} onChange={(e) => onChange('icon', e.target.value)} placeholder="⚡" maxLength={4} />
            <Input label="Order" type="number" value={form.order_index} onChange={(e) => onChange('order_index', Number(e.target.value))} />
          </div>

          <Textarea label="Context" rows={2} value={form.context} onChange={(e) => onChange('context', e.target.value)} placeholder="Where and how you've used this." />

          <div className="flex gap-3 pt-2">
            <Button type="submit" loading={saving}>{editing ? 'Save changes' : 'Create'}</Button>
            <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
