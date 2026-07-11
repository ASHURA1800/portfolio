import { Badge } from './Badge';

export type ContentStatus = 'published' | 'draft' | 'archived' | 'pending' | 'live' | 'in-progress' | 'concept';

const STATUS_VARIANT: Record<ContentStatus, 'published' | 'draft' | 'archived' | 'pending' | 'success' | 'accent'> = {
  published: 'published',
  live: 'success',
  draft: 'draft',
  archived: 'archived',
  pending: 'pending',
  'in-progress': 'accent',
  concept: 'draft',
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
 * Maps the content-status strings already used across the CMS
 * (Project.status, BuildLogEntry.status, blogs.published, etc.) to a
 * consistent Badge variant + dot, so every manager renders status the
 * same way without redefining its own color mapping.
 */
export function StatusBadge({ status, size = 'md' }: { status: ContentStatus; size?: 'sm' | 'md' | 'lg' }) {
  return (
    <Badge variant={STATUS_VARIANT[status]} size={size} dot>
      {STATUS_LABEL[status]}
    </Badge>
  );
}
