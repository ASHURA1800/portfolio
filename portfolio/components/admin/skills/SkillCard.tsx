'use client';

import { motion } from 'motion/react';
import { Pencil, Trash2 } from 'lucide-react';
import type { Skill } from '@/types';
import { IconButton } from '@/components/admin/ui/IconButton';
import { Progress } from '@/components/admin/ui/Progress';
import { staggerItem } from '@/components/admin/ui/motion-presets';

interface SkillCardProps {
  skill: Skill;
  onEdit: (s: Skill) => void;
  onDelete: (s: Skill) => void;
  index: number;
}

/** Single skill card for the Skills grid — name, proficiency bar, years,
 *  optional icon/context. Uses `layout` so removing/filtering skills
 *  reflows the grid smoothly (paired with AnimatePresence mode="popLayout"
 *  in SkillsManager). */
export function SkillCard({ skill, onEdit, onDelete }: SkillCardProps) {
  return (
    <motion.div
      layout
      variants={staggerItem}
      initial="hidden"
      animate="show"
      exit="exit"
      className="flex flex-col bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-4 hover:border-[var(--color-border-hover)] transition-colors"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          {skill.icon && <span className="text-lg shrink-0">{skill.icon}</span>}
          <h3 className="text-[var(--color-ink)] font-medium truncate">{skill.name}</h3>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <IconButton label="Edit" icon={<Pencil size={13} />} size="sm" variant="ghost" onClick={() => onEdit(skill)} />
          <IconButton label="Delete" icon={<Trash2 size={13} />} size="sm" variant="danger" onClick={() => onDelete(skill)} />
        </div>
      </div>

      <div className="mt-3">
        <Progress value={skill.proficiency} size="sm" showValue />
      </div>

      <div className="flex items-center justify-between mt-2">
        <span className="text-xs text-[var(--color-faint)]">{skill.years}</span>
      </div>

      {skill.context && <p className="text-xs text-[var(--color-muted)] mt-2 line-clamp-2">{skill.context}</p>}
    </motion.div>
  );
}
