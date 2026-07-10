'use client';

import { motion } from 'motion/react';

/**
 * Renders a real logo image when provided; otherwise falls back to a
 * monogram badge derived from the company name. The `logo` field isn't in
 * the current DB schema, so this gracefully degrades until it is added.
 */
export function CompanyLogo({
  company,
  logo,
  size = 44,
}: {
  company: string;
  logo?: string;
  size?: number;
}) {
  const initials = company
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('');

  return (
    <motion.div
      whileHover={{ rotate: 6, scale: 1.06 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="flex shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-border-hover bg-surface shadow-sm"
      style={{ width: size, height: size }}
    >
      {logo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={logo} alt="" className="h-full w-full object-contain p-2" />
      ) : (
        <span
          className="text-sm font-semibold tracking-tight text-accent-300"
          aria-hidden="true"
        >
          {initials || '·'}
        </span>
      )}
    </motion.div>
  );
}
