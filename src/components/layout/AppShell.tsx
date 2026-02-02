'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/features/auth';
import { TopNavbar } from './TopNavbar';
import { BottomNav } from './BottomNav';
import { shouldHideBottomNav } from './nav-config';
import { cn } from '@/lib/utils';

interface AppShellProps {
  children: ReactNode;
  /** Custom header to replace TopNavbar (e.g., ChatNavbar) */
  customHeader?: ReactNode;
  /** Hide all navigation (for full-screen experiences) */
  hideNav?: boolean;
  /** Hide bottom nav specifically (e.g., chat pages) */
  hideBottomNav?: boolean;
  /** Use full viewport height layout (for chat/full-screen pages) */
  fullHeight?: boolean;
}

/**
 * Main application shell with responsive navigation
 *
 * - Desktop: Shows TopNavbar at the top
 * - Mobile: Shows BottomNav at the bottom (unless hidden)
 * - Supports custom headers for special pages (e.g., chat)
 * - Supports full-height layout for chat-like pages
 */
export function AppShell({
  children,
  customHeader,
  hideNav = false,
  hideBottomNav,
  fullHeight = false,
}: AppShellProps) {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const { isAuthenticated, isLoading, signOut } = useAuth();

  // Determine if bottom nav should be hidden
  const shouldHideBottom = hideBottomNav ?? shouldHideBottomNav(pathname);

  // Calculate if we need bottom padding for the nav
  const needsBottomPadding = isMobile && !shouldHideBottom && !hideNav;

  if (hideNav) {
    return <>{children}</>;
  }

  return (
    <div className={cn('bg-background', fullHeight ? 'flex h-dvh flex-col' : 'min-h-screen')}>
      {/* Header: Either custom or TopNavbar */}
      {customHeader || (
        <TopNavbar isAuthenticated={isAuthenticated} isLoading={isLoading} onSignOut={signOut} />
      )}

      {/* Main content */}
      {fullHeight ? (
        // Full-height mode: flex child that fills remaining space
        <div className="flex min-h-0 flex-1 flex-col">{children}</div>
      ) : (
        // Normal mode: standard main element
        <main className={cn(needsBottomPadding && 'pb-20')}>{children}</main>
      )}

      {/* Bottom navigation (mobile only, unless hidden) */}
      {isMobile && !shouldHideBottom && <BottomNav isAuthenticated={isAuthenticated} />}
    </div>
  );
}
