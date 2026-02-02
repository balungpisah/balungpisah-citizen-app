'use client';

import { FileText, Clock, CheckCircle, Calendar, CalendarDays } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useOne } from '@/hooks/api/use-one';
import type { IDashboardSummaryDto } from '@/features/dashboard/types';
import { SummaryCardsSkeleton } from './SummaryCardsSkeleton';

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  colorClass?: string;
}

function StatCard({ label, value, icon, colorClass = 'text-primary' }: StatCardProps) {
  const displayValue = typeof value === 'number' ? value.toLocaleString('id-ID') : '0';

  return (
    <Card className="py-4">
      <CardContent className="flex items-center gap-3 px-4">
        <div className={`bg-muted rounded-lg p-2 ${colorClass}`}>{icon}</div>
        <div>
          <p className="text-muted-foreground text-xs">{label}</p>
          <p className="text-2xl font-bold">{displayValue}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export function SummaryCards() {
  const { data, isLoading, isError, refetch } = useOne<IDashboardSummaryDto>({
    resource: 'dashboard/summary',
  });

  if (isLoading) {
    return <SummaryCardsSkeleton />;
  }

  if (isError || !data) {
    return (
      <div className="border-destructive/50 bg-destructive/10 rounded-lg border p-4 text-center">
        <p className="text-destructive text-sm">Gagal memuat ringkasan</p>
        <button
          onClick={() => refetch()}
          className="text-primary mt-2 text-sm underline hover:no-underline"
        >
          Coba lagi
        </button>
      </div>
    );
  }

  const stats = [
    {
      label: 'Total Laporan',
      value: data.total_reports ?? 0,
      icon: <FileText className="h-5 w-5" />,
      colorClass: 'text-primary',
    },
    {
      label: 'Menunggu',
      value: data.pending_count ?? 0,
      icon: <Clock className="h-5 w-5" />,
      colorClass: 'text-status-review',
    },
    {
      label: 'Selesai',
      value: data.resolved_count ?? 0,
      icon: <CheckCircle className="h-5 w-5" />,
      colorClass: 'text-status-completed',
    },
    {
      label: 'Minggu Ini',
      value: data.reports_this_week ?? 0,
      icon: <Calendar className="h-5 w-5" />,
      colorClass: 'text-secondary',
    },
    {
      label: 'Bulan Ini',
      value: data.reports_this_month ?? 0,
      icon: <CalendarDays className="h-5 w-5" />,
      colorClass: 'text-info',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {stats.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </div>
  );
}
