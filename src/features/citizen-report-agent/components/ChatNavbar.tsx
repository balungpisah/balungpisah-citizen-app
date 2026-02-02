'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { MessageSquarePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserMenu } from '@/components/layout/UserMenu';
import { useAuth } from '@/features/auth';
import { cn } from '@/lib/utils';
import { useChatStore } from '../stores/chat-store';

/**
 * Chat-specific navbar that matches TopNavbar styling
 *
 * Shows nav links, "Laporan Baru" button (when in conversation), and UserMenu.
 */
export function ChatNavbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading, signOut } = useAuth();

  // Chat store
  const messages = useChatStore((state) => state.messages);
  const threadId = useChatStore((state) => state.threadId);
  const startNewChat = useChatStore((state) => state.startNewChat);

  // Show new chat button when in an active conversation
  const showNewChatButton = pathname !== '/lapor' || messages.length > 0 || !!threadId;

  const handleNewChat = () => {
    startNewChat();
    router.push('/lapor');
  };

  // Nav items for chat pages
  const navItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Laporan Saya', href: '/laporan-saya' },
  ];

  return (
    <header className="bg-background/70 sticky top-0 z-50 shrink-0 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        {/* Logo - Left */}
        <Link href="/" className="flex items-center transition-opacity hover:opacity-80">
          <span className="text-foreground text-lg font-bold tracking-tight">
            Balung<span className="text-primary">Pisah</span>
          </span>
        </Link>

        {/* Navigation - Right */}
        <div className="flex items-center gap-6">
          {/* Nav Links (desktop) */}
          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'relative px-3 py-2 text-sm font-medium transition-colors',
                    isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {item.label}
                  {isActive && (
                    <span className="bg-primary absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* New Chat button - shown when in conversation */}
            {showNewChatButton && (
              <Button onClick={handleNewChat} variant="outline" size="sm" className="gap-1.5">
                <MessageSquarePlus className="size-4" />
                <span className="hidden sm:inline">Laporan Baru</span>
              </Button>
            )}

            {/* User Menu */}
            {isLoading ? (
              <div className="bg-muted h-8 w-8 animate-pulse rounded-full" />
            ) : isAuthenticated ? (
              <UserMenu onSignOut={signOut} />
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}
