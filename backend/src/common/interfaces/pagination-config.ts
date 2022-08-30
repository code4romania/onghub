import { OrderDirection } from '../enums/order-direction.enum';

export interface IPaginationConfig {
  searchableColumns: string[];
  selectColumns: any;
  defaultSortBy: string;
  defaultOrderDirection: OrderDirection;
  relations: any;
  rangeColumn?: string;
}
