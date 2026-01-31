import type { ApiListResponse, ApiResponse } from '../types';
import type { DataProvider } from './types';

/**
 * Raw response format from core service for list endpoints
 */
interface CoreListResponse<T> {
  success: boolean;
  data: T[];
  meta: {
    total: number;
  };
  message: string | null;
}

/**
 * Raw response format from core service for single item endpoints
 */
interface CoreOneResponse<T> {
  success: boolean;
  data: T;
  message: string | null;
}

/**
 * Core service provider configuration
 *
 * - Uses page-based pagination (page, page_size)
 * - Standard response format
 */
export const coreProvider: DataProvider = {
  name: 'core',
  pagination: 'page-based',

  transformPagination: ({ page, pageSize }) => ({
    page: page ?? 1,
    page_size: pageSize ?? 10,
  }),

  transformSort: ({ field, order }) => ({
    sort_by: field,
    sort_order: order,
  }),

  transformListResponse: <T>(response: unknown): ApiListResponse<T> => {
    const raw = response as CoreListResponse<T>;

    return {
      success: raw.success,
      data: raw.data,
      meta: {
        total: raw.meta.total,
      },
      message: raw.message,
    };
  },

  transformOneResponse: <T>(response: unknown): ApiResponse<T> => {
    const raw = response as CoreOneResponse<T>;

    return {
      success: raw.success,
      data: raw.data,
      message: raw.message,
    };
  },
};
