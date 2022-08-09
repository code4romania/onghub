interface PaginationMeta {
  currentPage: number;
  itemCount: number;
  itermsPerPage: number;
  totalItems: number;
  totalPages: number;
}

export interface PaginatedEntity<T> {
  items: T[];
  meta: PaginationMeta;
}
