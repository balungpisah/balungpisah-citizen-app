import { ApiClientError, type ApiResponse } from './types';
import { DEFAULT_PROVIDER } from './providers';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface RequestOptions {
  method?: HttpMethod;
  body?: unknown;
  headers?: Record<string, string>;
  signal?: AbortSignal;
  /** Data provider to use (defaults to 'core') */
  provider?: string;
}

/**
 * Build full URL for API proxy requests
 */
function buildUrl(
  path: string,
  params?: Record<string, string | number | boolean | undefined>,
  provider: string = DEFAULT_PROVIDER
): string {
  // Remove leading slash if present to avoid double slashes
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  const url = new URL(`/api/proxy/${provider}/${cleanPath}`, window.location.origin);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.append(key, String(value));
      }
    });
  }

  return url.toString();
}

/**
 * Parse error response from API
 */
async function parseErrorResponse(response: Response): Promise<ApiClientError> {
  try {
    const data = await response.json();
    return new ApiClientError(
      data.message || `Request failed with status ${response.status}`,
      response.status,
      data.errors
    );
  } catch {
    return new ApiClientError(`Request failed with status ${response.status}`, response.status);
  }
}

/**
 * Make a fetch request to the API proxy
 */
async function request<T>(
  path: string,
  options: RequestOptions = {},
  params?: Record<string, string | number | boolean | undefined>
): Promise<T> {
  const { method = 'GET', body, headers = {}, signal, provider = DEFAULT_PROVIDER } = options;

  const url = buildUrl(path, params, provider);

  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...headers,
  };

  const fetchOptions: RequestInit = {
    method,
    headers: requestHeaders,
    signal,
  };

  if (body && method !== 'GET') {
    fetchOptions.body = JSON.stringify(body);
  }

  const response = await fetch(url, fetchOptions);

  if (!response.ok) {
    throw await parseErrorResponse(response);
  }

  // Handle empty responses (204 No Content)
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

/**
 * API Client - thin wrapper for fetch that calls the BFF proxy
 *
 * All requests go through /api/proxy/[provider]/* which handles auth and forwards to backend
 */
export const apiClient = {
  /**
   * GET request
   */
  get<T>(
    path: string,
    params?: Record<string, string | number | boolean | undefined>,
    options?: Omit<RequestOptions, 'method' | 'body'>
  ): Promise<ApiResponse<T>> {
    return request<ApiResponse<T>>(path, { ...options, method: 'GET' }, params);
  },

  /**
   * POST request
   */
  post<T>(
    path: string,
    body?: unknown,
    options?: Omit<RequestOptions, 'method'>
  ): Promise<ApiResponse<T>> {
    return request<ApiResponse<T>>(path, { ...options, method: 'POST', body });
  },

  /**
   * PUT request
   */
  put<T>(
    path: string,
    body?: unknown,
    options?: Omit<RequestOptions, 'method'>
  ): Promise<ApiResponse<T>> {
    return request<ApiResponse<T>>(path, { ...options, method: 'PUT', body });
  },

  /**
   * PATCH request
   */
  patch<T>(
    path: string,
    body?: unknown,
    options?: Omit<RequestOptions, 'method'>
  ): Promise<ApiResponse<T>> {
    return request<ApiResponse<T>>(path, { ...options, method: 'PATCH', body });
  },

  /**
   * DELETE request
   */
  delete<T>(
    path: string,
    options?: Omit<RequestOptions, 'method' | 'body'>
  ): Promise<ApiResponse<T>> {
    return request<ApiResponse<T>>(path, { ...options, method: 'DELETE' });
  },

  /**
   * Raw request for custom response types (e.g., list responses with meta)
   */
  raw<T>(
    path: string,
    options: RequestOptions = {},
    params?: Record<string, string | number | boolean | undefined>
  ): Promise<T> {
    return request<T>(path, options, params);
  },
};
