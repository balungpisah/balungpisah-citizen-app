'use client';

import Link from 'next/link';
import { ArrowLeft, MessageSquarePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function DashboardHeader() {
  return (
    <header className="bg-background border-border/50 sticky top-0 z-50 border-b">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-4">
        <Link
          href="/"
          className="hover:bg-muted rounded-lg p-2 transition-colors"
          aria-label="Kembali ke beranda"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-lg font-bold">Dashboard Transparansi</h1>
          <p className="text-muted-foreground text-sm">
            Pantau laporan warga dan tindak lanjut pemerintah
          </p>
        </div>
        <Button asChild size="sm">
          <Link href="/lapor" className="flex items-center gap-2">
            <MessageSquarePlus className="h-4 w-4" />
            <span className="hidden sm:inline">Buat Laporan</span>
          </Link>
        </Button>
      </div>
    </header>
  );
}
