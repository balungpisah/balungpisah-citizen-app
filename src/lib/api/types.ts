/**
 * Standard API response wrapper format
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string | null;
}

/**
 * API list response with pagination metadata
 */
export interface ApiListResponse<T> {
  success: boolean;
  data: T[];
  meta: PaginationMeta;
  message: string | null;
}

/**
 * Pagination metadata returned by the API
 */
export interface PaginationMeta {
  total: number;
}

/**
 * Pagination parameters for list requests
 */
export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

/**
 * Sort parameters for list requests
 */
export interface SortParams {
  field: string;
  order: 'asc' | 'desc';
}

/**
 * Generic filter object
 */
export type FilterParams = Record<string, string | number | boolean | undefined>;

/**
 * API error response
 */
export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

/**
 * Custom error class for API errors
 */
export class ApiClientError extends Error {
  public status: number;
  public errors?: Record<string, string[]>;

  constructor(message: string, status: number, errors?: Record<string, string[]>) {
    super(message);
    this.name = 'ApiClientError';
    this.status = status;
    this.errors = errors;
  }
}
