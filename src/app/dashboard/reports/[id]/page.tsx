import { ReportDetail } from '@/features/dashboard/components/ReportDetail';

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
    <div className="bg-background min-h-screen">
      <ReportDetail reportId={id} />
    </div>
  );
}
