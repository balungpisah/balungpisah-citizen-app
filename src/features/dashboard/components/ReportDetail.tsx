'use client';

import Link from 'next/link';
import { ArrowLeft, Calendar, MapPin, Tag, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useOne } from '@/hooks/api/use-one';
import type { IDashboardReportDetailDto } from '@/features/dashboard/types';
import { TAG_LABELS } from '@/features/dashboard/types';
import { ReportStatusBadge } from './ReportStatusBadge';
import { ReportDetailSkeleton } from './ReportDetailSkeleton';

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

interface ReportDetailProps {
  reportId: string;
}

export function ReportDetail({ reportId }: ReportDetailProps) {
  const { data, isLoading, isError, refetch } = useOne<IDashboardReportDetailDto>({
    resource: `dashboard/reports/${reportId}`,
  });

  if (isLoading) {
    return <ReportDetailSkeleton />;
  }

  if (isError || !data) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-6">
        <Link
          href="/dashboard"
          className="text-muted-foreground hover:text-foreground mb-4 inline-flex items-center gap-2 text-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Dashboard
        </Link>
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
    );
  }

  const tagLabel = data.tag_type ? TAG_LABELS[data.tag_type] : null;
  const locationDisplay = data.location?.display_name || data.location?.raw_input;

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      {/* Back Button */}
      <Link
        href="/dashboard"
        className="text-muted-foreground hover:text-foreground mb-4 inline-flex items-center gap-2 text-sm"
      >
        <ArrowLeft className="h-4 w-4" />
        Kembali ke Dashboard
      </Link>

      {/* Main Content */}
      <Card>
        <CardHeader className="space-y-4">
          {/* Status & Priority */}
          <div className="flex flex-wrap items-center gap-2">
            <ReportStatusBadge status={data.status} />
            {tagLabel && (
              <span className="bg-muted inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium">
                <Tag className="h-3 w-3" />
                {tagLabel}
              </span>
            )}
          </div>

          {/* Title */}
          <CardTitle className="text-xl">{data.title}</CardTitle>

          {/* Meta Info */}
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
          {/* Categories */}
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

          {/* Description */}
          <div>
            <h3 className="text-muted-foreground mb-2 text-sm font-medium">Deskripsi</h3>
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{data.description}</p>
          </div>

          {/* Impact */}
          {data.impact && (
            <div>
              <h3 className="text-muted-foreground mb-2 text-sm font-medium">Dampak</h3>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{data.impact}</p>
            </div>
          )}

          {/* Timeline */}
          {data.timeline && (
            <div>
              <h3 className="text-muted-foreground mb-2 text-sm font-medium">Kronologi</h3>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{data.timeline}</p>
            </div>
          )}

          {/* Resolution Notes */}
          {data.resolution_notes && (
            <div className="border-success/50 bg-success/10 rounded-lg border p-4">
              <h3 className="text-success mb-2 flex items-center gap-2 text-sm font-medium">
                <CheckCircle className="h-4 w-4" />
                Catatan Penyelesaian
              </h3>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{data.resolution_notes}</p>
            </div>
          )}

          {/* Timestamps */}
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
    </div>
  );
}
