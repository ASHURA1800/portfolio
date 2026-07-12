import Link from 'next/link';
import { Compass } from 'lucide-react';
import { EmptyState } from '@/components/admin/ui/EmptyState';
import { Button } from '@/components/admin/ui/Button';

export interface EmptyDashboardProps {
  /** Where "Get started" should send them — first empty section, e.g. /admin/profile */
  href?: string;
}

/** Shown when literally nothing has been added yet — every section count
 *  is zero. A friendlier alternative to a dashboard full of "0" stat
 *  cards on a brand-new install. */
export function EmptyDashboard({ href = '/admin/profile' }: EmptyDashboardProps) {
  return (
    <EmptyState
      icon={<Compass />}
      title="Your dashboard is ready, but empty"
      description="Add your profile, a project, or a skill to start seeing real stats and charts here."
      action={
        <Link href={href}>
          <Button variant="primary">Get started</Button>
        </Link>
      }
    />
  );
}
