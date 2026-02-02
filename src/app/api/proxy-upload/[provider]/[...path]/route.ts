import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { ACCESS_TOKEN_COOKIE } from '@/features/auth';
import {
  getAccessTokenFromLogto,
  setAccessTokenOnCookieStore,
} from '@/features/auth/utils/server-token';
import { buildBackendUrl } from '@/lib/api/proxy-config';

/**
 * Proxy route for file uploads (multipart/form-data)
 *
 * This route forwards file uploads to the backend while handling:
 * - Authentication token injection
 * - Automatic token refresh on 401
 * - Multipart form data passthrough
 */

/**
 * Check if Logto session cookies exist
 */
function hasLogtoSessionCookies(cookieStore: Awaited<ReturnType<typeof cookies>>): boolean {
  const allCookies = cookieStore.getAll();
  return allCookies.some((cookie) => cookie.name.startsWith('logto_'));
}

/**
 * Try to refresh token from Logto and update cookie
 */
async function tryRefreshToken(
  cookieStore: Awaited<ReturnType<typeof cookies>>
): Promise<string | null> {
  if (!hasLogtoSessionCookies(cookieStore)) {
    return null;
  }

  try {
    const { accessToken, isAuthenticated } = await getAccessTokenFromLogto();

    if (!isAuthenticated || !accessToken) {
      return null;
    }

    setAccessTokenOnCookieStore(cookieStore, accessToken);
    return accessToken;
  } catch (error) {
    console.error('[Proxy Upload] Token refresh failed:', error);
    return null;
  }
}

/**
 * Execute upload request to backend
 */
async function executeUploadRequest(
  backendUrl: string,
  formData: FormData,
  authToken: string | undefined
): Promise<Response> {
  const headers: Record<string, string> = {};

  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  return fetch(backendUrl, {
    method: 'POST',
    headers,
    body: formData,
  });
}

type RouteParams = { params: Promise<{ provider: string; path: string[] }> };

/**
 * POST handler for file uploads
 */
export async function POST(request: NextRequest, { params }: RouteParams): Promise<NextResponse> {
  const { provider, path } = await params;

  const backendUrlResult = buildBackendUrl(provider, path, request.nextUrl.searchParams);

  if (!backendUrlResult.success) {
    return NextResponse.json(
      {
        success: false,
        message: backendUrlResult.error,
        data: null,
      },
      { status: backendUrlResult.status }
    );
  }

  const backendUrl = backendUrlResult.url;
  const cookieStore = await cookies();

  // Get current access token
  let authToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;

  try {
    // Get the form data from the request
    const formData = await request.formData();

    // First attempt
    let response = await executeUploadRequest(backendUrl, formData, authToken);

    // If 401, try to refresh token and retry
    if (response.status === 401) {
      const newToken = await tryRefreshToken(cookieStore);

      if (newToken) {
        authToken = newToken;

        // Re-create form data for retry (formData can only be consumed once)
        const retryFormData = await request.formData();
        response = await executeUploadRequest(backendUrl, retryFormData, authToken);
      }
    }

    // Handle empty responses
    if (response.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

    // Get response body
    const data = await response.json();

    return NextResponse.json(data, {
      status: response.status,
      headers: {
        'X-Proxied-From': provider,
      },
    });
  } catch (error) {
    console.error(`[Proxy Upload Error] Provider: ${provider}`, error);

    return NextResponse.json(
      {
        success: false,
        message: 'Gagal mengunggah file',
        data: null,
      },
      { status: 502 }
    );
  }
}
