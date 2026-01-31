import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import { ThemeToggle } from '@/components/theme-toggle';
import { ContributorForm } from '@/features/contribution/components/ContributorForm';

// ============================================================================
// SEO METADATA
// ============================================================================

export const metadata: Metadata = {
  title: 'Ikut Tandang Gawe - BalungPisah',
  description:
    'Bergabunglah sebagai kontributor BalungPisah. Urun rembug bersama membangun platform kolaborasi rakyat dan pemerintah. Daftar sebagai pribadi atau rombongan.',
  keywords: [
    'BalungPisah',
    'kontributor',
    'volunteer',
    'gotong royong',
    'kolaborasi',
    'Indonesia',
    'developer',
    'desainer',
    'peneliti',
  ],
  openGraph: {
    title: 'Ikut Tandang Gawe - BalungPisah',
    description:
      'Bergabunglah sebagai kontributor BalungPisah. Urun rembug bersama membangun platform kolaborasi rakyat dan pemerintah.',
    type: 'website',
    locale: 'id_ID',
    siteName: 'BalungPisah',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ikut Tandang Gawe - BalungPisah',
    description:
      'Bergabunglah sebagai kontributor BalungPisah. Urun rembug bersama membangun platform kolaborasi rakyat dan pemerintah.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

// ============================================================================
// PAGE COMPONENT (SERVER COMPONENT)
// ============================================================================

export default function ContributionPage() {
  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <header className="border-border/50 border-b px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <Link
            href="/"
            className="text-muted-foreground inline-flex items-center gap-2 text-sm transition-colors hover:opacity-80"
          >
            <ArrowLeft size={16} />
            Kembali ke Beranda
          </Link>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-8 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          {/* Hero Section - Server Rendered */}
          <div className="mb-12 text-center">
            <div className="bg-primary/15 text-primary mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm">
              Urun Rembug
            </div>
            <h1 className="text-foreground mb-6 text-3xl font-bold sm:text-4xl lg:text-5xl">
              Ikut Tandang Gawe
            </h1>
            <p className="text-muted-foreground mx-auto max-w-2xl text-lg leading-relaxed sm:text-xl">
              Ini bukan panggung satu orang. Ini meja bersama yang butuh diisi dengan berbagai
              keahlian. Kamu punya tempat di sini.
            </p>
          </div>

          {/* Interactive Form - Client Component */}
          <ContributorForm />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-border border-t px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-muted-foreground text-sm">&copy; 2026 BalungPisah.id</p>
        </div>
      </footer>
    </div>
  );
}
