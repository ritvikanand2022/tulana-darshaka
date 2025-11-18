// User types
export * from './types/user.types';

// Product types
export * from './types/product.types';

// Review types
export * from './types/review.types';

// Comparison types
export * from './types/comparison.types';

// Utility types
export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}
