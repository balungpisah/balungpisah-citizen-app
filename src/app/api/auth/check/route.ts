/**
 * Auth Check & Refresh Endpoint
 *
 * GET /api/auth/check
 *
 * Checks authentication status and auto-refreshes token if needed.
 *
 * Logic:
 * 1. If no citizen_access_token cookie → not authenticated
 * 2. If token exists and valid → authenticated
 * 3. If token expired but logto_* cookies exist → refresh from Logto
 * 4. If refresh fails → not authenticated
 */

import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { ACCESS_TOKEN_COOKIE, REFRESH_BUFFER_SECONDS } from '@/features/auth';
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

export async function GET() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;

    // Case 1: No access token
    if (!accessToken) {
      // Check if we can refresh from Logto
      if (hasLogtoSessionCookies(cookieStore)) {
        return await tryRefreshToken();
      }

      return NextResponse.json(
        { authenticated: false },
        {
          status: 200,
          headers: { 'Cache-Control': 'no-store, must-revalidate' },
        }
      );
    }

    // Case 2: Token exists and is valid
    if (!isTokenExpiredOrExpiring(accessToken)) {
      return NextResponse.json(
        { authenticated: true },
        {
          status: 200,
          headers: { 'Cache-Control': 'no-store, must-revalidate' },
        }
      );
    }

    // Case 3: Token expired, check if we can refresh
    if (hasLogtoSessionCookies(cookieStore)) {
      return await tryRefreshToken();
    }

    // Case 4: Token expired and no Logto session
    return NextResponse.json(
      { authenticated: false },
      {
        status: 200,
        headers: { 'Cache-Control': 'no-store, must-revalidate' },
      }
    );
  } catch (error) {
    console.error('[Auth Check] Error:', error);
    return NextResponse.json(
      { authenticated: false },
      {
        status: 200,
        headers: { 'Cache-Control': 'no-store, must-revalidate' },
      }
    );
  }
}

/**
 * Try to refresh token from Logto
 */
async function tryRefreshToken(): Promise<NextResponse> {
  try {
    const { accessToken, isAuthenticated } = await getAccessTokenFromLogto();

    if (!isAuthenticated || !accessToken) {
      return NextResponse.json(
        { authenticated: false },
        {
          status: 200,
          headers: { 'Cache-Control': 'no-store, must-revalidate' },
        }
      );
    }

    // Build response with new token cookie
    const response = NextResponse.json(
      { authenticated: true },
      {
        status: 200,
        headers: { 'Cache-Control': 'no-store, must-revalidate' },
      }
    );

    // Set new access token cookie
    setAccessTokenOnResponse(response, accessToken);

    return response;
  } catch (error) {
    console.error('[Auth Check] Refresh failed:', error);
    return NextResponse.json(
      { authenticated: false },
      {
        status: 200,
        headers: { 'Cache-Control': 'no-store, must-revalidate' },
      }
    );
  }
}
