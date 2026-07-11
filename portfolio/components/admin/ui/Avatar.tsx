'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

export interface AvatarProps {
  src?: string | null;
  name?: string;
  size?: AvatarSize;
  className?: string;
}

const SIZES: Record<AvatarSize, string> = {
  sm: 'w-7 h-7 text-xs',
  md: 'w-9 h-9 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-xl',
};

function getInitials(name?: string) {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  const initials = parts.slice(0, 2).map((p) => p[0]?.toUpperCase() ?? '');
  return initials.join('') || '?';
}

export function Avatar({ src, name, size = 'md', className }: AvatarProps) {
  const [errored, setErrored] = useState(false);
  const showImage = src && !errored;

  return (
    <span
      className={cn(
        'relative inline-flex items-center justify-center shrink-0 rounded-full overflow-hidden select-none',
        'bg-[var(--color-accent-500)]/15 text-[var(--color-accent-300)] font-medium',
        'border border-[var(--color-border)]',
        SIZES[size],
        className
      )}
    >
      {showImage ? (
        // eslint-disable-next-line @next/next/no-img-element -- small avatar, remote/blob source varies
        <img
          src={src}
          alt={name ? `${name}'s avatar` : 'Avatar'}
          className="w-full h-full object-cover"
          onError={() => setErrored(true)}
        />
      ) : (
        <span aria-hidden="true">{getInitials(name)}</span>
      )}
    </span>
  );
}
