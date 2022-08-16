import { OrderDirection } from 'src/common/enums/order-direction.enum';

export const USER_FILTERS_CONFIG = {
  selectColumns: ['id', 'name', 'email', 'createdOn', 'phone', 'status'],
  searchableColumns: ['name', 'email'],
  defaultSortBy: 'name',
  defaultOrderDirection: OrderDirection.ASC,
  relations: [],
  rangeColumn: 'createdOn',
};
