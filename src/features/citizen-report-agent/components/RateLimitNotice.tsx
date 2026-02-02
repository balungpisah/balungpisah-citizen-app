'use client';

import { Clock, AlertCircle } from 'lucide-react';
import type { IRateLimitStatus } from '../types';

interface RateLimitNoticeProps {
  status: IRateLimitStatus;
}

/**
 * Format time remaining until reset
 */
function formatTimeUntilReset(resetsAt: string): string {
  const now = new Date();
  const resetDate = new Date(resetsAt);
  const diff = resetDate.getTime() - now.getTime();

  if (diff <= 0) {
    return 'sebentar lagi';
  }

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (hours > 0) {
    return `${hours} jam ${minutes} menit`;
  }
  return `${minutes} menit`;
}

/**
 * Notice displayed when user has reached their daily report limit
 *
 * Shows informative message about:
 * - Why they can't create new reports
 * - How many reports they've created
 * - When the limit will reset
 */
export function RateLimitNotice({ status }: RateLimitNoticeProps) {
  const timeUntilReset = formatTimeUntilReset(status.resets_at);

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        {/* Icon */}
        <div className="bg-muted mx-auto mb-6 flex size-16 items-center justify-center rounded-full">
          <AlertCircle className="text-muted-foreground size-8" />
        </div>

        {/* Title */}
        <h2 className="text-foreground mb-2 text-xl font-semibold">Kuota Laporan Hari Ini Habis</h2>

        {/* Description */}
        <p className="text-muted-foreground mb-6">
          Anda telah membuat {status.tickets_used} dari {status.max_tickets} laporan yang diizinkan
          hari ini. Batas ini diberlakukan untuk menjaga kualitas layanan bagi semua pengguna.
        </p>

        {/* Reset time info */}
        <div className="bg-muted/50 rounded-lg p-4">
          <div className="flex items-center justify-center gap-2">
            <Clock className="text-muted-foreground size-4" />
            <span className="text-muted-foreground text-sm">
              Kuota akan direset dalam{' '}
              <span className="text-foreground font-medium">{timeUntilReset}</span>
            </span>
          </div>
          <p className="text-muted-foreground mt-2 text-xs">
            Batas kuota direset setiap hari pukul 00:00 WIB
          </p>
        </div>

        {/* Additional info */}
        <p className="text-muted-foreground mt-6 text-sm">
          Anda masih dapat melihat dan melanjutkan laporan yang sudah ada melalui halaman{' '}
          <a href="/laporan-saya" className="text-primary hover:underline">
            Laporan Saya
          </a>
          .
        </p>
      </div>
    </div>
  );
}
