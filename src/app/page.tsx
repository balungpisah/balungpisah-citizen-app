import { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ACCESS_TOKEN_COOKIE } from '@/features/auth/services/token-service';
import { LoginPrompt } from '@/features/home/components/LoginPrompt';

// ============================================================================
// SEO METADATA
// ============================================================================

export const metadata: Metadata = {
  title: 'Urun BalungPisah - Layanan Pengaduan Masyarakat',
  description:
    'Platform pengaduan masyarakat. Laporkan masalah di sekitarmu, pantau perkembangan, dan lihat transparansi tindak lanjut pemerintah.',
  keywords: [
    'BalungPisah',
    'pengaduan',
    'laporan',
    'masyarakat',
    'pemerintah',
    'transparansi',
    'Indonesia',
  ],
  openGraph: {
    title: 'Urun BalungPisah - Layanan Pengaduan Masyarakat',
    description:
      'Platform pengaduan masyarakat. Laporkan masalah di sekitarmu, pantau perkembangan, dan lihat transparansi tindak lanjut pemerintah.',
    type: 'website',
    locale: 'id_ID',
    siteName: 'Urun BalungPisah',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Urun BalungPisah - Layanan Pengaduan Masyarakat',
    description:
      'Platform pengaduan masyarakat. Laporkan masalah di sekitarmu, pantau perkembangan, dan lihat transparansi tindak lanjut pemerintah.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

// ============================================================================
// MAIN PAGE COMPONENT (SERVER COMPONENT)
// ============================================================================

export default async function Home() {
  // Check authentication server-side
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE);
  const isAuthenticated = !!accessToken?.value;

  // Redirect authenticated users to dashboard
  if (isAuthenticated) {
    redirect('/dashboard');
  }

  // Show login prompt for guests
  return <LoginPrompt />;
}
