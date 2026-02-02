import { DashboardHeader } from '@/features/dashboard/components/DashboardHeader';
import { SummaryCards } from '@/features/dashboard/components/SummaryCards';
import { CategoryChart } from '@/features/dashboard/components/CategoryChart';
import { TagChart } from '@/features/dashboard/components/TagChart';
import { RecentReportsList } from '@/features/dashboard/components/RecentReportsList';

/**
 * Dashboard Page
 *
 * Shows report statistics, recent submissions, category and priority breakdown.
 */
export default function DashboardPage() {
  return (
    <div className="bg-background min-h-screen">
      <DashboardHeader />
      <main className="mx-auto max-w-6xl space-y-6 px-4 py-6">
        {/* Summary Cards */}
        <SummaryCards />

        {/* Category & Priority Charts */}
        <div className="grid gap-6 lg:grid-cols-2">
          <CategoryChart />
          <TagChart />
        </div>

        {/* Recent Reports */}
        <RecentReportsList />
      </main>
    </div>
  );
}
