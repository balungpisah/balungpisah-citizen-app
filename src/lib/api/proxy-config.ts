/**
 * API Proxy Configuration
 *
 * Shared configuration for backend service providers used by proxy routes.
 * This is server-side only - used by /api/proxy/* routes.
 */

/**
 * Known providers and their environment variable names
 */
export const PROVIDER_ENV_VARS: Record<string, string> = {
  core: 'SVC_CORE_URL',
};

/**
 * Default API version path for each provider
 */
export const PROVIDER_API_PATHS: Record<string, string> = {
  core: '/api',
};

export type ProviderUrlResult =
  | { success: true; url: string }
  | { success: false; error: string; status: number };

/**
 * Get the base URL for a provider with detailed error information
 */
export function getProviderBaseUrl(provider: string): ProviderUrlResult {
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
    console.error(`[Proxy] Missing environment variable: ${envVarName} for provider: ${provider}`);
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

/**
 * Build the backend URL from the proxy path
 */
export function buildBackendUrl(
  provider: string,
  path: string[],
  searchParams?: URLSearchParams
): ProviderUrlResult {
  const baseUrlResult = getProviderBaseUrl(provider);

  if (!baseUrlResult.success) {
    return baseUrlResult;
  }

  const endpoint = path.join('/');
  const url = new URL(`${baseUrlResult.url}/${endpoint}`);

  // Forward all query parameters
  if (searchParams) {
    searchParams.forEach((value, key) => {
      url.searchParams.append(key, value);
    });
  }

  return { success: true, url: url.toString() };
}
