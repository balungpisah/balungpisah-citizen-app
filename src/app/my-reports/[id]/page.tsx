'use client';

import { use } from 'react';
import { Calendar, MapPin, Tag, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useOne } from '@/hooks/api/use-one';
import { ReportStatusBadge } from '@/features/dashboard/components/ReportStatusBadge';
import type { IDashboardReportDetailDto } from '@/features/dashboard/types';
import { TAG_LABELS } from '@/features/dashboard/types';

interface MyReportDetailPageProps {
  params: Promise<{ id: string }>;
}

function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return '-';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '-';
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function DetailSkeleton() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <Card>
        <CardHeader className="space-y-4">
          <div className="flex gap-2">
            <Skeleton className="h-5 w-20 rounded-full" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
          <Skeleton className="h-7 w-3/4" />
          <div className="flex gap-4">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-40" />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Skeleton className="mb-2 h-4 w-16" />
            <div className="flex gap-2">
              <Skeleton className="h-7 w-24 rounded-full" />
              <Skeleton className="h-7 w-28 rounded-full" />
            </div>
          </div>
          <div>
            <Skeleton className="mb-2 h-4 w-20" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
          <div className="border-t pt-4">
            <div className="grid gap-2 sm:grid-cols-2">
              <Skeleton className="h-3 w-40" />
              <Skeleton className="h-3 w-44" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function MyReportDetailPage({ params }: MyReportDetailPageProps) {
  const { id } = use(params);

  const { data, isLoading, isError, refetch } = useOne<IDashboardReportDetailDto>({
    resource: `reports/${id}`,
  });

  const tagLabel = data?.tag_type ? TAG_LABELS[data.tag_type] : null;
  const locationDisplay = data?.location?.display_name || data?.location?.raw_input;

  return (
    <AppShell>
      <PageHeader
        breadcrumbs={[
          { label: 'Laporan Saya', href: '/my-reports' },
          { label: data?.title || 'Memuat...' },
        ]}
      />

      {isLoading ? (
        <DetailSkeleton />
      ) : isError || !data ? (
        <div className="mx-auto max-w-6xl px-4 py-6">
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <AlertTriangle className="text-destructive mx-auto h-12 w-12" />
                <p className="mt-4 text-lg font-medium">Gagal memuat laporan</p>
                <p className="text-muted-foreground mt-1 text-sm">
                  Laporan tidak ditemukan atau terjadi kesalahan
                </p>
                <Button onClick={() => refetch()} variant="outline" className="mt-4">
                  Coba lagi
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <main className="mx-auto max-w-6xl px-4 py-6">
          <Card>
            <CardHeader className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <ReportStatusBadge status={data.status} />
                {tagLabel && (
                  <span className="bg-muted inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium">
                    <Tag className="h-3 w-3" />
                    {tagLabel}
                  </span>
                )}
              </div>

              <CardTitle className="text-xl">{data.title}</CardTitle>

              <div className="text-muted-foreground flex flex-wrap gap-4 text-sm">
                <span className="inline-flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {formatDate(data.created_at)}
                </span>
                {locationDisplay && (
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {locationDisplay}
                  </span>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {data.categories.length > 0 && (
                <div>
                  <h3 className="text-muted-foreground mb-2 text-sm font-medium">Kategori</h3>
                  <div className="flex flex-wrap gap-2">
                    {data.categories.map((cat) => (
                      <span
                        key={cat.category_id}
                        className="inline-flex items-center rounded-full border px-3 py-1 text-sm"
                        style={{ borderColor: cat.color ?? undefined }}
                      >
                        {cat.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-muted-foreground mb-2 text-sm font-medium">Deskripsi</h3>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{data.description}</p>
              </div>

              {data.impact && (
                <div>
                  <h3 className="text-muted-foreground mb-2 text-sm font-medium">Dampak</h3>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{data.impact}</p>
                </div>
              )}

              {data.timeline && (
                <div>
                  <h3 className="text-muted-foreground mb-2 text-sm font-medium">Kronologi</h3>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{data.timeline}</p>
                </div>
              )}

              {data.resolution_notes && (
                <div className="border-success/50 bg-success/10 rounded-lg border p-4">
                  <h3 className="text-success mb-2 flex items-center gap-2 text-sm font-medium">
                    <CheckCircle className="h-4 w-4" />
                    Catatan Penyelesaian
                  </h3>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {data.resolution_notes}
                  </p>
                </div>
              )}

              <div className="border-t pt-4">
                <div className="text-muted-foreground grid gap-2 text-xs sm:grid-cols-2">
                  <div className="flex items-center gap-2">
                    <Clock className="h-3 w-3" />
                    <span>Dibuat: {formatDate(data.created_at)}</span>
                  </div>
                  {data.verified_at && (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3" />
                      <span>Diverifikasi: {formatDate(data.verified_at)}</span>
                    </div>
                  )}
                  {data.resolved_at && (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3" />
                      <span>Diselesaikan: {formatDate(data.resolved_at)}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      )}
    </AppShell>
  );
}
