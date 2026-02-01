'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function LoginPrompt() {
  return (
    <div className="bg-background flex min-h-screen flex-col">
      {/* Background Gradient Orbs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="bg-primary absolute top-1/4 left-1/4 h-96 w-96 rounded-full opacity-20 blur-3xl" />
        <div className="bg-secondary absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full opacity-10 blur-3xl" />
      </div>

      {/* Content */}
      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          {/* Brand */}
          <h1 className="text-foreground mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
            Balung<span className="text-primary">Pisah</span>
          </h1>

          {/* Tagline */}
          <p className="text-muted-foreground mb-8 text-lg">
            Gotong Royong Menyambung yang Terpisah
          </p>

          {/* Auth Buttons */}
          <div className="flex flex-col gap-3">
            <Button asChild size="lg" className="w-full">
              <Link href="/api/auth/sign-in">Masuk</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full">
              <Link href="/api/auth/sign-up">Daftar</Link>
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-6 text-center">
        <p className="text-muted-foreground text-sm">&copy; 2026 BalungPisah.id</p>
      </footer>
    </div>
  );
}
