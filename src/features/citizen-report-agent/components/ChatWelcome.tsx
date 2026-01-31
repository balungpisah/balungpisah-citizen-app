'use client';

import { Bot } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export function ChatWelcome() {
  return (
    <div className="flex gap-3">
      <Avatar className="size-8 shrink-0">
        <AvatarFallback className="bg-primary text-primary-foreground">
          <Bot className="size-4" />
        </AvatarFallback>
      </Avatar>
      <div className="bg-card text-foreground max-w-[80%] rounded-2xl rounded-tl-md p-4">
        <p className="leading-relaxed">
          Halo! Saya akan membantu Anda menyampaikan masalah ke pemerintah. Ceritakan, apa masalah
          yang ingin Anda laporkan?
        </p>
      </div>
    </div>
  );
}
