'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getBottomNavItems } from './nav-config';
import { cn } from '@/lib/utils';

interface BottomNavProps {
  /** Whether the user is authenticated */
  isAuthenticated: boolean;
}

/**
 * Mobile bottom navigation bar
 *
 * Shows icon + label for each nav item with active state indicator.
 */
export function BottomNav({ isAuthenticated }: BottomNavProps) {
  const pathname = usePathname();
  const navItems = getBottomNavItems(isAuthenticated);

  return (
    <nav className="bg-background/80 border-border/50 pb-safe fixed right-0 bottom-0 left-0 z-50 border-t backdrop-blur-md md:hidden">
      <div className="flex h-16 items-center justify-around px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const isCTA = item.isCTA;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 px-1 py-2',
                'transition-colors',
                isActive ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              {isCTA ? (
                // CTA item gets special styling
                <div
                  className={cn(
                    'bg-primary text-primary-foreground -mt-4 flex size-12 items-center justify-center rounded-full shadow-lg',
                    isActive && 'ring-primary/30 ring-4'
                  )}
                >
                  <Icon className="size-5" />
                </div>
              ) : (
                <Icon className={cn('size-5', isActive && 'text-primary')} />
              )}
              <span
                className={cn(
                  'max-w-full truncate text-[10px] font-medium',
                  isCTA && '-mt-0.5',
                  isActive ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
