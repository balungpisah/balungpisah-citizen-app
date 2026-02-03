'use client';

import Link from 'next/link';
import { BarChart3, LogIn, UserPlus, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AppShell } from '@/components/layout/AppShell';

/**
 * Login prompt page for unauthenticated users
 *
 * This is the home page for guests on urun.balungpisah.id
 * Authenticated users are redirected to /dashboard
 */
export function LoginPrompt() {
  return (
    <AppShell>
      <div className="flex min-h-screen flex-col">
        {/* Background Gradient Orbs */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="bg-primary absolute top-1/4 left-1/4 h-96 w-96 rounded-full opacity-20 blur-3xl" />
          <div className="bg-secondary absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full opacity-10 blur-3xl" />
        </div>

        {/* Hero Section - Centered */}
        <section className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 py-16">
          <div className="w-full max-w-sm text-center">
            {/* Brand */}
            <h1 className="text-foreground mb-3 text-4xl font-bold tracking-tight sm:text-5xl">
              Lapor <span className="text-primary">Bersama</span>
            </h1>

            {/* Tagline */}
            <p className="text-muted-foreground mb-10 text-lg">
              Satu laporan, satu langkah kolektif
            </p>

            {/* CTAs */}
            <div className="space-y-3">
              <Button asChild size="lg" className="w-full">
                <Link href="/api/auth/sign-in" className="flex items-center justify-center gap-2">
                  <LogIn className="h-5 w-5" />
                  Masuk
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="w-full">
                <Link href="/api/auth/sign-up" className="flex items-center justify-center gap-2">
                  <UserPlus className="h-5 w-5" />
                  Daftar
                </Link>
              </Button>
              <Button asChild size="lg" variant="ghost" className="w-full">
                <Link href="/dashboard" className="flex items-center justify-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Lihat Dashboard
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="relative z-10 px-4 py-6 text-center">
          <Link
            href="https://balungpisah.id"
            className="text-muted-foreground hover:text-primary inline-flex items-center gap-1 text-sm transition-colors"
          >
            Pelajari lebih lanjut di BalungPisah.id
            <ArrowRight className="h-4 w-4" />
          </Link>
          <p className="text-muted-foreground mt-2 text-sm">&copy; 2026 BalungPisah.id</p>
        </footer>
      </div>
    </AppShell>
  );
}
