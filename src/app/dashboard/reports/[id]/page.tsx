import { ReportDetail } from '@/features/dashboard/components/ReportDetail';
import { ReportDetailHeader } from '@/features/dashboard/components/ReportDetailHeader';
import { AppShell } from '@/components/layout/AppShell';

interface ReportDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

/**
 * Report Detail Page
 *
 * Shows detailed information about a specific report.
 */
export default async function ReportDetailPage({ params }: ReportDetailPageProps) {
  const { id } = await params;

  return (
    <AppShell>
      <ReportDetailHeader />
      <ReportDetail reportId={id} />
    </AppShell>
  );
}
