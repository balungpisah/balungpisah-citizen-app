'use client';

import { LogOut } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface UserMenuProps {
  /** User's display name */
  name?: string;
  /** User's avatar URL */
  avatarUrl?: string;
  /** Called when user clicks sign out */
  onSignOut: () => void;
}

/**
 * User profile dropdown menu for desktop navigation
 *
 * Minimal version - only sign out action for now.
 * Will expand when Profil/Tiket features are released.
 */
export function UserMenu({ name, avatarUrl, onSignOut }: UserMenuProps) {
  const initials = name
    ? name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="focus-visible:ring-ring rounded-full focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          aria-label="Buka menu pengguna"
        >
          <Avatar size="default" className="cursor-pointer">
            {avatarUrl && <AvatarImage src={avatarUrl} alt={name || 'User avatar'} />}
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-36">
        <DropdownMenuItem onClick={onSignOut} variant="destructive">
          <LogOut className="size-4" />
          Keluar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
