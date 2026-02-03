'use client';

import { CheckCircle2, Loader2, Ticket, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ReportCreatedStatus = 'processing' | 'success' | 'error' | 'closed';

export interface ReportCreatedBlockProps {
  status: ReportCreatedStatus;
  referenceNumber?: string;
  error?: string;
  message?: string;
}

/**
 * Custom card for create_report tool.
 * Shows a user-friendly message when a report ticket is created.
 */
export function ReportCreatedBlock({
  status,
  referenceNumber,
  error,
  message,
}: ReportCreatedBlockProps) {
  if (status === 'closed') {
    return (
      <div className="my-3 overflow-hidden rounded-xl border border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950">
        <div className="flex items-start gap-3 p-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
            <XCircle className="size-5 text-red-600 dark:text-red-400" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-red-900 dark:text-red-100">Percakapan Ditutup</p>
            <p className="mt-1 text-sm text-red-700 dark:text-red-300">
              {message || 'Percakapan ditutup. Terima kasih sudah menghubungi BalungPisah.'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'processing') {
    return (
      <div className="my-3 overflow-hidden rounded-xl border border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950">
        <div className="flex items-center gap-3 p-4">
          <div className="flex size-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
            <Loader2 className="size-5 animate-spin text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-blue-900 dark:text-blue-100">
              Sedang memproses laporan Anda...
            </p>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Mohon tunggu sebentar, kami sedang menyimpan laporan Anda.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="my-3 overflow-hidden rounded-xl border border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950">
        <div className="flex items-start gap-3 p-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
            <Ticket className="size-5 text-red-600 dark:text-red-400" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-red-900 dark:text-red-100">Gagal Membuat Laporan</p>
            <p className="text-sm text-red-700 dark:text-red-300">
              {error || 'Terjadi kesalahan saat memproses laporan Anda. Silakan coba lagi.'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Success state
  return (
    <div className="my-3 overflow-hidden rounded-xl border border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950">
      <div className="flex items-start gap-3 p-4">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
          <CheckCircle2 className="size-5 text-green-600 dark:text-green-400" />
        </div>
        <div className="flex-1">
          <p className="font-medium text-green-900 dark:text-green-100">Laporan Berhasil Dibuat!</p>
          <p className="mt-1 text-sm text-green-700 dark:text-green-300">
            Terima kasih telah melapor. Laporan Anda telah kami terima dan akan segera diproses oleh
            tim terkait.
          </p>
          {referenceNumber && (
            <div className="mt-3 flex items-center gap-2 rounded-lg bg-green-100 p-2 dark:bg-green-900/50">
              <Ticket className="size-4 text-green-600 dark:text-green-400" />
              <span className="text-sm text-green-800 dark:text-green-200">
                Nomor Referensi: <span className="font-mono font-semibold">{referenceNumber}</span>
              </span>
            </div>
          )}
        </div>
      </div>

      <div
        className={cn(
          'border-t border-green-200 bg-green-100/50 px-4 py-3 dark:border-green-800 dark:bg-green-900/30'
        )}
      >
        <p className="text-xs text-green-700 dark:text-green-300">
          💡 <strong>Info:</strong> Simpan nomor referensi untuk melacak status laporan Anda. Anda
          dapat membuat maksimal 5 laporan per hari.
        </p>
      </div>
    </div>
  );
}
