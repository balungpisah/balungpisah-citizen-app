'use client';

import Link from 'next/link';
import { BarChart3, MessageSquarePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LandingPageProps {
  isAuthenticated?: boolean;
}

export function LoginPrompt({ isAuthenticated = false }: LandingPageProps) {
  return (
    <div className="bg-background flex min-h-screen flex-col">
      {/* Background Gradient Orbs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="bg-primary absolute top-1/4 left-1/4 h-96 w-96 rounded-full opacity-20 blur-3xl" />
        <div className="bg-secondary absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full opacity-10 blur-3xl" />
      </div>

      {/* Content */}
      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-4">
        <div className="w-full max-w-lg text-center">
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
            Pantau dan laporkan permasalahan di desamu. Bersama wujudkan transparansi dan
            akuntabilitas pemerintah desa.
          </p>

          {/* Main CTAs */}
          <div className="mb-6 grid gap-3 sm:grid-cols-2">
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
              <Link
                href={isAuthenticated ? '/lapor' : '/api/auth/sign-in'}
                className="flex items-center justify-center gap-2"
              >
                <MessageSquarePlus className="h-5 w-5" />
                Buat Laporan
              </Link>
            </Button>
          </div>

          {/* Auth Section - Only show when not authenticated */}
          {!isAuthenticated && (
            <div className="border-border/50 rounded-lg border p-4">
              <p className="text-muted-foreground mb-3 text-sm">
                Sudah punya akun? Masuk untuk melaporkan dan melacak laporanmu.
              </p>
              <div className="flex gap-3">
                <Button asChild variant="secondary" size="sm" className="flex-1">
                  <Link href="/api/auth/sign-in">Masuk</Link>
                </Button>
                <Button asChild variant="ghost" size="sm" className="flex-1">
                  <Link href="/api/auth/sign-up">Daftar</Link>
                </Button>
              </div>
            </div>
          )}

          {/* Authenticated greeting */}
          {isAuthenticated && (
            <p className="text-muted-foreground text-sm">
              Kamu sudah masuk. Buat laporan baru atau lihat dashboard.
            </p>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-6 text-center">
        <p className="text-muted-foreground text-sm">&copy; 2026 BalungPisah.id</p>
      </footer>
    </div>
  );
}
