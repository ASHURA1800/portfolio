'use client';

import { motion } from 'motion/react';
import { Code2 } from 'lucide-react';
import type { Skill } from '@/types';

const EASE = [0.22, 1, 0.36, 1] as const;

const isImage = (s: string) => s.startsWith('/') || s.startsWith('http');

export function SkillCard({ skill, index }: { skill: Skill; index: number }) {
  const pct = Math.max(0, Math.min(100, skill.proficiency));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.05, 0.4), ease: EASE }}
      whileHover={{ y: -6 }}
      className="card-glow group relative flex flex-col gap-4 overflow-hidden rounded-[var(--radius-lg)] p-5"
    >
      {/* Hover glow sweep */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-accent-500/0 via-accent-500/0 to-accent2-500/0 opacity-0 transition-opacity duration-500 group-hover:from-accent-500/10 group-hover:via-transparent group-hover:to-accent2-500/8 group-hover:opacity-100"
        aria-hidden="true"
      />

      <div className="flex items-center justify-between">
        <motion.div
          whileHover={{ rotate: 8, scale: 1.08 }}
          transition={{ duration: 0.25, ease: EASE }}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border bg-surface text-accent-300 transition-colors duration-300 group-hover:border-accent-500/40"
        >
          {skill.icon ? (
            isImage(skill.icon) ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={skill.icon} alt="" className="h-5 w-5 object-contain" />
            ) : (
              <span className="text-lg leading-none" aria-hidden="true">
                {skill.icon}
              </span>
            )
          ) : (
            <Code2 size={18} strokeWidth={1.5} />
          )}
        </motion.div>
        <span className="text-xs font-medium tabular-nums text-faint">{pct}%</span>
      </div>

      <div>
        <h3 className="text-sm font-medium text-ink">{skill.name}</h3>
        {(skill.years || skill.context) && (
          <p className="mt-1 text-xs text-faint">
            {skill.years}
            {skill.years && skill.context && ' · '}
            {skill.context}
          </p>
        )}
      </div>

      {/* Animated progress bar */}
      <div className="mt-auto h-1 w-full overflow-hidden rounded-full bg-border" aria-hidden="true">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${pct}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: Math.min(index * 0.05, 0.4) + 0.15, ease: EASE }}
          className="h-full rounded-full bg-gradient-to-r from-accent-500 to-accent2-400"
        />
      </div>
    </motion.div>
  );
}
