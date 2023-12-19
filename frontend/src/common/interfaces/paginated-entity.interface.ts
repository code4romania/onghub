import { OrderDirection } from '../enums/sort-direction.enum';

interface PaginationMeta {
  currentPage: number;
  itemCount: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
  orderByColumn: string;
  orderDirection: OrderDirection;
}

export interface PaginatedEntity<T> {
  items: T[];
  meta: PaginationMeta;
}
