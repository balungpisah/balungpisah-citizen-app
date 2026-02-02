'use client';

import { Send, MessageSquarePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AttachmentButton } from './AttachmentButton';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onNewChat?: () => void;
  disabled?: boolean;
  placeholder?: string;
  showNewChatButton?: boolean;
  // Attachment props
  attachmentCount?: number;
  canAddMoreAttachments?: boolean;
  onFilesSelected?: (files: FileList) => void;
  onOpenAttachments?: () => void;
}

export function ChatInput({
  value,
  onChange,
  onSend,
  onNewChat,
  disabled = false,
  placeholder = 'Ceritakan masalah Anda...',
  showNewChatButton = false,
  attachmentCount = 0,
  canAddMoreAttachments = true,
  onFilesSelected,
  onOpenAttachments,
}: ChatInputProps) {
  const canSend = value.trim() && !disabled;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (canSend) {
        onSend();
      }
    }
  };

  return (
    <div className="bg-background border-border/50 shrink-0 border-t">
      <div className="mx-auto max-w-3xl px-4 py-3">
        <div className="bg-card focus-within:ring-primary/50 flex items-end gap-2 rounded-2xl p-2 transition-shadow focus-within:ring-2">
          {/* Attachment button */}
          {onFilesSelected && onOpenAttachments && (
            <AttachmentButton
              count={attachmentCount}
              canAddMore={canAddMoreAttachments}
              onFilesSelected={onFilesSelected}
              onOpenDrawer={onOpenAttachments}
              disabled={disabled}
            />
          )}

          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="text-foreground placeholder:text-muted-foreground max-h-32 min-h-[44px] flex-1 resize-none border-none bg-transparent p-2 text-sm outline-none focus:ring-0 focus-visible:ring-0"
            rows={1}
            onKeyDown={handleKeyDown}
            disabled={disabled}
          />

          <Button onClick={onSend} disabled={!canSend} size="icon" className="shrink-0">
            <Send className="size-4" />
          </Button>
        </div>

        {/* Footer: hints and new chat button */}
        <div className="mt-2 flex items-center justify-between">
          <p className="text-muted-foreground text-xs">
            Tekan Enter untuk mengirim, Shift+Enter untuk baris baru
          </p>

          {showNewChatButton && onNewChat && (
            <button
              onClick={onNewChat}
              disabled={disabled}
              className="text-muted-foreground hover:text-foreground flex items-center gap-1.5 text-xs transition-colors disabled:opacity-50"
            >
              <MessageSquarePlus className="size-3.5" />
              <span>Laporan Baru</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
