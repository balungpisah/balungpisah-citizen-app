'use client';

import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { getProvider, DEFAULT_PROVIDER } from '@/lib/api/providers';
import type {
  ApiListResponse,
  ApiClientError,
  PaginationParams,
  SortParams,
  FilterParams,
  PaginationMeta,
} from '@/lib/api/types';

export interface UseListOptions<T> {
  /** Resource name (e.g., 'users', 'posts') */
  resource: string;
  /** Data provider to use (defaults to 'core') */
  dataProvider?: string;
  /** Pagination parameters */
  pagination?: PaginationParams;
  /** Filter parameters */
  filters?: FilterParams;
  /** Sort parameters */
  sort?: SortParams;
  /** Enable/disable the query */
  enabled?: boolean;
  /** Additional query options */
  queryOptions?: Omit<
    UseQueryOptions<ApiListResponse<T>, ApiClientError>,
    'queryKey' | 'queryFn' | 'enabled'
  >;
}

export interface UseListResult<T> {
  /** The fetched data array */
  data: T[];
  /** Total number of items (for pagination) */
  total: number;
  /** Full pagination metadata */
  meta: PaginationMeta | undefined;
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
 * Build query parameters for list requests using provider transformers
 */
function buildQueryParams(
  providerName: string,
  pagination?: PaginationParams,
  filters?: FilterParams,
  sort?: SortParams
): Record<string, string | number | boolean | undefined> {
  const provider = getProvider(providerName);
  const params: Record<string, string | number | boolean | undefined> = {};

  // Transform pagination using provider-specific logic
  if (pagination) {
    const transformedPagination = provider.transformPagination(pagination);
    Object.entries(transformedPagination).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params[key] = value as string | number | boolean;
      }
    });
  }

  // Filters - pass through as-is
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params[key] = value;
      }
    });
  }

  // Transform sort using provider-specific logic
  if (sort) {
    const transformedSort = provider.transformSort(sort);
    Object.entries(transformedSort).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params[key] = value as string | number | boolean;
      }
    });
  }

  return params;
}

/**
 * Build a stable query key for list requests
 * Includes provider for cache isolation between different backends
 */
function buildQueryKey(
  resource: string,
  providerName: string,
  pagination?: PaginationParams,
  filters?: FilterParams,
  sort?: SortParams
): unknown[] {
  return [
    providerName,
    resource,
    'list',
    {
      pagination: pagination || {},
      filters: filters || {},
      sort: sort || {},
    },
  ];
}

/**
 * Hook for fetching a collection of resources with pagination, filtering, and sorting
 *
 * @example
 * ```tsx
 * // Default provider (core)
 * const { data, total, isLoading } = useList<User>({
 *   resource: 'users',
 *   pagination: { page: 1, pageSize: 10 },
 *   filters: { status: 'active' },
 *   sort: { field: 'createdAt', order: 'desc' },
 * });
 *   pagination: { page: 2, pageSize: 20 },
 * });
 * ```
 */
export function useList<T>(options: UseListOptions<T>): UseListResult<T> {
  const {
    resource,
    dataProvider = DEFAULT_PROVIDER,
    pagination,
    filters,
    sort,
    enabled = true,
    queryOptions,
  } = options;

  const provider = getProvider(dataProvider);
  const queryKey = buildQueryKey(resource, dataProvider, pagination, filters, sort);
  const queryParams = buildQueryParams(dataProvider, pagination, filters, sort);

  const query = useQuery<ApiListResponse<T>, ApiClientError>({
    queryKey,
    queryFn: async () => {
      const rawResponse = await apiClient.raw<unknown>(
        resource,
        { method: 'GET', provider: dataProvider },
        queryParams
      );
      // Transform response using provider-specific logic
      return provider.transformListResponse<T>(rawResponse);
    },
    enabled,
    ...queryOptions,
  });

  return {
    data: query.data?.data ?? [],
    total: query.data?.meta?.total ?? 0,
    meta: query.data?.meta,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
    isError: query.isError,
    isSuccess: query.isSuccess,
    refetch: query.refetch,
  };
}
