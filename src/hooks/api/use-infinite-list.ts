'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { getProvider, DEFAULT_PROVIDER } from '@/lib/api/providers';
import type { ApiListResponse, ApiClientError, FilterParams, SortParams } from '@/lib/api/types';

export interface UseInfiniteListOptions {
  resource: string;
  dataProvider?: string;
  pageSize?: number;
  filters?: FilterParams;
  sort?: SortParams;
  enabled?: boolean;
}

export function useInfiniteList<T>(options: UseInfiniteListOptions) {
  const {
    resource,
    dataProvider = DEFAULT_PROVIDER,
    pageSize = 10,
    filters,
    sort,
    enabled = true,
  } = options;

  const provider = getProvider(dataProvider);

  const query = useInfiniteQuery<ApiListResponse<T>, ApiClientError>({
    queryKey: [dataProvider, resource, 'infinite', { pageSize, filters, sort }],
    queryFn: async ({ pageParam }) => {
      const params: Record<string, string | number | boolean | undefined> = {};

      const transformedPagination = provider.transformPagination({
        page: pageParam as number,
        pageSize,
      });
      Object.entries(transformedPagination).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params[key] = value as string | number | boolean;
        }
      });

      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            params[key] = value;
          }
        });
      }

      if (sort) {
        const transformedSort = provider.transformSort(sort);
        Object.entries(transformedSort).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params[key] = value as string | number | boolean;
          }
        });
      }

      const rawResponse = await apiClient.raw<unknown>(
        resource,
        { method: 'GET', provider: dataProvider },
        params
      );
      return provider.transformListResponse<T>(rawResponse);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const fetched = allPages.length * pageSize;
      return fetched < (lastPage.meta?.total ?? 0) ? allPages.length + 1 : undefined;
    },
    enabled,
  });

  const data = query.data?.pages.flatMap((page) => page.data) ?? [];
  const total = query.data?.pages[0]?.meta?.total ?? 0;

  return {
    data,
    total,
    isLoading: query.isLoading,
    isFetchingNextPage: query.isFetchingNextPage,
    hasNextPage: query.hasNextPage,
    fetchNextPage: query.fetchNextPage,
    error: query.error,
    isError: query.isError,
  };
}
