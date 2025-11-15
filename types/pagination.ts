export interface PaginatedResponse<T> {
  items: T[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
}

export interface ApiResponse<T> {
  timestamp: string;
  status: number;
  message: string;
  data: T;
}