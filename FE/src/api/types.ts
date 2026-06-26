export interface WebResponse<T> {
  data: T;
  errors?: string;
  paging?: Paging;
}

export interface ApiErrorResponse {
  errors: string;
}

export interface Paging {
  page: number;
  total_item: number;
  total_page: number;
}
