'use client';

import Link from 'next/link';
import { FileText, Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useList } from '@/hooks/api/use-list';
import { ReportStatusBadge } from '@/features/dashboard/components/ReportStatusBadge';
import type { IMyReportDto } from '../types';

function formatRelativeTime(dateString: string | undefined | null): string {
  if (!dateString) return '-';

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '-';

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return 'Baru saja';
  if (diffMins < 60) return `${diffMins} menit lalu`;
  if (diffHours < 24) return `${diffHours} jam lalu`;
  if (diffDays < 7) return `${diffDays} hari lalu`;

  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

interface ReportItemProps {
  report: IMyReportDto;
}

function ReportItem({ report }: ReportItemProps) {
  const categoryName = report.categories?.[0]?.category_name ?? 'Umum';

  return (
    <Link
      href={`/dashboard/reports/${report.id}`}
      className="hover:border-primary/50 hover:bg-muted/30 block rounded-lg border p-4 transition-colors"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="line-clamp-1 font-medium">{report.title}</p>
          {report.description && (
            <p className="text-muted-foreground mt-1 line-clamp-2 text-sm">{report.description}</p>
          )}
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <ReportStatusBadge status={report.status} />
            <span className="text-muted-foreground text-xs">{categoryName}</span>
          </div>
        </div>
        <span className="text-muted-foreground shrink-0 text-xs">
          {formatRelativeTime(report.created_at)}
        </span>
      </div>
    </Link>
  );
}

function MyReportsListSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <Card key={i}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <div className="flex gap-2">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-5 w-16" />
                </div>
              </div>
              <Skeleton className="h-4 w-20" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="bg-muted mb-4 rounded-full p-4">
        <FileText className="text-muted-foreground h-8 w-8" />
      </div>
      <h3 className="mb-2 text-lg font-medium">Belum Ada Laporan</h3>
      <p className="text-muted-foreground mb-6 max-w-sm text-sm">
        Anda belum membuat laporan apapun. Mulai laporkan masalah di sekitar Anda.
      </p>
      <Button asChild>
        <Link href="/lapor" className="gap-2">
          <Plus className="h-4 w-4" />
          Buat Laporan Pertama
        </Link>
      </Button>
    </div>
  );
}

export function MyReportsList() {
  const {
    data: reports,
    isLoading,
    isError,
    refetch,
  } = useList<IMyReportDto>({
    resource: 'reports',
  });

  console.log('MyReportsList reports:', reports);

  if (isLoading) {
    return <MyReportsListSkeleton />;
  }

  if (isError) {
    return (
      <div className="border-destructive/50 bg-destructive/10 rounded-lg border p-6 text-center">
        <p className="text-destructive mb-2">Gagal memuat laporan Anda</p>
        <button
          onClick={() => refetch()}
          className="text-primary text-sm underline hover:no-underline"
        >
          Coba lagi
        </button>
      </div>
    );
  }

  if (!reports || reports.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-3">
      {reports.map((report) => (
        <ReportItem key={report.id} report={report} />
      ))}
    </div>
  );
}
