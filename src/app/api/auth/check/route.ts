/**
 * Auth Check & Refresh Endpoint
 *
 * GET /api/auth/check
 *
 * Checks authentication status and auto-refreshes token if needed.
 * Also returns redirect path from cookie if present.
 *
 * Logic:
 * 1. If no citizen_access_token cookie → not authenticated
 * 2. If token exists and valid → authenticated
 * 3. If token expired but logto_* cookies exist → refresh from Logto
 * 4. If refresh fails → not authenticated
 *
 * Response:
 * - authenticated: boolean
 * - redirectPath: string | null (only if authenticated, from cookie)
 */

import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { ACCESS_TOKEN_COOKIE, REDIRECT_PATH_COOKIE, REFRESH_BUFFER_SECONDS } from '@/features/auth';
import { getTokenExpiration } from '@/features/auth/utils/jwt';
import {
  getAccessTokenFromLogto,
  setAccessTokenOnResponse,
} from '@/features/auth/utils/server-token';

/**
 * Check if Logto session cookies exist (prefix: logto_)
 */
function hasLogtoSessionCookies(cookieStore: Awaited<ReturnType<typeof cookies>>): boolean {
  const allCookies = cookieStore.getAll();
  return allCookies.some((cookie) => cookie.name.startsWith('logto_'));
}

/**
 * Check if token is expired or about to expire
 */
function isTokenExpiredOrExpiring(token: string): boolean {
  const now = Math.floor(Date.now() / 1000);
  const expiresAt = getTokenExpiration(token);

  if (!expiresAt) return true; // Can't determine expiry, treat as expired
  return expiresAt - now <= REFRESH_BUFFER_SECONDS;
}

/**
 * Get redirect path from cookie and decode it
 */
function getRedirectPath(cookieStore: Awaited<ReturnType<typeof cookies>>): string | null {
  const redirectCookie = cookieStore.get(REDIRECT_PATH_COOKIE)?.value;
  if (!redirectCookie) return null;

  try {
    return decodeURIComponent(redirectCookie);
  } catch {
    return null;
  }
}

/**
 * Build authenticated response with optional redirect path
 */
function buildAuthenticatedResponse(redirectPath: string | null): NextResponse {
  const response = NextResponse.json(
    {
      authenticated: true,
      redirectPath,
    },
    {
      status: 200,
      headers: { 'Cache-Control': 'no-store, must-revalidate' },
    }
  );

  // Delete redirect cookie after reading
  if (redirectPath) {
    response.cookies.delete(REDIRECT_PATH_COOKIE);
  }

  return response;
}

/**
 * Build unauthenticated response
 */
function buildUnauthenticatedResponse(): NextResponse {
  return NextResponse.json(
    { authenticated: false, redirectPath: null },
    {
      status: 200,
      headers: { 'Cache-Control': 'no-store, must-revalidate' },
    }
  );
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;
    const redirectPath = getRedirectPath(cookieStore);

    // Case 1: No access token
    if (!accessToken) {
      // Check if we can refresh from Logto
      if (hasLogtoSessionCookies(cookieStore)) {
        return await tryRefreshToken(redirectPath);
      }

      return buildUnauthenticatedResponse();
    }

    // Case 2: Token exists and is valid
    if (!isTokenExpiredOrExpiring(accessToken)) {
      return buildAuthenticatedResponse(redirectPath);
    }

    // Case 3: Token expired, check if we can refresh
    if (hasLogtoSessionCookies(cookieStore)) {
      return await tryRefreshToken(redirectPath);
    }

    // Case 4: Token expired and no Logto session
    return buildUnauthenticatedResponse();
  } catch (error) {
    console.error('[Auth Check] Error:', error);
    return buildUnauthenticatedResponse();
  }
}

/**
 * Try to refresh token from Logto
 */
async function tryRefreshToken(redirectPath: string | null): Promise<NextResponse> {
  try {
    const { accessToken, isAuthenticated } = await getAccessTokenFromLogto();

    if (!isAuthenticated || !accessToken) {
      return buildUnauthenticatedResponse();
    }

    // Build response with redirect path
    const response = buildAuthenticatedResponse(redirectPath);

    // Set new access token cookie
    setAccessTokenOnResponse(response, accessToken);

    return response;
  } catch (error) {
    console.error('[Auth Check] Refresh failed:', error);
    return buildUnauthenticatedResponse();
  }
}
