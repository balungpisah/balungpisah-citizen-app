'use client';

import { PageHeader } from '@/components/layout/PageHeader';

/**
 * My Reports page header
 */
export function MyReportsHeader() {
  return (
    <PageHeader
      title="Laporan Saya"
      description="Pantau status laporan yang telah Anda buat"
      maxWidth="max-w-3xl"
    />
  );
}
