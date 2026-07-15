import { FileQuestion } from 'lucide-react';
import Link from 'next/link';
import { EmptyState } from '@/components/admin/ui/EmptyState';
import { Button } from '@/components/admin/ui/Button';

/** Renders inside the (protected) layout — full sidebar/navbar shell, and
 *  only reachable by an already-authenticated admin (the layout's auth
 *  guard runs before this can render). */
export default function AdminNotFound() {
  return (
    <div className="flex items-center justify-center h-full">
      <EmptyState
        icon={<FileQuestion />}
        title="Page not found"
        description="This admin page doesn't exist, or the item you're looking for may have been deleted."
        action={
          <Link href="/admin">
            <Button variant="primary">Back to dashboard</Button>
          </Link>
        }
      />
    </div>
  );
}
