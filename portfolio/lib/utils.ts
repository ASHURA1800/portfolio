import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { Experience } from '@/types';

/** Tailwind class merging utility */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** "2023" / "Jan 2023" → "Jan 2023 — Present" / "… — 2024" / start only. */
export function formatDateRange(
  e: Pick<Experience, 'current' | 'start_date' | 'end_date'>
): string {
  if (e.current) return `${e.start_date} — Present`;
  if (e.end_date) return `${e.start_date} — ${e.end_date}`;
  return e.start_date;
}
