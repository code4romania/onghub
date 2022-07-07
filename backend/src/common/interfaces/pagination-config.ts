import { OrderDirection } from '../enums/order-direction.enum';

export interface IPaginationConfig {
  searchableColumns: string[];
  selectColumns: string[];
  defaultSortBy: string;
  defaultOrderDirection: OrderDirection;
  relations: string[];
  rangeColumn?: string;
}
