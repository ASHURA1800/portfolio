import { Badge, type BadgeTone } from './Badge';

export type ContentStatus =
  | 'published'
  | 'draft'
  | 'archived'
  | 'pending'
  | 'live'
  | 'in-progress'
  | 'concept';

// Maps every content-status string used across the CMS (Project.status,
// BuildLogEntry.status, blogs.published, etc.) onto Badge's real tone
// vocabulary — success/error/warning/info/neutral — rather than inventing
// per-status colors that don't exist in admin-theme.css.
const STATUS_TONE: Record<ContentStatus, BadgeTone> = {
  published: 'success',
  live: 'success',
  'in-progress': 'info',
  pending: 'warning',
  draft: 'neutral',
  concept: 'neutral',
  archived: 'error',
};

const STATUS_LABEL: Record<ContentStatus, string> = {
  published: 'Published',
  live: 'Live',
  draft: 'Draft',
  archived: 'Archived',
  pending: 'Pending',
  'in-progress': 'In progress',
  concept: 'Concept',
};

/**
 * Maps the content-status strings already used across the CMS to a
 * consistent Badge tone + dot, so every manager renders status the same
 * way without redefining its own color mapping.
 */
export function StatusBadge({
  status,
  size = 'md',
}: {
  status: ContentStatus;
  size?: 'sm' | 'md' | 'lg';
}) {
  return (
    <Badge tone={STATUS_TONE[status]} size={size} dot>
      {STATUS_LABEL[status]}
    </Badge>
  );
}
