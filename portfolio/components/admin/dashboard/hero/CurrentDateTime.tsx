'use client';

import { useState, useEffect } from 'react';

const DAY = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTH = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function formatDate(d: Date) {
  return `${DAY[d.getDay()]}, ${MONTH[d.getMonth()]} ${d.getDate()}`;
}

function formatTime(d: Date) {
  const h = d.getHours();
  const m = d.getMinutes().toString().padStart(2, '0');
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return { time: `${hour}:${m}`, ampm };
}

/**
 * CurrentDateTime
 * Live date + time, ticking every second. Server-renders with a stable
 * placeholder (empty) to avoid hydration mismatch — the clock only starts
 * running after mount.
 */
export default function CurrentDateTime() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!now) {
    // Server / pre-hydration: render invisible placeholder to avoid layout shift
    return (
      <div style={{ height: '2.5rem', opacity: 0 }} aria-hidden="true" />
    );
  }

  const { time, ampm } = formatTime(now);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'baseline',
        gap: '0.625rem',
        flexWrap: 'wrap',
      }}
    >
      {/* Time */}
      <span
        style={{
          fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
          fontWeight: 700,
          letterSpacing: 'var(--tracking-tightest)',
          color: 'var(--color-ink)',
          lineHeight: 1,
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {time}
      </span>
      <span
        style={{
          fontSize: 'var(--text-sm)',
          fontWeight: 500,
          color: 'var(--color-faint)',
          letterSpacing: 'var(--tracking-wide)',
        }}
      >
        {ampm}
      </span>

      {/* Separator */}
      <span
        style={{
          color: 'var(--color-border-strong)',
          fontSize: 'var(--text-sm)',
          lineHeight: 1,
          alignSelf: 'center',
        }}
        aria-hidden="true"
      >
        ·
      </span>

      {/* Date */}
      <span
        style={{
          fontSize: 'var(--text-sm)',
          color: 'var(--color-muted)',
          letterSpacing: 'var(--tracking-tight)',
        }}
      >
        {formatDate(now)}
      </span>
    </div>
  );
}
