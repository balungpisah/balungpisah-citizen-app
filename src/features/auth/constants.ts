/**
 * Auth Constants
 *
 * Shared constants for authentication across the app.
 * Safe to import in Edge runtime (middleware) and Node.js.
 */

/** Cookie name for access token (httpOnly) */
export const ACCESS_TOKEN_COOKIE = 'citizen_access_token';

/** Cookie name for storing intended redirect path after login */
export const REDIRECT_PATH_COOKIE = 'citizen_redirect_path';

/** Buffer time (seconds) before expiration to trigger refresh */
export const REFRESH_BUFFER_SECONDS = 5 * 60; // 5 minutes

/** Cache TTL in milliseconds for auth status */
export const AUTH_CACHE_TTL = 30 * 1000; // 30 seconds
