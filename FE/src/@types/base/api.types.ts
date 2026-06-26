export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  Success?: string;
  paging?: PageMetadata;
}

export interface ApiErrorResponse {
  message: string;
  statusCode?: number;
  errors?: Record<string, string[]>;
}

export interface PageMetadata {
  page: number;
  size: number;
  total_item: number;
  total_page: number;
}

export interface PaginatedApiResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  meta: PageMetadata;
}

export interface SearchParams {
  page: number;
  size: number;
  title?: string;
}
