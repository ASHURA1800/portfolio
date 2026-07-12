import { DashboardSkeleton } from '@/components/admin/dashboard/states';
import { DashboardLayout, DashboardContent } from '@/components/admin/dashboard/layout';

export default function AdminDashboardLoading() {
  return (
    <DashboardLayout>
      <DashboardContent>
        <DashboardSkeleton />
      </DashboardContent>
    </DashboardLayout>
  );
}
