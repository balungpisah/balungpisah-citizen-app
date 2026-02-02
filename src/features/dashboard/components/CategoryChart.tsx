'use client';

import { Bar, BarChart, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { useOne } from '@/hooks/api/use-one';
import type { IDashboardCategoryOverviewDto } from '@/features/dashboard/types';
import { CategoryChartSkeleton } from './CategoryChartSkeleton';

const chartConfig = {
  total: {
    label: 'Total',
    color: 'var(--chart-1)',
  },
  pending: {
    label: 'Menunggu',
    color: 'var(--chart-2)',
  },
  resolved: {
    label: 'Selesai',
    color: 'var(--chart-4)',
  },
} satisfies ChartConfig;

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

  const chartData = categories.map((cat) => ({
    name: cat?.name ?? '-',
    total: cat?.report_count ?? 0,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Laporan per Kategori</CardTitle>
        <p className="text-muted-foreground text-sm">
          Sebaran laporan berdasarkan jenis permasalahan
        </p>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <XAxis type="number" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis
              type="category"
              dataKey="name"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              width={100}
              tickFormatter={(value) =>
                typeof value === 'string' && value.length > 12 ? `${value.slice(0, 12)}...` : value
              }
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="total" fill="var(--color-total)" radius={[0, 4, 4, 0]} barSize={20} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
