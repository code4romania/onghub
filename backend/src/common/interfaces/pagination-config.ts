import { OrderDirection } from '../enums/order-direction.enum';

export enum FilterOperator {
  EQ = '$eq',
  GT = '$gt',
  GTE = '$gte',
  IN = '$in',
  NULL = '$null',
  LT = '$lt',
  LTE = '$lte',
  BTW = '$btw',
  NOT = '$not',
}

export interface IPaginationConfig {
  searchableColumns: string[];
  selectColumns: any;
  defaultSortBy: string;
  defaultOrderDirection: OrderDirection;
  relations: any;
  rangeColumn?: string;
}
