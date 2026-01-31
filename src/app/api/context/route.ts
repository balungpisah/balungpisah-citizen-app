/**
 * Auth Context API Endpoint
 *
 * GET /api/context
 *
 * Returns auth context and manages access token cookie.
 * Called by client during auth processing to get/set authentication state.
 *
 * Note: Uses NextResponse.cookies() instead of cookies() from next/headers
 * because cookies().set() doesn't work reliably in GET Route Handlers.
 */

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { ACCESS_TOKEN_COOKIE, REDIRECT_PATH_COOKIE, REFRESH_BUFFER_SECONDS } from '@/features/auth';
import { getTokenExpiration } from '@/features/auth/utils/jwt';
import {
  getAccessTokenFromLogto,
  setAccessTokenOnResponse,
} from '@/features/auth/utils/server-token';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const now = Math.floor(Date.now() / 1000);

    // Try to use cached token if still valid
    const cachedToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;

    if (cachedToken) {
      const expiresAt = getTokenExpiration(cachedToken);

      if (expiresAt && expiresAt - now > REFRESH_BUFFER_SECONDS) {
        // Read redirect path from cookie
        const redirectPath = cookieStore.get(REDIRECT_PATH_COOKIE)?.value;

        return NextResponse.json({
          isAuthenticated: true,
          redirectPath: redirectPath ? decodeURIComponent(redirectPath) : null,
        });
      }
    }

    // Fetch fresh context from Logto with access token for resource
    const { accessToken, isAuthenticated } = await getAccessTokenFromLogto();

    if (!isAuthenticated) {
      return NextResponse.json({
        isAuthenticated: false,
      });
    }

    if (!accessToken) {
      return NextResponse.json({
        isAuthenticated: false,
        error: 'No access token available',
      });
    }

    // Read redirect path from cookie
    const redirectPath = cookieStore.get(REDIRECT_PATH_COOKIE)?.value;

    // Build response with cookies set via NextResponse
    const response = NextResponse.json({
      isAuthenticated: true,
      redirectPath: redirectPath ? decodeURIComponent(redirectPath) : null,
    });

    // Set access token cookie on response using shared utility
    setAccessTokenOnResponse(response, accessToken);

    // Delete the redirect path cookie after reading
    if (redirectPath) {
      response.cookies.delete(REDIRECT_PATH_COOKIE);
    }

    return response;
  } catch (error) {
    console.error('[/api/context] Error:', error instanceof Error ? error.message : error);

    return NextResponse.json(
      {
        isAuthenticated: false,
        error: error instanceof Error ? error.message : 'Failed to get auth context',
      },
      { status: 500 }
    );
  }
}
