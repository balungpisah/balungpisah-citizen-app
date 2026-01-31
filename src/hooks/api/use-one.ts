'use client';

import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { getProvider, DEFAULT_PROVIDER } from '@/lib/api/providers';
import type { ApiResponse, ApiClientError } from '@/lib/api/types';

export interface UseOneOptions<T> {
  /** Resource path (e.g., 'users/123', 'test/uuid/thread', 'settings') */
  resource: string;
  /** Data provider to use (defaults to 'core') */
  dataProvider?: string;
  /** Enable/disable the query */
  enabled?: boolean;
  /** Additional query options */
  queryOptions?: Omit<
    UseQueryOptions<ApiResponse<T>, ApiClientError, T>,
    'queryKey' | 'queryFn' | 'enabled' | 'select'
  >;
}

export interface UseOneResult<T> {
  /** The fetched data */
  data: T | undefined;
  /** Loading state */
  isLoading: boolean;
  /** Fetching state (includes background refetches) */
  isFetching: boolean;
  /** Error object if the request failed */
  error: ApiClientError | null;
  /** Whether the query has errored */
  isError: boolean;
  /** Whether the query was successful */
  isSuccess: boolean;
  /** Function to manually refetch the data */
  refetch: () => void;
}

/**
 * Hook for fetching a single resource (non-paginated response)
 *
 * Use this for any endpoint that returns a single object response.
 * For paginated array responses, use `useList` instead.
 *
 * @example
 * ```tsx
 * // Fetch by ID
 * const { data } = useOne<User>({
 *   resource: 'users/123',
 * });
 *
 * // Fetch nested resource
 * const { data } = useOne<Thread>({
 *   resource: 'test/uuid/thread',
 * });
 *
 * // Fetch singleton resource
 * const { data } = useOne<Settings>({
 *   resource: 'settings',
 * });
 * ```
 */
export function useOne<T>(options: UseOneOptions<T>): UseOneResult<T> {
  const { resource, dataProvider = DEFAULT_PROVIDER, enabled = true, queryOptions } = options;

  const provider = getProvider(dataProvider);

  const query = useQuery<ApiResponse<T>, ApiClientError, T>({
    // Include provider in query key for cache isolation
    queryKey: [dataProvider, resource, 'one'],
    queryFn: async () => {
      const rawResponse = await apiClient.raw<unknown>(resource, {
        method: 'GET',
        provider: dataProvider,
      });
      // Transform response using provider-specific logic
      return provider.transformOneResponse<T>(rawResponse);
    },
    enabled,
    select: (response) => response.data,
    ...queryOptions,
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
    isError: query.isError,
    isSuccess: query.isSuccess,
    refetch: query.refetch,
  };
}
