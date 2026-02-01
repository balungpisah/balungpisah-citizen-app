'use client';

import Link from 'next/link';

export function ChatNavbar() {
  return (
    <header className="bg-background border-border/50 sticky top-0 z-50 border-b">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <span className="text-foreground text-lg font-bold">
            Balung<span className="text-primary">Pisah</span>
          </span>
        </Link>

        {/* Dashboard Link */}
        <Link
          href="/dashboard"
          className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
        >
          Dashboard
        </Link>
      </div>
    </header>
  );
}
