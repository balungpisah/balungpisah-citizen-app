import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { ACCESS_TOKEN_COOKIE } from '@/features/auth';
import {
  getAccessTokenFromLogto,
  setAccessTokenOnCookieStore,
} from '@/features/auth/utils/server-token';

/**
 * Known providers and their environment variable names
 */
const PROVIDER_ENV_VARS: Record<string, string> = {
  core: 'SVC_CORE_URL',
};

/**
 * Default API version path for each provider
 */
const PROVIDER_API_PATHS: Record<string, string> = {
  core: '/api',
};

type ProviderUrlResult =
  | { success: true; url: string }
  | { success: false; error: string; status: number };

/**
 * Get the base URL for a provider with detailed error information
 */
function getProviderBaseUrl(provider: string): ProviderUrlResult {
  const envVarName = PROVIDER_ENV_VARS[provider];

  if (!envVarName) {
    return {
      success: false,
      error: `Unknown provider: "${provider}". Available providers: ${Object.keys(PROVIDER_ENV_VARS).join(', ')}`,
      status: 400,
    };
  }

  const baseUrl = process.env[envVarName];

  if (!baseUrl) {
    return {
      success: false,
      error: `Provider "${provider}" is not configured. Missing environment variable: ${envVarName}`,
      status: 503,
    };
  }

  // Validate URL format
  try {
    new URL(baseUrl);
  } catch {
    return {
      success: false,
      error: `Invalid URL for provider "${provider}". Check ${envVarName} value: "${baseUrl}"`,
      status: 503,
    };
  }

  const apiPath = PROVIDER_API_PATHS[provider] || '/api/v1';
  return { success: true, url: `${baseUrl}${apiPath}` };
}

type BackendUrlResult =
  | { success: true; url: string }
  | { success: false; error: string; status: number };

/**
 * Build the backend URL from the proxy path
 */
function buildBackendUrl(
  provider: string,
  path: string[],
  searchParams: URLSearchParams
): BackendUrlResult {
  const baseUrlResult = getProviderBaseUrl(provider);

  if (!baseUrlResult.success) {
    return baseUrlResult;
  }

  const endpoint = path.join('/');
  const url = new URL(`${baseUrlResult.url}/${endpoint}`);

  // Forward all query parameters
  searchParams.forEach((value, key) => {
    url.searchParams.append(key, value);
  });

  return { success: true, url: url.toString() };
}

/**
 * Check if Logto session cookies exist (prefix: logto_)
 */
function hasLogtoSessionCookies(cookieStore: Awaited<ReturnType<typeof cookies>>): boolean {
  const allCookies = cookieStore.getAll();
  return allCookies.some((cookie) => cookie.name.startsWith('logto_'));
}

/**
 * Try to refresh token from Logto and update cookie
 * Returns new token if successful, null otherwise
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

    // Update cookie with new token
    setAccessTokenOnCookieStore(cookieStore, accessToken);

    return accessToken;
  } catch (error) {
    console.error('[Proxy] Token refresh failed:', error);
    return null;
  }
}

/**
 * Execute fetch request to backend
 */
async function executeBackendRequest(
  backendUrl: string,
  method: string,
  headers: Record<string, string>,
  body: string | undefined
): Promise<Response> {
  const fetchOptions: RequestInit = {
    method,
    headers,
  };

  if (body) {
    fetchOptions.body = body;
  }

  return fetch(backendUrl, fetchOptions);
}

/**
 * Forward the request to the backend API with auto-retry on 401
 */
async function proxyRequest(
  request: NextRequest,
  provider: string,
  path: string[],
  method: string
): Promise<NextResponse> {
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

  // Prepare headers
  const buildHeaders = (token: string | undefined): Record<string, string> => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Forward specific headers if present
    const forwardHeaders = ['x-request-id', 'x-correlation-id'];
    forwardHeaders.forEach((header) => {
      const value = request.headers.get(header);
      if (value) {
        headers[header] = value;
      }
    });

    return headers;
  };

  // Get request body for non-GET requests
  let requestBody: string | undefined;
  if (method !== 'GET' && method !== 'HEAD') {
    try {
      const body = await request.json();
      requestBody = JSON.stringify(body);
    } catch {
      // No body or invalid JSON - continue without body
    }
  }

  try {
    // First attempt
    let response = await executeBackendRequest(
      backendUrl,
      method,
      buildHeaders(authToken),
      requestBody
    );

    // If 401, try to refresh token and retry
    if (response.status === 401) {
      const newToken = await tryRefreshToken(cookieStore);

      if (newToken) {
        authToken = newToken;

        // Retry with new token
        response = await executeBackendRequest(
          backendUrl,
          method,
          buildHeaders(authToken),
          requestBody
        );
      }
    }

    // Handle empty responses
    if (response.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

    // Get response body
    const data = await response.json();

    // Return the response with the same status code
    return NextResponse.json(data, {
      status: response.status,
      headers: {
        'X-Proxied-From': provider,
      },
    });
  } catch (error) {
    console.error(`[Proxy Error] Provider: ${provider}`, error);

    // Return a generic error response
    return NextResponse.json(
      {
        success: false,
        message: `Failed to connect to ${provider} service`,
        data: null,
      },
      { status: 502 }
    );
  }
}

type RouteParams = { params: Promise<{ provider: string; path: string[] }> };

/**
 * GET handler
 */
export async function GET(request: NextRequest, { params }: RouteParams): Promise<NextResponse> {
  const { provider, path } = await params;
  return proxyRequest(request, provider, path, 'GET');
}

/**
 * POST handler
 */
export async function POST(request: NextRequest, { params }: RouteParams): Promise<NextResponse> {
  const { provider, path } = await params;
  return proxyRequest(request, provider, path, 'POST');
}

/**
 * PUT handler
 */
export async function PUT(request: NextRequest, { params }: RouteParams): Promise<NextResponse> {
  const { provider, path } = await params;
  return proxyRequest(request, provider, path, 'PUT');
}

/**
 * PATCH handler
 */
export async function PATCH(request: NextRequest, { params }: RouteParams): Promise<NextResponse> {
  const { provider, path } = await params;
  return proxyRequest(request, provider, path, 'PATCH');
}

/**
 * DELETE handler
 */
export async function DELETE(request: NextRequest, { params }: RouteParams): Promise<NextResponse> {
  const { provider, path } = await params;
  return proxyRequest(request, provider, path, 'DELETE');
}
