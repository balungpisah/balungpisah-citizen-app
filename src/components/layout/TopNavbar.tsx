'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MessageSquarePlus, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getTopNavItems, ROUTES } from './nav-config';
import { UserMenu } from './UserMenu';
import { cn } from '@/lib/utils';

interface TopNavbarProps {
  /** Whether the user is authenticated */
  isAuthenticated: boolean;
  /** Whether auth is still loading */
  isLoading?: boolean;
  /** Called when user clicks sign out */
  onSignOut: () => void;
  /** User's display name */
  userName?: string;
  /** User's avatar URL */
  userAvatarUrl?: string;
}

/**
 * Desktop top navigation bar
 *
 * Logo on left, all navigation on right (compact layout).
 */
export function TopNavbar({
  isAuthenticated,
  isLoading = false,
  onSignOut,
  userName,
  userAvatarUrl,
}: TopNavbarProps) {
  const pathname = usePathname();
  const navItems = getTopNavItems(isAuthenticated);

  // Filter out CTA items from regular nav links (they'll be shown as buttons)
  const regularNavItems = navItems.filter((item) => !item.isCTA);
  const ctaItem = navItems.find((item) => item.isCTA);

  return (
    <header className="bg-background/70 sticky top-0 z-50 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        {/* Logo - Left */}
        <Link href="/" className="flex items-center transition-opacity hover:opacity-80">
          <span className="text-foreground text-lg font-bold tracking-tight">
            Balung<span className="text-primary">Pisah</span>
          </span>
        </Link>

        {/* All navigation - Right */}
        <div className="hidden items-center gap-6 md:flex">
          {/* Nav Links - Simple text links for clear hierarchy */}
          <nav className="flex items-center gap-1">
            {regularNavItems.map((item) => {
              // Match nested routes (e.g., /dashboard/reports/123 highlights Dashboard)
              const isActive =
                item.href === '/'
                  ? pathname === '/'
                  : pathname === item.href || pathname.startsWith(`${item.href}/`);
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
                  {/* Active indicator - subtle underline */}
                  {isActive && (
                    <span className="bg-primary absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Auth section - Only show when not loading */}
          {isLoading ? (
            <div className="bg-muted h-8 w-20 animate-pulse rounded-md" />
          ) : isAuthenticated ? (
            <div className="flex items-center gap-3">
              {/* Buat Laporan CTA - Primary action, the only prominent button */}
              {ctaItem && (
                <Button asChild size="sm" className="gap-1.5">
                  <Link href={ctaItem.href}>
                    <MessageSquarePlus className="size-4" />
                    {ctaItem.label}
                  </Link>
                </Button>
              )}
              {/* User Menu */}
              <UserMenu name={userName} avatarUrl={userAvatarUrl} onSignOut={onSignOut} />
            </div>
          ) : (
            /* Guest: Show Masuk/Daftar */
            <div className="flex items-center gap-2">
              <Button asChild variant="ghost" size="sm">
                <Link href={ROUTES.signIn}>Masuk</Link>
              </Button>
              <Button asChild size="sm" className="gap-1.5">
                <Link href={ROUTES.signUp}>
                  <UserPlus className="size-4" />
                  Daftar
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
