'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { MessageSquarePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useChatStore } from '../stores/chat-store';

export function ChatNavbar() {
  const router = useRouter();
  const pathname = usePathname();

  // Use individual selectors for stable references
  const messages = useChatStore((state) => state.messages);
  const threadId = useChatStore((state) => state.threadId);
  const startNewChat = useChatStore((state) => state.startNewChat);

  // Show new chat button when in an active conversation
  const showNewChatButton = pathname !== '/lapor' || messages.length > 0 || !!threadId;

  const handleNewChat = () => {
    startNewChat();
    router.push('/lapor');
  };

  return (
    <header className="bg-background border-border/50 sticky top-0 z-50 border-b">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <span className="text-foreground text-lg font-bold">
            Balung<span className="text-primary">Pisah</span>
          </span>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {showNewChatButton && (
            <Button onClick={handleNewChat} variant="secondary" size="sm" className="gap-1.5">
              <MessageSquarePlus className="size-4" />
              <span className="hidden sm:inline">Laporan Baru</span>
            </Button>
          )}

          <Link
            href="/dashboard"
            className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </header>
  );
}
