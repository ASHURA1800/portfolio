import {
  FolderPlus,
  Wrench,
  Briefcase,
  Award,
  UserRoundPen,
  Hammer,
  BookOpen,
  Map,
} from 'lucide-react';
import ActionCard from './ActionCard';

/**
 * Quick action definitions — all hrefs are existing admin routes.
 * Labels and descriptions follow "active verb" copy convention.
 * Accent colours are drawn from the Aurora Graphite token set and kept
 * distinct enough to scan without becoming a rainbow.
 */
const QUICK_ACTIONS = [
  {
    key: 'project',
    label: 'Add project',
    description: 'Document a new case study',
    href: '/admin/projects/new',
    icon: FolderPlus,
    accent: 'rgba(124,77,255,0.13)',
  },
  {
    key: 'skill',
    label: 'Add skill',
    description: 'Expand your tech stack',
    href: '/admin/skills',
    icon: Wrench,
    accent: 'rgba(34,197,245,0.11)',
  },
  {
    key: 'experience',
    label: 'Add experience',
    description: 'Record a role or contract',
    href: '/admin/experience',
    icon: Briefcase,
    accent: 'rgba(52,211,153,0.11)',
  },
  {
    key: 'certification',
    label: 'Add certification',
    description: 'Upload a new credential',
    href: '/admin/certifications',
    icon: Award,
    accent: 'rgba(251,191,36,0.11)',
  },
  {
    key: 'profile',
    label: 'Edit profile',
    description: 'Update bio and headline',
    href: '/admin/profile',
    icon: UserRoundPen,
    accent: 'rgba(168,85,247,0.11)',
  },
  {
    key: 'buildlog',
    label: 'Add build log',
    description: 'Log what you shipped today',
    href: '/admin/buildlog',
    icon: Hammer,
    accent: 'rgba(249,115,22,0.11)',
  },
  {
    key: 'learning',
    label: 'Add learning',
    description: 'Capture a new insight',
    href: '/admin/learnings',
    icon: BookOpen,
    accent: 'rgba(34,197,94,0.11)',
  },
  {
    key: 'roadmap',
    label: 'Update roadmap',
    description: "Edit what's coming next",
    href: '/admin/roadmap',
    icon: Map,
    accent: 'rgba(239,68,68,0.10)',
  },
] as const;

/**
 * QuickActions
 * 2×4 responsive grid of ActionCard tiles. RSC — no interactivity at this
 * level, animation lives inside ActionCard (client).
 */
export default function QuickActions() {
  return (
    <div>
      {/* Panel header */}
      <div style={{ marginBottom: '0.875rem' }}>
        <h3
          style={{
            fontSize: 'var(--text-sm)',
            fontWeight: 600,
            color: 'var(--color-ink)',
            letterSpacing: 'var(--tracking-tight)',
            lineHeight: 1,
            marginBottom: '0.1875rem',
          }}
        >
          Quick actions
        </h3>
        <p
          style={{
            fontSize: 'var(--text-xs)',
            color: 'var(--color-faint)',
            lineHeight: 1,
          }}
        >
          Jump straight to a section
        </p>
      </div>

      {/* 4-col grid → 2-col on small → 1-col on xs */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '0.5rem',
        }}
      >
        <style>{`
          @media (min-width: 480px) {
            .quick-actions-grid { grid-template-columns: repeat(2, 1fr) !important; }
          }
          @media (min-width: 1280px) {
            .quick-actions-grid { grid-template-columns: repeat(4, 1fr) !important; }
          }
        `}</style>
        {QUICK_ACTIONS.map((action, i) => (
          <ActionCard key={action.key} {...action} index={i} />
        ))}
      </div>
    </div>
  );
}
