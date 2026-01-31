import { Metadata } from 'next';
import { Sparkles } from 'lucide-react';
import { Navbar } from '@/features/home/components/Navbar';
import { ExpectationForm } from '@/features/home/components/ExpectationForm';
import { ContributorCTA } from '@/features/home/components/ContributorCTA';
import { ScrollToFormButton } from '@/features/home/components/ScrollToFormButton';

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

export default function Home() {
  return (
    <div className="bg-background flex min-h-screen flex-col">
      {/* ================================================================== */}
      {/* NAVBAR */}
      {/* ================================================================== */}
      <Navbar />

      {/* ================================================================== */}
      {/* COMING SOON HERO SECTION - FULL SCREEN */}
      {/* ================================================================== */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
        {/* Background Gradient Orbs */}
        <div className="bg-primary absolute top-1/4 left-1/4 h-96 w-96 rounded-full opacity-20 blur-3xl" />
        <div className="bg-secondary absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full opacity-10 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-4xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* COMING SOON - Badge at top */}
            <div className="bg-primary/10 border-primary/30 mb-8 inline-flex items-center gap-2 rounded-full border px-5 py-2.5">
              <span className="bg-primary h-2 w-2 animate-pulse rounded-full" />
              <span className="text-primary text-sm font-medium">Segera Hadir</span>
            </div>

            {/* Brand Name - Using h1 for SEO */}
            <h1 className="text-foreground mb-4 text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
              Balung<span className="text-primary">Pisah</span>
            </h1>

            {/* Tagline - Using p with semantic structure */}
            <p className="text-muted-foreground mx-auto mb-6 max-w-2xl text-lg leading-relaxed sm:text-xl md:text-2xl">
              Gotong Royong Menyambung yang terpisah.
              <br />
              <span className="text-foreground">Rakyat urun data,</span>{' '}
              <span className="text-primary">AI menjernihkan,</span>{' '}
              <span className="text-foreground">Pejabat menuntaskan.</span>
            </p>

            {/* CTA Button */}
            <ScrollToFormButton targetId="urun-rembug" />
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="border-muted-foreground flex h-10 w-6 items-start justify-center rounded-full border-2 p-2">
            <div className="bg-primary h-2 w-1 rounded-full" />
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* EXPECTATION FORM SECTION */}
      {/* ================================================================== */}
      <section id="expectation-form" className="bg-card flex-1 py-24">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          {/* Section Header - Static content rendered on server */}
          <div className="mb-12 text-center">
            <div className="bg-primary/20 text-primary mb-4 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm">
              <Sparkles size={14} />
              Bantu Kami Berkembang
            </div>
            <h2 className="text-foreground mb-4 text-3xl font-bold sm:text-4xl">Apa Harapanmu?</h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Ceritakan harapan dan ekspektasimu terhadap platform ini.
            </p>
          </div>

          {/* Interactive Form - Client Component */}
          <ExpectationForm />
        </div>
      </section>

      {/* ================================================================== */}
      {/* CONTRIBUTOR CTA SECTION */}
      {/* ================================================================== */}
      <ContributorCTA />

      {/* ================================================================== */}
      {/* FOOTER */}
      {/* ================================================================== */}
      <footer className="bg-background py-8">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-muted-foreground text-sm">&copy; 2026 BalungPisah.id</p>
        </div>
      </footer>
    </div>
  );
}
