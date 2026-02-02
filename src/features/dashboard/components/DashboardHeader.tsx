'use client';

import { PageHeader } from '@/components/layout/PageHeader';

/**
 * Dashboard page header
 */
export function DashboardHeader() {
  return (
    <PageHeader
      title="Dashboard Transparansi"
      description="Pantau laporan warga dan tindak lanjut pemerintah"
      maxWidth="max-w-6xl"
    />
  );
}
