'use client';

import { MessageSquarePlus, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ConversationCompleteFooterProps {
  onNewReport: () => void;
  onViewDashboard: () => void;
}

/**
 * Footer shown when conversation is complete (ticket has been created).
 * Replaces the chat input with navigation options.
 */
export function ConversationCompleteFooter({
  onNewReport,
  onViewDashboard,
}: ConversationCompleteFooterProps) {
  return (
    <div className="bg-background border-border/50 shrink-0 border-t">
      <div className="mx-auto max-w-3xl px-4 py-4">
        <div className="bg-muted/50 rounded-xl p-4">
          <p className="text-muted-foreground mb-3 text-center text-sm">
            Percakapan telah selesai. Silakan pilih langkah selanjutnya:
          </p>
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Button onClick={onNewReport} variant="default" className="gap-2">
              <MessageSquarePlus className="size-4" />
              Buat Laporan Baru
            </Button>
            <Button onClick={onViewDashboard} variant="outline" className="gap-2">
              <LayoutDashboard className="size-4" />
              Lihat Dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
