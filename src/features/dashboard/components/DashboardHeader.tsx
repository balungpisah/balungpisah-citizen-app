'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export function DashboardHeader() {
  return (
    <header className="bg-background border-border/50 sticky top-0 z-50 border-b">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-4">
        <Link
          href="/lapor"
          className="hover:bg-muted rounded-lg p-2 transition-colors"
          aria-label="Kembali"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-lg font-bold">Dashboard</h1>
      </div>
    </header>
  );
}
