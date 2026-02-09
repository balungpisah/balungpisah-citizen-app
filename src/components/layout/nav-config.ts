import {
  Home,
  BarChart3,
  FileText,
  MessageSquarePlus,
  LogOut,
  type LucideIcon,
} from 'lucide-react';

/**
 * Navigation item configuration
 */
export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  /** Requires authentication to show */
  authRequired?: boolean;
  /** Only show for guests (not authenticated) */
  guestOnly?: boolean;
  /** Show as primary CTA button (desktop only) */
  isCTA?: boolean;
  /** Show in bottom nav (mobile) */
  showInBottomNav?: boolean;
  /** Show in top nav (desktop) */
  showInTopNav?: boolean;
}

/**
 * User menu item configuration
 */
export interface UserMenuItem {
  label: string;
  href?: string;
  icon: LucideIcon;
  action?: 'signOut';
}

/**
 * Main navigation items
 *
 * Guest: Beranda | Dashboard
 * Authenticated: Dashboard | Laporan Saya | Buat Laporan (CTA)
 */
export const NAV_ITEMS: NavItem[] = [
  {
    label: 'Beranda',
    href: '/',
    icon: Home,
    guestOnly: true,
    showInBottomNav: true,
    showInTopNav: true,
  },
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: BarChart3,
    showInBottomNav: true,
    showInTopNav: true,
  },
  {
    label: 'Laporan Saya',
    href: '/my-reports',
    icon: FileText,
    authRequired: true,
    showInBottomNav: true,
    showInTopNav: true,
  },
  {
    label: 'Buat Laporan',
    href: '/lapor',
    icon: MessageSquarePlus,
    authRequired: true,
    isCTA: true,
    showInBottomNav: true,
    showInTopNav: true,
  },
];

/**
 * User dropdown menu items (desktop only)
 */
export const USER_MENU_ITEMS: UserMenuItem[] = [
  {
    label: 'Keluar',
    icon: LogOut,
    action: 'signOut',
  },
];

/**
 * Routes configuration
 */
export const ROUTES = {
  home: '/',
  dashboard: '/dashboard',
  myReports: '/my-reports',
  lapor: '/lapor',
  signIn: '/api/auth/sign-in',
  signUp: '/api/auth/sign-up',
  signOut: '/api/auth/sign-out',
} as const;

/**
 * Routes where bottom nav should be hidden (e.g., full-screen chat)
 */
export const HIDE_BOTTOM_NAV_ROUTES = ['/lapor'];

/**
 * Check if bottom nav should be hidden for a given pathname
 */
export function shouldHideBottomNav(pathname: string): boolean {
  return HIDE_BOTTOM_NAV_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}

/**
 * Get navigation items filtered by auth state
 */
export function getNavItems(isAuthenticated: boolean): NavItem[] {
  return NAV_ITEMS.filter((item) => {
    if (item.authRequired && !isAuthenticated) return false;
    if (item.guestOnly && isAuthenticated) return false;
    return true;
  });
}

/**
 * Get bottom nav items filtered by auth state
 */
export function getBottomNavItems(isAuthenticated: boolean): NavItem[] {
  return getNavItems(isAuthenticated).filter((item) => item.showInBottomNav);
}

/**
 * Get top nav items filtered by auth state
 */
export function getTopNavItems(isAuthenticated: boolean): NavItem[] {
  return getNavItems(isAuthenticated).filter((item) => item.showInTopNav);
}
