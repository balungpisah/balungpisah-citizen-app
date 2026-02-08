'use client';

import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { useInfiniteList } from '@/hooks/api/use-infinite-list';
import { useAuth } from '@/features/auth';
import { ReportStatusBadge } from '@/features/dashboard/components/ReportStatusBadge';
import type { IReportStatus } from '@/features/dashboard/types';
import type { IMyReportDto } from '@/features/my-reports/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, MapPinned, FileText, Plus, Loader2 } from 'lucide-react';

export default function MyReportsPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace('/api/auth/sign-in');
    }
  }, [authLoading, isAuthenticated, router]);

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortDir, setSortDir] = useState('desc');

  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);
  const handleSearch = (value: string) => {
    setSearch(value);
    if (debounceTimer) clearTimeout(debounceTimer);
    const timer = setTimeout(() => {
      setDebouncedSearch(value);
    }, 400);
    setDebounceTimer(timer);
  };

  const filters = useMemo(() => {
    const params: Record<string, string> = {
      sort_by: sortBy,
      sort: sortDir,
    };
    if (debouncedSearch) params.search = debouncedSearch;
    return params;
  }, [sortBy, sortDir, debouncedSearch]);

  const {
    data: reports,
    total,
    isLoading,
    isError,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteList<IMyReportDto>({
    resource: 'reports',
    pageSize: 10,
    filters,
    enabled: isAuthenticated,
  });

  // Infinite scroll with IntersectionObserver
  const sentinelRef = useRef<HTMLDivElement>(null);
  const handleIntersect = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage]
  );

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(handleIntersect, {
      rootMargin: '200px',
    });
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [handleIntersect]);

  const formatRelativeTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Baru saja';
    if (diffMins < 60) return `${diffMins} menit lalu`;
    if (diffHours < 24) return `${diffHours} jam lalu`;
    if (diffDays < 7) return `${diffDays} hari lalu`;
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const handleSortChange = (value: string) => {
    const [field, dir] = value.split(':');
    setSortBy(field);
    setSortDir(dir);
  };

  return (
    <AppShell>
      <PageHeader
        breadcrumbs={[{ label: 'Laporan Saya' }]}
        description="Pantau status laporan yang telah Anda buat"
      />

      <div className="mx-auto max-w-6xl px-4 py-6">
        {/* Search & Filters */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              placeholder="Cari judul laporan..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={`${sortBy}:${sortDir}`} onValueChange={handleSortChange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Urutkan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="created_at:desc">Terbaru</SelectItem>
              <SelectItem value="created_at:asc">Terlama</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <p className="text-muted-foreground mt-2 mb-4 text-sm">
          {total.toLocaleString()} laporan Anda
        </p>

        {/* Reports List */}
        {authLoading || isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full rounded-lg" />
            ))}
          </div>
        ) : isError ? (
          <div className="py-16 text-center">
            <p className="text-muted-foreground text-sm">Gagal memuat laporan Anda</p>
          </div>
        ) : reports.length > 0 ? (
          <div className="space-y-3">
            {reports.map((report) => (
              <Link
                key={report.id}
                href={`/my-reports/${report.id}`}
                className="bg-card hover:bg-muted/50 block rounded-lg border p-4 transition-colors"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="line-clamp-1 text-base leading-snug font-medium">
                      {report.title || 'Tanpa Judul'}
                    </h3>
                    <ReportStatusBadge
                      status={report.status as IReportStatus}
                      className="shrink-0"
                    />
                  </div>

                  {report.description && (
                    <p className="text-muted-foreground mt-1 line-clamp-2 text-sm leading-relaxed">
                      {report.description}
                    </p>
                  )}

                  <div className="text-muted-foreground mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                    {report.categories?.[0] && (
                      <span className="inline-flex items-center gap-1">
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{
                            backgroundColor: report.categories[0].color || '#94a3b8',
                          }}
                        />
                        {report.categories[0].category_name ?? 'Umum'}
                      </span>
                    )}
                    {report.location_display_name && (
                      <span className="inline-flex min-w-0 items-center gap-1">
                        <MapPinned className="h-3 w-3 shrink-0" />
                        <span className="truncate">{report.location_display_name}</span>
                      </span>
                    )}
                    <span className="ml-auto shrink-0 text-sm">
                      {formatRelativeTime(report.created_at)}
                    </span>
                  </div>
                </div>
              </Link>
            ))}

            {/* Sentinel for infinite scroll */}
            <div ref={sentinelRef} className="h-1" />

            {isFetchingNextPage && (
              <div className="flex justify-center py-4">
                <Loader2 className="text-muted-foreground h-5 w-5 animate-spin" />
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="bg-muted mb-4 rounded-full p-4">
              <FileText className="text-muted-foreground h-8 w-8" />
            </div>
            <h3 className="mb-2 text-lg font-medium">
              {debouncedSearch ? 'Tidak Ditemukan' : 'Belum Ada Laporan'}
            </h3>
            <p className="text-muted-foreground mb-6 max-w-sm text-sm">
              {debouncedSearch
                ? 'Tidak ada laporan yang sesuai pencarian'
                : 'Anda belum membuat laporan apapun. Mulai laporkan masalah di sekitar Anda.'}
            </p>
            {!debouncedSearch && (
              <Button asChild>
                <Link href="/lapor" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Buat Laporan Pertama
                </Link>
              </Button>
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
}
