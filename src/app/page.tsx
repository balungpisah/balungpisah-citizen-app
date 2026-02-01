import { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ACCESS_TOKEN_COOKIE } from '@/features/auth/services/token-service';
import { LoginPrompt } from '@/features/home/components/LoginPrompt';

// ============================================================================
// SEO METADATA
// ============================================================================

export const metadata: Metadata = {
  title: 'BalungPisah - Gotong Royong Menyambung yang Terpisah',
  description:
    'Platform kolaborasi rakyat dan pemerintah. Rakyat urun data, AI menjernihkan, Pejabat menuntaskan. Segera hadir untuk Indonesia.',
  keywords: [
    'BalungPisah',
    'kolaborasi',
    'gotong royong',
    'pemerintah',
    'rakyat',
    'Indonesia',
    'AI',
    'data',
  ],
  openGraph: {
    title: 'BalungPisah - Gotong Royong Menyambung yang Terpisah',
    description:
      'Platform kolaborasi rakyat dan pemerintah. Rakyat urun data, AI menjernihkan, Pejabat menuntaskan.',
    type: 'website',
    locale: 'id_ID',
    siteName: 'BalungPisah',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BalungPisah - Gotong Royong Menyambung yang Terpisah',
    description:
      'Platform kolaborasi rakyat dan pemerintah. Rakyat urun data, AI menjernihkan, Pejabat menuntaskan.',
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

  // If authenticated, redirect to /lapor
  if (isAuthenticated) {
    redirect('/lapor');
  }

  // If not authenticated, show login prompt
  return <LoginPrompt />;
}
