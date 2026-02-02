'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useOne } from '@/hooks/api/use-one';
import type { IDashboardTagOverviewDto, IReportTagType } from '@/features/dashboard/types';
import { TAG_LABELS } from '@/features/dashboard/types';
import { cn } from '@/lib/utils';

const tagStyles: Record<IReportTagType, { bg: string; bar: string }> = {
  normal: { bg: 'bg-muted', bar: 'bg-muted-foreground' },
  important: { bg: 'bg-info/20', bar: 'bg-info' },
  urgent: { bg: 'bg-warning/20', bar: 'bg-warning' },
  critical: { bg: 'bg-destructive/20', bar: 'bg-destructive' },
};

export function TagChart() {
  const { data, isLoading, isError, refetch } = useOne<IDashboardTagOverviewDto>({
    resource: 'dashboard/by-tag',
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Laporan per Prioritas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-1.5">
                <div className="bg-muted h-4 w-20 animate-pulse rounded" />
                <div className="bg-muted h-8 w-full animate-pulse rounded" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError || !data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Laporan per Prioritas</CardTitle>
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

  const tags = data.tags ?? [];

  if (tags.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Laporan per Prioritas</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center text-sm">Belum ada data prioritas</p>
        </CardContent>
      </Card>
    );
  }

  const maxCount = Math.max(...tags.map((t) => t.report_count), 1);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Laporan per Prioritas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {tags.map((tag) => {
            const style = tagStyles[tag.tag_type] ?? tagStyles.normal;
            const percentage = (tag.report_count / maxCount) * 100;
            const label = TAG_LABELS[tag.tag_type] ?? tag.label;

            return (
              <div key={tag.tag_type} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{label}</span>
                  <span className="text-muted-foreground">{tag.report_count} laporan</span>
                </div>
                <div className={cn('h-8 w-full overflow-hidden rounded', style.bg)}>
                  <div
                    className={cn('h-full rounded transition-all duration-500', style.bar)}
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
