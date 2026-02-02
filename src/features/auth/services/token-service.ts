/**
 * Token Service - BFF Pattern
 *
 * With BFF pattern, tokens are stored in httpOnly cookies.
 * Client cannot read tokens directly - all auth is handled server-side.
 *
 * This service provides:
 * - Auth check via /api/auth/check endpoint (lightweight, only checks token existence)
 * - Cached auth status to avoid repeated API calls
 */

import { AUTH_CACHE_TTL } from '../constants';

// Re-export constants for backward compatibility
export { ACCESS_TOKEN_COOKIE, REDIRECT_PATH_COOKIE, REFRESH_BUFFER_SECONDS } from '../constants';

// =============================================================================
// STATE
// =============================================================================

/** Cache for auth status to avoid repeated calls */
let authStatusCache: { isAuthenticated: boolean; timestamp: number } | null = null;

// =============================================================================
// AUTH STATUS (via server call)
// =============================================================================

/**
 * Check if user is authenticated by calling /api/auth/check
 * Lightweight endpoint that only checks if access token cookie exists
 */
export async function checkAuthStatus(): Promise<boolean> {
  // Check cache first
  const now = Date.now();
  if (authStatusCache && now - authStatusCache.timestamp < AUTH_CACHE_TTL) {
    return authStatusCache.isAuthenticated;
  }

  try {
    const response = await fetch('/api/auth/check', {
      method: 'GET',
      credentials: 'include',
    });

    // Check if access token exists based on response
    const isAuthenticated = response.ok;

    // Update cache
    authStatusCache = { isAuthenticated, timestamp: now };

    return isAuthenticated;
  } catch (error) {
    console.error('[TokenService] Error checking auth status:', error);
    authStatusCache = { isAuthenticated: false, timestamp: now };
    return false;
  }
}

/**
 * Synchronous auth check - uses cached value only
 * Returns false if cache is empty or expired
 *
 * Use this for quick UI checks, but prefer checkAuthStatus() for accurate status
 */
export function isAuthenticated(): boolean {
  if (!authStatusCache) return false;

  const now = Date.now();
  if (now - authStatusCache.timestamp > AUTH_CACHE_TTL) {
    return false;
  }

  return authStatusCache.isAuthenticated;
}

/**
 * Force refresh auth status (invalidate cache and call server)
 */
export async function refreshAuthStatus(): Promise<boolean> {
  authStatusCache = null;
  return checkAuthStatus();
}

// =============================================================================
// CLEAR/LOGOUT
// =============================================================================

/**
 * Clear auth status cache
 * Note: Actual cookie clearing is done server-side via /api/auth/sign-out
 */
export function clearAuthCache(): void {
  authStatusCache = null;
}
