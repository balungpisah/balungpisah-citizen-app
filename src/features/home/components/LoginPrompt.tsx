'use client';

import Link from 'next/link';
import {
  BarChart3,
  MessageSquarePlus,
  Search,
  CheckCircle,
  Wrench,
  FileText,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LandingPageProps {
  isAuthenticated?: boolean;
}

export function LoginPrompt({ isAuthenticated = false }: LandingPageProps) {
  return (
    <div className="bg-background flex flex-col">
      {/* Background Gradient Orbs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="bg-primary absolute top-1/4 left-1/4 h-96 w-96 rounded-full opacity-20 blur-3xl" />
        <div className="bg-secondary absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full opacity-10 blur-3xl" />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center justify-center px-4 pt-24 pb-16 sm:pt-38 sm:pb-28">
        <div className="w-full max-w-md text-center">
          {/* Brand */}
          <h1 className="text-foreground mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
            Balung<span className="text-primary">Pisah</span>
          </h1>

          {/* Tagline */}
          <p className="text-muted-foreground mb-2 text-lg">
            Gotong Royong Menyambung yang Terpisah
          </p>

          {/* Value Proposition */}
          <p className="text-muted-foreground mb-8 text-sm">
            Platform kolaborasi warga dan pemerintah. Warga urun laporan, bersama memvalidasi,
            pemerintah menuntaskan.
          </p>

          {/* CTAs */}
          {isAuthenticated ? (
            <div className="grid gap-3 sm:grid-cols-2">
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="bg-secondary/80 hover:bg-secondary w-full"
              >
                <Link href="/dashboard" className="flex items-center justify-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Lihat Dashboard
                </Link>
              </Button>
              <Button asChild size="lg" className="w-full">
                <Link href="/lapor" className="flex items-center justify-center gap-2">
                  <MessageSquarePlus className="h-5 w-5" />
                  Buat Laporan
                </Link>
              </Button>
            </div>
          ) : (
            <div>
              <div className="mb-4 flex flex-col gap-3">
                <Button asChild size="lg" className="w-full">
                  <Link href="/api/auth/sign-in" className="flex items-center justify-center gap-2">
                    <MessageSquarePlus className="h-5 w-5" />
                    Masuk untuk Lapor
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="secondary"
                  className="bg-secondary/80 hover:bg-secondary w-full"
                >
                  <Link href="/dashboard" className="flex items-center justify-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Lihat Dashboard
                  </Link>
                </Button>
              </div>
              <p className="text-muted-foreground text-sm">
                Belum punya akun?{' '}
                <Link href="/api/auth/sign-up" className="text-primary hover:underline">
                  Daftar di sini
                </Link>
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Content Below Fold */}
      <main className="relative z-10 px-4 pb-12">
        {/* Sekat Informasi Section */}
        <section className="mx-auto w-full max-w-2xl">
          <div className="bg-card/50 border-border mb-8 rounded-2xl border p-6 backdrop-blur-sm">
            <h2 className="text-foreground mb-4 text-center text-xl font-semibold">
              Menembus Sekat Informasi
            </h2>
            <p className="text-muted-foreground text-center text-sm leading-relaxed">
              Indonesia punya jutaan orang berniat baik, tapi energi mereka habis dalam gesekan,
              bukan gerak maju. <strong className="text-foreground">Sekat Informasi</strong> —
              pemisah antara laporan dan kenyataan, niat dan aksi, warga dan pembuat kebijakan —
              menghentikan pembangunan di titik-titik kritis. Platform ini hadir untuk menembus
              sekat itu.
            </p>
          </div>

          {/* Cara Kerja Section */}
          <div className="bg-card/50 border-border mb-8 rounded-2xl border p-6 backdrop-blur-sm">
            <h2 className="text-foreground mb-6 text-center text-xl font-semibold">Cara Kerja</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="text-center">
                <div className="bg-primary/10 text-primary mx-auto mb-3 w-fit rounded-full p-3">
                  <Search className="h-5 w-5" />
                </div>
                <h3 className="text-foreground mb-1 text-sm font-medium">Deteksi</h3>
                <p className="text-muted-foreground text-xs">Warga melaporkan masalah</p>
              </div>
              <div className="text-center">
                <div className="bg-primary/10 text-primary mx-auto mb-3 w-fit rounded-full p-3">
                  <CheckCircle className="h-5 w-5" />
                </div>
                <h3 className="text-foreground mb-1 text-sm font-medium">Validasi</h3>
                <p className="text-muted-foreground text-xs">Bersama memverifikasi</p>
              </div>
              <div className="text-center">
                <div className="bg-primary/10 text-primary mx-auto mb-3 w-fit rounded-full p-3">
                  <Wrench className="h-5 w-5" />
                </div>
                <h3 className="text-foreground mb-1 text-sm font-medium">Eksekusi</h3>
                <p className="text-muted-foreground text-xs">Pemerintah menindaklanjuti</p>
              </div>
              <div className="text-center">
                <div className="bg-primary/10 text-primary mx-auto mb-3 w-fit rounded-full p-3">
                  <FileText className="h-5 w-5" />
                </div>
                <h3 className="text-foreground mb-1 text-sm font-medium">Dokumentasi</h3>
                <p className="text-muted-foreground text-xs">Jejak tandang tercatat</p>
              </div>
            </div>
          </div>

          {/* Manifesto Link */}
          <div className="text-center">
            <Link
              href="https://balungpisah.id/manifesto"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 inline-flex items-center gap-1 text-sm transition-colors hover:underline"
            >
              Baca Manifesto Lengkap
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-6 text-center">
        <p className="text-muted-foreground text-sm">&copy; 2026 BalungPisah.id</p>
      </footer>
    </div>
  );
}
