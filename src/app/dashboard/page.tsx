'use client';

import { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { useOne, useList } from '@/hooks/api';
import type {
  IComprehensiveStats,
  IEnhancedMapData,
  IProvince,
  IRegency,
  IDashboardRecentPaginatedDto,
} from '@/features/dashboard/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet';
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/components/ui/combobox';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  MapPin,
  Filter,
  TrendingUp,
  Calendar,
  X,
  RefreshCw,
  Clock,
  MapPinned,
  FileText,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  ArrowRight,
} from 'lucide-react';

const DashboardMap = dynamic(() => import('@/features/dashboard/components/DashboardMap'), {
  ssr: false,
  loading: () => <Skeleton className="h-[50vh] w-full lg:h-[60vh]" />,
});

const severityColors = {
  critical: '#DC2626',
  high: '#EA580C',
  medium: '#FACC15',
  low: '#22C55E',
};

const statusLabels: Record<string, string> = {
  verified: 'Terverifikasi',
  draft: 'Draft',
  pending: 'Menunggu',
  rejected: 'Ditolak',
};

export default function DashboardPage() {
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    province_id: '',
    province_code: '',
    regency_id: '',
    severity: [] as string[],
    tag_types: [] as string[],
    status: [] as string[],
    date_from: '',
    date_to: '',
  });

  const { data: provinces = [] } = useList<IProvince>({
    resource: 'regions/provinces',
  });

  const { data: regencies = [] } = useList<IRegency>({
    resource: filters.province_code ? `regions/provinces/${filters.province_code}/regencies` : '',
    enabled: !!filters.province_code,
  });

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.province_id) count++;
    if (filters.regency_id) count++;
    if (filters.severity.length) count += filters.severity.length;
    if (filters.tag_types.length) count += filters.tag_types.length;
    if (filters.status.length) count += filters.status.length;
    if (filters.date_from) count++;
    if (filters.date_to) count++;
    return count;
  }, [filters]);

  const queryParams = useMemo(() => {
    const params: Record<string, string> = {};
    if (filters.province_id) params.province_id = filters.province_id;
    if (filters.regency_id) params.regency_id = filters.regency_id;
    if (filters.severity.length) params.severity = filters.severity.join(',');
    if (filters.tag_types.length) params.tag_types = filters.tag_types.join(',');
    if (filters.status.length) params.status = filters.status.join(',');
    if (filters.date_from) params.date_from = filters.date_from;
    if (filters.date_to) params.date_to = filters.date_to;
    params.limit = '1000';
    return params;
  }, [filters]);

  const {
    data: markersData,
    isLoading: markersLoading,
    refetch: refetchMarkers,
  } = useOne<IEnhancedMapData>({
    resource: 'dashboard/reports/markers',
    filters: queryParams,
  });

  const markers = markersData?.markers ?? [];

  const { data: stats, isLoading: statsLoading } = useOne<IComprehensiveStats>({
    resource: 'dashboard/reports/stats',
    filters: queryParams,
  });

  const { data: recentData, isLoading: recentLoading } = useOne<IDashboardRecentPaginatedDto>({
    resource: 'dashboard/recent',
    filters: { days: '7', page: '1', page_size: '6' },
  });

  const recentReports = recentData?.reports ?? [];

  const resetFilters = () => {
    setFilters({
      province_id: '',
      province_code: '',
      regency_id: '',
      severity: [],
      tag_types: [],
      status: [],
      date_from: '',
      date_to: '',
    });
  };

  const toggleFilter = (key: keyof typeof filters, value: string) => {
    const currentValues = filters[key] as string[];
    if (currentValues.includes(value)) {
      setFilters({ ...filters, [key]: currentValues.filter((v) => v !== value) });
    } else {
      setFilters({ ...filters, [key]: [...currentValues, value] });
    }
  };

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
    return `${diffDays} hari lalu`;
  };

  return (
    <AppShell>
      <div className="border-border/50 border-b">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground text-sm">
              Pantau sebaran dan perkembangan laporan warga
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setFilterOpen(true)}>
              <Filter className="mr-2 h-4 w-4" />
              Filter
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 min-w-5 rounded-full px-1.5 text-xs">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
            <Button variant="outline" size="sm" onClick={() => refetchMarkers()}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Filter Sheet */}
      <Sheet open={filterOpen} onOpenChange={setFilterOpen} modal={false}>
        <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-md">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filter
            </SheetTitle>
            <SheetDescription>Saring berdasarkan wilayah, keparahan, dan lainnya</SheetDescription>
          </SheetHeader>

          <div className="space-y-4 px-4">
            {/* Province */}
            <div className="space-y-2">
              <Label>Provinsi</Label>
              <Combobox
                items={provinces}
                value={provinces.find((p) => p.id === filters.province_id) ?? null}
                onValueChange={(value) => {
                  setFilters((prev) => ({
                    ...prev,
                    province_id: value?.id ?? '',
                    province_code: value?.code ?? '',
                    regency_id: '',
                  }));
                }}
                itemToStringLabel={(item) => item.name}
                itemToStringValue={(item) => item.name}
                isItemEqualToValue={(a, b) => a.id === b.id}
              >
                <ComboboxInput placeholder="Pilih provinsi..." showClear />
                <ComboboxContent>
                  <ComboboxEmpty>Tidak ada provinsi ditemukan</ComboboxEmpty>
                  <ComboboxList>
                    {(item) => (
                      <ComboboxItem key={item.id} value={item}>
                        {item.name}
                      </ComboboxItem>
                    )}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
            </div>

            {/* Regency */}
            {filters.province_id && (
              <div className="space-y-2">
                <Label>Kabupaten/Kota</Label>
                <Combobox
                  items={regencies}
                  value={regencies.find((r) => r.id === filters.regency_id) ?? null}
                  onValueChange={(value) => {
                    setFilters((prev) => ({
                      ...prev,
                      regency_id: value?.id ?? '',
                    }));
                  }}
                  itemToStringLabel={(item) => item.name}
                  itemToStringValue={(item) => item.name}
                  isItemEqualToValue={(a, b) => a.id === b.id}
                >
                  <ComboboxInput placeholder="Pilih kabupaten/kota..." showClear />
                  <ComboboxContent>
                    <ComboboxEmpty>Tidak ada kabupaten/kota ditemukan</ComboboxEmpty>
                    <ComboboxList>
                      {(item) => (
                        <ComboboxItem key={item.id} value={item}>
                          {item.name}
                        </ComboboxItem>
                      )}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
              </div>
            )}

            <Separator />

            {/* Severity */}
            <div className="space-y-2">
              <Label>Tingkat Keparahan</Label>
              <div className="space-y-2">
                {['critical', 'high', 'medium', 'low'].map((severity) => (
                  <div key={severity} className="flex items-center space-x-2">
                    <Checkbox
                      id={`severity-${severity}`}
                      checked={filters.severity.includes(severity)}
                      onCheckedChange={() => toggleFilter('severity', severity)}
                    />
                    <label
                      htmlFor={`severity-${severity}`}
                      className="flex items-center gap-2 text-sm leading-none font-medium capitalize peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{
                          backgroundColor: severityColors[severity as keyof typeof severityColors],
                        }}
                      />
                      {severity === 'critical'
                        ? 'Kritis'
                        : severity === 'high'
                          ? 'Tinggi'
                          : severity === 'medium'
                            ? 'Sedang'
                            : 'Rendah'}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Tag Types */}
            <div className="space-y-2">
              <Label>Tipe Laporan</Label>
              <div className="space-y-2">
                {[
                  { value: 'report', label: 'Laporan' },
                  { value: 'complaint', label: 'Keluhan' },
                  { value: 'proposal', label: 'Usulan' },
                  { value: 'inquiry', label: 'Pertanyaan' },
                  { value: 'appreciation', label: 'Apresiasi' },
                ].map((tag) => (
                  <div key={tag.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`tag-${tag.value}`}
                      checked={filters.tag_types.includes(tag.value)}
                      onCheckedChange={() => toggleFilter('tag_types', tag.value)}
                    />
                    <label
                      htmlFor={`tag-${tag.value}`}
                      className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {tag.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Status */}
            <div className="space-y-2">
              <Label>Status</Label>
              <div className="space-y-2">
                {[
                  { value: 'verified', label: 'Terverifikasi' },
                  { value: 'draft', label: 'Draft' },
                ].map((status) => (
                  <div key={status.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`status-${status.value}`}
                      checked={filters.status.includes(status.value)}
                      onCheckedChange={() => toggleFilter('status', status.value)}
                    />
                    <label
                      htmlFor={`status-${status.value}`}
                      className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {status.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Date Range */}
            <div className="space-y-2">
              <Label>Rentang Tanggal</Label>
              <div className="space-y-2">
                <Input
                  type="date"
                  value={filters.date_from}
                  onChange={(e) => setFilters({ ...filters, date_from: e.target.value })}
                  placeholder="Dari"
                />
                <Input
                  type="date"
                  value={filters.date_to}
                  onChange={(e) => setFilters({ ...filters, date_to: e.target.value })}
                  placeholder="Sampai"
                />
              </div>
            </div>
          </div>

          <SheetFooter>
            <Button variant="outline" onClick={resetFilters} className="w-full">
              <X className="mr-2 h-4 w-4" />
              Reset Filter
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <div className="mx-auto max-w-6xl space-y-6 px-4 py-6">
        {/* Stats */}
        {statsLoading ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-24" />
            ))}
          </div>
        ) : stats ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <Card className="transition-shadow duration-200 hover:shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-muted-foreground flex items-center gap-1.5 text-sm font-medium">
                  <FileText className="h-4 w-4" />
                  Semua Laporan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total.toLocaleString()}</div>
              </CardContent>
            </Card>

            <Card className="transition-shadow duration-200 hover:shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-1.5 text-sm font-medium text-green-600">
                  <ShieldCheck className="h-4 w-4" />
                  Prioritas Rendah
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {stats.by_severity.low.toLocaleString()}
                </div>
              </CardContent>
            </Card>

            <Card className="transition-shadow duration-200 hover:shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-1.5 text-sm font-medium text-yellow-500">
                  <ShieldAlert className="h-4 w-4" />
                  Prioritas Sedang
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-500">
                  {stats.by_severity.medium.toLocaleString()}
                </div>
              </CardContent>
            </Card>

            <Card className="transition-shadow duration-200 hover:shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-1.5 text-sm font-medium text-red-600">
                  <ShieldX className="h-4 w-4" />
                  Prioritas Tinggi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {(stats.by_severity.high + stats.by_severity.critical).toLocaleString()}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : null}

        {/* Map */}
        <Card className="isolate">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Peta Sebaran
                </CardTitle>
                <CardDescription>{markers.length} titik laporan</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {markersLoading ? (
              <Skeleton className="h-[50vh] w-full lg:h-[60vh]" />
            ) : (
              <DashboardMap markers={markers} />
            )}
          </CardContent>
        </Card>

        {/* Charts */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Top Categories */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Kategori Terbanyak
              </CardTitle>
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <Skeleton className="h-64" />
              ) : stats ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={stats.by_category}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category_name" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              ) : null}
            </CardContent>
          </Card>

          {/* Weekly Trend */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Tren 12 Minggu
              </CardTitle>
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <Skeleton className="h-64" />
              ) : stats ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={stats.by_period}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="count" stroke="#8b5cf6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              ) : null}
            </CardContent>
          </Card>

          {/* Tag Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Tipe Laporan</CardTitle>
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <Skeleton className="h-64" />
              ) : stats ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Laporan', value: stats.by_tag.report },
                        { name: 'Keluhan', value: stats.by_tag.complaint },
                        { name: 'Usulan', value: stats.by_tag.proposal },
                        { name: 'Pertanyaan', value: stats.by_tag.inquiry },
                        { name: 'Apresiasi', value: stats.by_tag.appreciation },
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'].map(
                        (color, index) => (
                          <Cell key={`cell-${index}`} fill={color} />
                        )
                      )}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : null}
            </CardContent>
          </Card>

          {/* Regional Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Wilayah Terbanyak</CardTitle>
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <Skeleton className="h-64" />
              ) : stats ? (
                <ScrollArea className="h-64">
                  <div className="space-y-2">
                    {stats.by_region.map((region, idx) => (
                      <div
                        key={region.region_id}
                        className="bg-muted/50 flex items-center justify-between rounded-lg p-2"
                      >
                        <div className="flex items-center gap-2">
                          <div className="text-muted-foreground text-sm font-medium">{idx + 1}</div>
                          <div className="text-sm font-medium">{region.region_name}</div>
                        </div>
                        <Badge variant="secondary">{region.count}</Badge>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              ) : null}
            </CardContent>
          </Card>
        </div>

        {/* Recent Reports */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="flex items-center gap-2 text-lg font-semibold">
                <Clock className="h-5 w-5" />
                Terbaru
              </h2>
              <p className="text-muted-foreground text-sm">
                {recentData?.total_count ?? 0} laporan masuk minggu ini
              </p>
            </div>
            <Link
              href="/dashboard/reports"
              className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-sm transition-colors"
            >
              Lihat Selengkapnya
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {recentLoading ? (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-20" />
              ))}
            </div>
          ) : recentReports.length > 0 ? (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {recentReports.map((report) => (
                <Link
                  key={report.id}
                  href={`/dashboard/reports/${report.id}`}
                  className="bg-card hover:bg-muted/50 flex h-full flex-col justify-between rounded-lg border p-3 transition-colors"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="line-clamp-1 text-base leading-snug font-medium">
                        {report.title || 'Tanpa Judul'}
                      </h4>
                      <Badge variant="outline" className="shrink-0 text-sm">
                        {statusLabels[report.status] || report.status}
                      </Badge>
                    </div>
                    {report.description && (
                      <p className="text-muted-foreground mt-1 line-clamp-2 text-sm leading-relaxed">
                        {report.description}
                      </p>
                    )}
                    {report.categories[0] && (
                      <div className="text-muted-foreground mt-2 flex items-center gap-1.5 text-sm">
                        <span
                          className="h-2 w-2 shrink-0 rounded-full"
                          style={{ backgroundColor: report.categories[0].color || '#94a3b8' }}
                        />
                        {report.categories[0].name}
                      </div>
                    )}
                  </div>
                  <div className="text-muted-foreground mt-3 flex items-center gap-2 text-sm">
                    {report.location?.display_name ? (
                      <span className="inline-flex min-w-0 items-center gap-1">
                        <MapPinned className="h-3 w-3 shrink-0" />
                        <span className="truncate">{report.location.display_name}</span>
                      </span>
                    ) : (
                      <span />
                    )}
                    <span className="ml-auto shrink-0">
                      {formatRelativeTime(report.created_at)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground py-8 text-center text-sm">
              Belum ada laporan minggu ini
            </p>
          )}
        </div>
      </div>
    </AppShell>
  );
}
