/**
 * Server-side Token Utilities
 *
 * Reusable functions for getting access token from Logto
 * and setting it to cookies. Works in Route Handlers and Server Actions.
 *
 * Two methods for setting cookies:
 * - setAccessTokenOnResponse(): Use in GET Route Handlers (more reliable)
 * - setAccessTokenOnCookieStore(): Use in POST/mutations or Server Actions
 */

import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { getLogtoContext } from '@logto/next/server-actions';
import { getLogtoConfig } from '@/features/auth/config/logto';
import { ACCESS_TOKEN_COOKIE, REDIRECT_PATH_COOKIE } from '../services/token-service';
import { getTokenExpiration } from './jwt';

// =============================================================================
// TYPES
// =============================================================================

export interface TokenResult {
  accessToken: string | null;
  isAuthenticated: boolean;
}

// =============================================================================
// TOKEN RETRIEVAL
// =============================================================================

/**
 * Get fresh access token from Logto
 * Fetches new token from Logto context with resource scope
 */
export async function getAccessTokenFromLogto(): Promise<TokenResult> {
  try {
    const logtoConfig = getLogtoConfig();

    const logtoContext = await getLogtoContext(logtoConfig, {
      getAccessToken: true,
      resource: logtoConfig.resources?.[0] || '',
    });

    if (!logtoContext.isAuthenticated) {
      console.warn('[ServerToken] User not authenticated');
      return { accessToken: null, isAuthenticated: false };
    }

    if (!logtoContext.accessToken) {
      console.warn('[ServerToken] No access token available');
      return { accessToken: null, isAuthenticated: true };
    }

    return {
      accessToken: logtoContext.accessToken,
      isAuthenticated: true,
    };
  } catch (error) {
    console.error('[ServerToken] Error getting access token:', error);
    return { accessToken: null, isAuthenticated: false };
  }
}

// =============================================================================
// COOKIE HELPERS
// =============================================================================

/**
 * Calculate cookie maxAge from token expiration
 * Returns 1 hour as default if expiration cannot be determined
 */
function calculateCookieMaxAge(accessToken: string): number {
  const now = Math.floor(Date.now() / 1000);
  const tokenExp = getTokenExpiration(accessToken);
  const maxAge = tokenExp ? tokenExp - now : 60 * 60;
  return maxAge > 0 ? maxAge : 60 * 60;
}

/**
 * Get standardized cookie options for access token
 */
function getAccessTokenCookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge,
  };
}

// =============================================================================
// COOKIE SETTERS
// =============================================================================

/**
 * Set access token cookie on NextResponse
 *
 * Use this method in GET Route Handlers where response.cookies.set()
 * is more reliable than cookies().set()
 *
 * @param response - NextResponse to set cookie on
 * @param accessToken - JWT access token
 */
export function setAccessTokenOnResponse(response: NextResponse, accessToken: string): void {
  const maxAge = calculateCookieMaxAge(accessToken);
  response.cookies.set(ACCESS_TOKEN_COOKIE, accessToken, getAccessTokenCookieOptions(maxAge));
}

/**
 * Set access token cookie using cookies() store
 *
 * Use this method in:
 * - POST/PUT/DELETE Route Handlers
 * - Server Actions
 * - Middleware
 *
 * @param cookieStore - Cookie store from await cookies()
 * @param accessToken - JWT access token
 */
export function setAccessTokenOnCookieStore(
  cookieStore: Awaited<ReturnType<typeof cookies>>,
  accessToken: string
): void {
  const maxAge = calculateCookieMaxAge(accessToken);
  cookieStore.set(ACCESS_TOKEN_COOKIE, accessToken, getAccessTokenCookieOptions(maxAge));
}

// =============================================================================
// COMBINED OPERATIONS
// =============================================================================

/**
 * Refresh access token from Logto and set cookie (using cookieStore)
 *
 * This is a convenience function that:
 * 1. Gets fresh token from Logto
 * 2. Sets it in the cookie store
 * 3. Clears the redirect path cookie if present
 *
 * @param cookieStore - Cookie store from await cookies()
 * @returns The new access token or null if refresh failed
 */
export async function refreshAndSetAccessToken(
  cookieStore: Awaited<ReturnType<typeof cookies>>
): Promise<string | null> {
  const { accessToken, isAuthenticated } = await getAccessTokenFromLogto();

  if (!isAuthenticated || !accessToken) {
    console.warn('[ServerToken] Token refresh failed - not authenticated or no token');
    return null;
  }

  // Set the new token in cookie
  setAccessTokenOnCookieStore(cookieStore, accessToken);

  // Clear redirect path cookie after successful refresh
  if (cookieStore.get(REDIRECT_PATH_COOKIE)) {
    cookieStore.delete(REDIRECT_PATH_COOKIE);
  }

  return accessToken;
}

/**
 * Delete access token cookie
 *
 * @param cookieStore - Cookie store from await cookies()
 */
export function deleteAccessTokenCookie(cookieStore: Awaited<ReturnType<typeof cookies>>): void {
  cookieStore.delete(ACCESS_TOKEN_COOKIE);
}
