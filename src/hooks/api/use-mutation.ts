'use client';

import {
  useMutation as useReactMutation,
  useQueryClient,
  type UseMutationOptions as TanStackMutationOptions,
} from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { getProvider, DEFAULT_PROVIDER } from '@/lib/api/providers';
import type { ApiResponse, ApiClientError } from '@/lib/api/types';

type HttpMethod = 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface MutationOptions<TData, TVariables> {
  /** Resource name (e.g., 'users', 'posts') */
  resource: string;
  /** Resource ID (for PUT, PATCH, DELETE operations) */
  id?: string | number;
  /** Data provider to use (defaults to 'core') */
  dataProvider?: string;
  /** HTTP method (default: POST) */
  method?: HttpMethod;
  /** Query keys to invalidate on success */
  invalidateKeys?: unknown[][];
  /** Callback on success */
  onSuccess?: (data: TData, variables: TVariables) => void;
  /** Callback on error */
  onError?: (error: ApiClientError, variables: TVariables) => void;
  /** Callback on settle (success or error) */
  onSettled?: (
    data: TData | undefined,
    error: ApiClientError | null,
    variables: TVariables
  ) => void;
  /** Additional mutation options */
  mutationOptions?: Omit<
    TanStackMutationOptions<ApiResponse<TData>, ApiClientError, TVariables>,
    'mutationFn' | 'onSuccess' | 'onError' | 'onSettled'
  >;
}

export interface MutationResult<TData, TVariables> {
  /** Function to trigger the mutation */
  mutate: (variables: TVariables) => void;
  /** Async function to trigger the mutation */
  mutateAsync: (variables: TVariables) => Promise<ApiResponse<TData>>;
  /** Whether the mutation is in progress */
  isPending: boolean;
  /** Whether the mutation was successful */
  isSuccess: boolean;
  /** Whether the mutation errored */
  isError: boolean;
  /** Error object if the mutation failed */
  error: ApiClientError | null;
  /** The response data */
  data: TData | undefined;
  /** Reset the mutation state */
  reset: () => void;
}

/**
 * Build the endpoint path
 */
function buildEndpoint(resource: string, id?: string | number): string {
  if (id !== undefined) {
    return `${resource}/${id}`;
  }
  return resource;
}

/**
 * Hook for mutating resources (POST, PUT, PATCH, DELETE)
 *
 * @example
 * ```tsx
 * // Create (POST) - default provider
 * const { mutate, isPending } = useMutation<User, CreateUserInput>({
 *   resource: 'users',
 * });
 * mutate({ name: 'John', email: 'john@example.com' });
 *
 * // Partial update (PATCH)
 * const { mutate } = useMutation<User, Partial<User>>({
 *   resource: 'users',
 *   id: '123',
 *   method: 'PATCH',
 * });
 *
 * // Delete
 * const { mutate } = useMutation<void, void>({
 *   resource: 'users',
 *   id: '123',
 *   method: 'DELETE',
 * });
 * ```
 */
export function useMutation<TData = unknown, TVariables = unknown>(
  options: MutationOptions<TData, TVariables>
): MutationResult<TData, TVariables> {
  const {
    resource,
    id,
    dataProvider = DEFAULT_PROVIDER,
    method = 'POST',
    invalidateKeys,
    onSuccess,
    onError,
    onSettled,
    mutationOptions,
  } = options;

  const queryClient = useQueryClient();
  const provider = getProvider(dataProvider);
  const endpoint = buildEndpoint(resource, id);

  const mutation = useReactMutation<ApiResponse<TData>, ApiClientError, TVariables>({
    mutationFn: async (variables: TVariables) => {
      let rawResponse: unknown;

      switch (method) {
        case 'POST':
          rawResponse = await apiClient.raw<unknown>(endpoint, {
            method: 'POST',
            body: variables,
            provider: dataProvider,
          });
          break;
        case 'PUT':
          rawResponse = await apiClient.raw<unknown>(endpoint, {
            method: 'PUT',
            body: variables,
            provider: dataProvider,
          });
          break;
        case 'PATCH':
          rawResponse = await apiClient.raw<unknown>(endpoint, {
            method: 'PATCH',
            body: variables,
            provider: dataProvider,
          });
          break;
        case 'DELETE':
          rawResponse = await apiClient.raw<unknown>(endpoint, {
            method: 'DELETE',
            provider: dataProvider,
          });
          break;
        default:
          throw new Error(`Unsupported method: ${method}`);
      }

      // Transform response using provider-specific logic
      return provider.transformOneResponse<TData>(rawResponse);
    },
    onSuccess: (response, variables) => {
      // Invalidate related queries
      if (invalidateKeys) {
        invalidateKeys.forEach((key) => {
          queryClient.invalidateQueries({ queryKey: key });
        });
      } else {
        // Default: invalidate the resource list for this provider
        queryClient.invalidateQueries({ queryKey: [dataProvider, resource] });
      }

      onSuccess?.(response.data, variables);
    },
    onError: (error, variables) => {
      onError?.(error, variables);
    },
    onSettled: (response, error, variables) => {
      onSettled?.(response?.data, error, variables);
    },
    ...mutationOptions,
  });

  return {
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
    data: mutation.data?.data,
    reset: mutation.reset,
  };
}
