import { PaginationMeta } from './pagination-meta';

export interface Pagination<T> {
  items: T[];
  meta: PaginationMeta;
}
