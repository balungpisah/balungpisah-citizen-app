import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
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
    console.error('[Stream Proxy] Token refresh failed:', error);
    return null;
  }
}

/**
 * Create an error response
 */
function createErrorResponse(message: string, status: number): Response {
  return new Response(JSON.stringify({ success: false, message, data: null }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

/**
 * Build headers for backend request
 */
function buildHeaders(request: NextRequest, token: string | undefined): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'text/event-stream',
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
}

/**
 * Execute stream request to backend
 */
async function executeStreamRequest(
  backendUrl: string,
  headers: Record<string, string>,
  body: string | undefined
): Promise<Response> {
  return fetch(backendUrl, {
    method: 'POST',
    headers,
    body,
  });
}

/**
 * Process stream response and return to client
 */
function createStreamResponse(response: Response, provider: string): Response {
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  const encoder = new TextEncoder();

  const reader = response.body?.getReader();
  if (!reader) {
    return createErrorResponse('Backend response is not readable', 502);
  }

  // Process the stream in the background
  (async () => {
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
        await writer.write(value);
      }
    } catch (error) {
      // Write an error event to the stream
      const errorEvent = `event: error\ndata: ${JSON.stringify({
        code: 'STREAM_ERROR',
        message: error instanceof Error ? error.message : 'Stream processing error',
      })}\n\n`;
      await writer.write(encoder.encode(errorEvent));
    } finally {
      await writer.close();
    }
  })();

  return new Response(readable, {
    status: 200,
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
      'X-Proxied-From': provider,
    },
  });
}

type RouteParams = { params: Promise<{ provider: string; path: string[] }> };

/**
 * POST handler for SSE streaming with auto-retry on 401
 * Proxies the request to the backend and streams the response back
 */
export async function POST(request: NextRequest, { params }: RouteParams): Promise<Response> {
  const { provider, path } = await params;
  const backendUrlResult = buildBackendUrl(provider, path, request.nextUrl.searchParams);

  if (!backendUrlResult.success) {
    return createErrorResponse(backendUrlResult.error, backendUrlResult.status);
  }

  const backendUrl = backendUrlResult.url;
  const cookieStore = await cookies();

  // Get current access token
  let authToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;

  // Get request body
  let body: string | undefined;
  try {
    const bodyJson = await request.json();
    body = JSON.stringify(bodyJson);
  } catch {
    // No body or invalid JSON
  }

  try {
    // First attempt
    let response = await executeStreamRequest(backendUrl, buildHeaders(request, authToken), body);

    // If 401, try to refresh token and retry
    if (response.status === 401) {
      const newToken = await tryRefreshToken(cookieStore);

      if (newToken) {
        authToken = newToken;

        // Retry with new token
        response = await executeStreamRequest(backendUrl, buildHeaders(request, authToken), body);
      }
    }

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `Backend request failed with status ${response.status}`;
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.message || errorMessage;
      } catch {
        // Use default error message
      }
      return createErrorResponse(errorMessage, response.status);
    }

    // Check if the response is actually a stream
    const contentType = response.headers.get('content-type');
    if (!contentType?.includes('text/event-stream')) {
      // Return as regular JSON response
      const data = await response.json();
      return new Response(JSON.stringify(data), {
        status: response.status,
        headers: {
          'Content-Type': 'application/json',
          'X-Proxied-From': provider,
        },
      });
    }

    // Return stream response
    return createStreamResponse(response, provider);
  } catch (error) {
    console.error(`[Stream Proxy Error] Provider: ${provider}`, error);
    return createErrorResponse(`Failed to connect to ${provider} service`, 502);
  }
}
