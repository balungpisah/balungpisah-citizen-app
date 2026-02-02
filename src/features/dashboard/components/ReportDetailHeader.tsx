'use client';

import { PageHeader } from '@/components/layout/PageHeader';

/**
 * Header for Report Detail page with breadcrumb navigation
 */
export function ReportDetailHeader() {
  return (
    <PageHeader
      title="Detail Laporan"
      breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Detail Laporan' }]}
      maxWidth="max-w-3xl"
    />
  );
}
