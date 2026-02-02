import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ACCESS_TOKEN_COOKIE } from '@/features/auth/services/token-service';
import { AppShell } from '@/components/layout/AppShell';
import { MyReportsHeader } from '@/features/my-reports/components/MyReportsHeader';
import { MyReportsList } from '@/features/my-reports/components/MyReportsList';

export const metadata = {
  title: 'Laporan Saya - Urun BalungPisah',
  description: 'Lihat dan pantau status laporan yang telah Anda buat',
};

/**
 * My Reports Page
 *
 * Shows list of reports submitted by the authenticated user.
 * Requires authentication - redirects to sign-in if not authenticated.
 */
export default async function LaporanSayaPage() {
  // Check authentication server-side
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE);
  const isAuthenticated = !!accessToken?.value;

  // Redirect unauthenticated users to sign-in
  if (!isAuthenticated) {
    redirect('/api/auth/sign-in');
  }

  return (
    <AppShell>
      <MyReportsHeader />
      <main className="mx-auto max-w-3xl px-4 py-6">
        <MyReportsList />
      </main>
    </AppShell>
  );
}
