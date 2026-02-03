'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useOne } from '@/hooks/api/use-one';
import type { IDashboardCategoryOverviewDto } from '@/features/dashboard/types';
import { CategoryChartSkeleton } from './CategoryChartSkeleton';

export function CategoryChart() {
  const { data, isLoading, isError, refetch } = useOne<IDashboardCategoryOverviewDto>({
    resource: 'dashboard/by-category',
  });

  if (isLoading) {
    return <CategoryChartSkeleton />;
  }

  if (isError || !data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Laporan per Kategori</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border-destructive/50 bg-destructive/10 rounded-lg border p-4 text-center">
            <p className="text-destructive text-sm">Gagal memuat data</p>
            <button
              onClick={() => refetch()}
              className="text-primary mt-2 text-sm underline hover:no-underline"
            >
              Coba lagi
            </button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const categories = data.categories ?? [];

  if (categories.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Laporan per Kategori</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center text-sm">Belum ada data kategori</p>
        </CardContent>
      </Card>
    );
  }

  const maxCount = Math.max(...categories.map((c) => c?.report_count ?? 0), 1);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Laporan per Kategori</CardTitle>
        <p className="text-muted-foreground text-sm">
          Sebaran laporan berdasarkan jenis permasalahan
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {categories.map((cat) => {
            const count = cat?.report_count ?? 0;
            const percentage = (count / maxCount) * 100;

            return (
              <div key={cat?.id ?? cat?.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{cat?.name ?? '-'}</span>
                  <span className="text-muted-foreground">{count} laporan</span>
                </div>
                <div className="bg-muted h-6 w-full overflow-hidden rounded">
                  <div
                    className="bg-primary h-full rounded transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
