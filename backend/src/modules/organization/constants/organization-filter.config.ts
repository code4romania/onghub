import { OrderDirection } from 'src/common/enums/order-direction.enum';

export const ORGANIZATION_FILTERS_CONFIG = {
  selectColumns: [
    'id',
    'status',
    'createdOn',
    'updatedOn',
    'name',
    'userCount',
    'completionStatusCount',
  ],
  searchableColumns: ['name'],
  defaultSortBy: 'id',
  defaultOrderDirection: OrderDirection.ASC,
  relations: [],
  rangeColumn: 'createdOn',
};
