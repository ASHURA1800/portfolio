import { Fragment } from 'react';
import { cn } from '@/lib/utils';

export interface MarkdownLiteProps {
  text: string;
  className?: string;
}

/**
 * Minimal, dependency-free markdown renderer for admin previews. Supports
 * headers (#/##/###), bold, italic, inline code, links, and bullet/numbered
 * lists — enough for build-log and learning entries without adding a new
 * runtime dependency (which has previously broken Vercel builds silently
 * when left out of package.json). Not a full CommonMark implementation;
 * unsupported syntax renders as plain text rather than erroring.
 */
export function MarkdownLite({ text, className }: MarkdownLiteProps) {
  if (!text.trim()) {
    return <p className={cn('text-sm text-[var(--color-faint)] italic', className)}>Nothing to preview.</p>;
  }

  const lines = text.split('\n');
  const blocks: React.ReactNode[] = [];
  let listBuffer: { ordered: boolean; items: string[] } | null = null;

  const flushList = (key: string) => {
    if (!listBuffer) return;
    const Tag = listBuffer.ordered ? 'ol' : 'ul';
    blocks.push(
      <Tag
        key={key}
        className={cn(
          'pl-5 my-1.5 space-y-0.5 text-sm text-[var(--color-muted)]',
          listBuffer.ordered ? 'list-decimal' : 'list-disc'
        )}
      >
        {listBuffer.items.map((item, i) => (
          <li key={i}>{renderInline(item)}</li>
        ))}
      </Tag>
    );
    listBuffer = null;
  };

  lines.forEach((line, idx) => {
    const key = `l-${idx}`;
    const h3 = line.match(/^###\s+(.*)/);
    const h2 = line.match(/^##\s+(.*)/);
    const h1 = line.match(/^#\s+(.*)/);
    const bullet = line.match(/^[-*]\s+(.*)/);
    const numbered = line.match(/^\d+\.\s+(.*)/);

    if (bullet) {
      if (!listBuffer || listBuffer.ordered) { flushList(key); listBuffer = { ordered: false, items: [] }; }
      listBuffer.items.push(bullet[1]);
      return;
    }
    if (numbered) {
      if (!listBuffer || !listBuffer.ordered) { flushList(key); listBuffer = { ordered: true, items: [] }; }
      listBuffer.items.push(numbered[1]);
      return;
    }
    flushList(key);

    if (h3) { blocks.push(<h3 key={key} className="text-sm font-semibold text-[var(--color-ink)] mt-2">{renderInline(h3[1])}</h3>); return; }
    if (h2) { blocks.push(<h2 key={key} className="text-base font-semibold text-[var(--color-ink)] mt-2.5">{renderInline(h2[1])}</h2>); return; }
    if (h1) { blocks.push(<h1 key={key} className="text-lg font-bold text-[var(--color-ink)] mt-3">{renderInline(h1[1])}</h1>); return; }
    if (line.trim() === '') { blocks.push(<div key={key} className="h-2" />); return; }

    blocks.push(<p key={key} className="text-sm text-[var(--color-muted)] leading-relaxed">{renderInline(line)}</p>);
  });
  flushList('l-final');

  return <div className={cn('space-y-0.5', className)}>{blocks}</div>;
}

/** Inline spans: **bold**, *italic*, `code`, [text](url). Processed left-to-right, non-overlapping. */
function renderInline(text: string): React.ReactNode {
  const pattern = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
  const parts = text.split(pattern).filter((p) => p !== '');

  return (
    <>
      {parts.map((part, i) => {
        if (/^\*\*[^*]+\*\*$/.test(part)) {
          return <strong key={i} className="font-semibold text-[var(--color-ink)]">{part.slice(2, -2)}</strong>;
        }
        if (/^\*[^*]+\*$/.test(part)) {
          return <em key={i}>{part.slice(1, -1)}</em>;
        }
        if (/^`[^`]+`$/.test(part)) {
          return (
            <code key={i} className="px-1 py-0.5 rounded bg-[var(--color-surface-hover)] text-[var(--color-accent-400)] text-[0.85em] font-mono">
              {part.slice(1, -1)}
            </code>
          );
        }
        const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (link) {
          return (
            <a key={i} href={link[2]} target="_blank" rel="noopener noreferrer" className="text-[var(--color-accent-400)] underline underline-offset-2 hover:text-[var(--color-accent-300)]">
              {link[1]}
            </a>
          );
        }
        return <Fragment key={i}>{part}</Fragment>;
      })}
    </>
  );
}
