/**
 * Next.js Middleware for Authentication
 *
 * Handles:
 * 1. Protected routes - redirect to sign-in if not authenticated
 * 2. Auth routes - redirect to home if already authenticated
 * 3. Save redirect path to cookie for post-login redirect
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Cookie names (must match token-service.ts)
const ACCESS_TOKEN_COOKIE = 'citizen_access_token';
const REDIRECT_PATH_COOKIE = 'citizen_redirect_path';

// Routes that require authentication
const PROTECTED_ROUTES = ['/dashboard/reports', '/lapor'];

// Routes only for unauthenticated users
const AUTH_ROUTES = ['/sign-in', '/sign-up'];

// Routes that should be excluded from middleware
const PUBLIC_ROUTES = ['/callback', '/auth/processing', '/api'];

/**
 * Check if path matches any of the route patterns
 */
function matchesRoute(path: string, routes: string[]): boolean {
  return routes.some((route) => path === route || path.startsWith(`${route}/`));
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip public routes and API routes
  if (matchesRoute(pathname, PUBLIC_ROUTES)) {
    return NextResponse.next();
  }

  // Check if user has access token cookie
  const hasAccessToken = request.cookies.has(ACCESS_TOKEN_COOKIE);

  // Protected routes - require authentication
  if (matchesRoute(pathname, PROTECTED_ROUTES)) {
    if (!hasAccessToken) {
      // Save intended destination to cookie
      const response = NextResponse.redirect(new URL('/sign-in', request.url));

      // Only save redirect path if it's not the root protected route
      const redirectPath = pathname + request.nextUrl.search;
      response.cookies.set(REDIRECT_PATH_COOKIE, encodeURIComponent(redirectPath), {
        httpOnly: true,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 10, // 10 minutes
      });

      return response;
    }

    // Has token, continue (token validation happens in auth/check or proxy)
    return NextResponse.next();
  }

  // Auth routes - redirect if already authenticated
  if (matchesRoute(pathname, AUTH_ROUTES)) {
    if (hasAccessToken) {
      // Already logged in, redirect to home or dashboard
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
  }

  // All other routes - pass through
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
