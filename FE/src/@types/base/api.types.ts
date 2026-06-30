export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  success?: boolean;
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
  name?: string;
  category?: string[];
  sort?: string;
}
