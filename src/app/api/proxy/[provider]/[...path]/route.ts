import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const AUTH_COOKIE_NAME = process.env.AUTH_COOKIE_NAME || 'auth_token';

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
 * Get authorization headers from cookies
 */
async function getAuthHeaders(): Promise<Record<string, string>> {
  const cookieStore = await cookies();
  const authToken = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (authToken) {
    return { Authorization: `Bearer ${authToken}` };
  }

  return {};
}

/**
 * Forward the request to the backend API
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

  const authHeaders = await getAuthHeaders();

  // Prepare headers - forward relevant headers from the original request
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...authHeaders,
  };

  // Forward specific headers if present
  const forwardHeaders = ['x-request-id', 'x-correlation-id'];
  forwardHeaders.forEach((header) => {
    const value = request.headers.get(header);
    if (value) {
      headers[header] = value;
    }
  });

  // Prepare fetch options
  const fetchOptions: RequestInit = {
    method,
    headers,
  };

  // Add body for non-GET requests
  if (method !== 'GET' && method !== 'HEAD') {
    try {
      const body = await request.json();
      fetchOptions.body = JSON.stringify(body);
    } catch {
      // No body or invalid JSON - continue without body
    }
  }

  try {
    const response = await fetch(backendUrl, fetchOptions);

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
