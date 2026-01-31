import type { ApiListResponse, ApiResponse, PaginationParams, SortParams } from '../types';

/**
 * Supported pagination types for data providers
 */
export type PaginationType = 'page-based' | 'offset-based';

/**
 * Data provider interface - defines how to communicate with a specific backend service
 *
 * When adding a new provider, you MUST implement all transform methods:
 * - transformPagination: Convert standard pagination to provider format
 * - transformSort: Convert standard sort params to provider format
 * - transformListResponse: Convert provider list response to standard format
 * - transformOneResponse: Convert provider single item response to standard format
 */
export interface DataProvider {
  /** Provider identifier */
  name: string;

  /** Pagination strategy used by this provider */
  pagination: PaginationType;

  /**
   * Transform standard pagination params to provider-specific format
   * @param params - Standard pagination params (page, pageSize)
   * @returns Provider-specific query parameters
   */
  transformPagination: (params: PaginationParams) => Record<string, unknown>;

  /**
   * Transform standard sort params to provider-specific format
   * @param params - Standard sort params (field, order)
   * @returns Provider-specific query parameters
   */
  transformSort: (params: SortParams) => Record<string, unknown>;

  /**
   * Transform provider-specific list response to standard format
   * @param response - Raw response from the provider
   * @returns Standardized list response
   */
  transformListResponse: <T>(response: unknown) => ApiListResponse<T>;

  /**
   * Transform provider-specific single item response to standard format
   * @param response - Raw response from the provider
   * @returns Standardized single item response
   */
  transformOneResponse: <T>(response: unknown) => ApiResponse<T>;
}

/**
 * Provider registry type - maps provider names to their configurations
 */
export type ProviderRegistry = Record<string, DataProvider>;

/**
 * Default provider name
 */
export const DEFAULT_PROVIDER = 'core';
