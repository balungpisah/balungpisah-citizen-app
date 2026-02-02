'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useOne } from '@/hooks/api/use-one';
import type { IDashboardRecentDto, IDashboardReportDto } from '@/features/dashboard/types';
import { ReportStatusBadge } from './ReportStatusBadge';
import { RecentReportsListSkeleton } from './RecentReportsListSkeleton';

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
  });
}

interface ReportItemProps {
  report: IDashboardReportDto;
}

function ReportItem({ report }: ReportItemProps) {
  const id = report?.id ?? '';
  const title = report?.title ?? 'Tanpa judul';
  const description = report?.description ?? '';
  const status = report?.status ?? 'pending';
  const categories = report?.categories ?? [];
  const categoryName = categories[0]?.name ?? 'Umum';
  const createdAt = report?.created_at;

  if (!id) return null;

  return (
    <Link
      href={`/dashboard/reports/${id}`}
      className="hover:border-primary/50 hover:bg-muted/30 block rounded-lg border p-4 transition-colors"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="line-clamp-1 font-medium">{title}</p>
          {description && (
            <p className="text-muted-foreground mt-1 line-clamp-2 text-sm">{description}</p>
          )}
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <ReportStatusBadge status={status} />
            <span className="text-muted-foreground text-xs">{categoryName}</span>
          </div>
        </div>
        <span className="text-muted-foreground shrink-0 text-xs">
          {formatRelativeTime(createdAt)}
        </span>
      </div>
    </Link>
  );
}

export function RecentReportsList() {
  const { data, isLoading, isError, refetch } = useOne<IDashboardRecentDto>({
    resource: 'dashboard/recent?days=7&limit=10',
  });

  if (isLoading) {
    return <RecentReportsListSkeleton />;
  }

  if (isError || !data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Laporan Terbaru dari Warga</CardTitle>
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

  const reports = data.reports ?? [];

  if (reports.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Laporan Terbaru dari Warga</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center text-sm">
            Belum ada laporan baru dalam 7 hari terakhir. Terima kasih atas kondisi lingkungan yang
            kondusif!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Laporan Terbaru dari Warga</CardTitle>
          <span className="text-muted-foreground text-xs">7 hari terakhir</span>
        </div>
        <p className="text-muted-foreground text-sm">Pantau perkembangan laporan yang masuk</p>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2">
          {reports.map((report, index) => (
            <ReportItem key={report?.id ?? index} report={report} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
