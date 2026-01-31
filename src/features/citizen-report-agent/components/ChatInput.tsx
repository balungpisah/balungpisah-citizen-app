'use client';

import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({
  value,
  onChange,
  onSend,
  disabled = false,
  placeholder = 'Ceritakan masalah Anda...',
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
    <div className="bg-background border-card sticky bottom-0 border-t">
      <div className="mx-auto max-w-3xl px-4 py-4">
        <div className="bg-card flex items-end gap-3 rounded-2xl p-2">
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="text-foreground placeholder:text-muted-foreground max-h-32 min-h-[44px] flex-1 resize-none border-none bg-transparent p-2 text-sm outline-none"
            rows={1}
            onKeyDown={handleKeyDown}
            disabled={disabled}
          />
          <Button onClick={onSend} disabled={!canSend} size="icon" className="shrink-0">
            <Send className="size-4" />
          </Button>
        </div>
        <p className="text-muted-foreground mt-2 text-center text-xs">
          Tekan Enter untuk mengirim, Shift+Enter untuk baris baru
        </p>
      </div>
    </div>
  );
}
