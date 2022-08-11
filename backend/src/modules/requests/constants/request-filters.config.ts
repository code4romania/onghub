import { OrderDirection } from 'src/common/enums/order-direction.enum';

export const REQUEST_FILTER_CONFIG = {
  selectColumns: [
    'name',
    'email',
    'phone',
    'status',
    'organization',
    'createdOn',
  ],
  searchableColumns: ['name'],
  defaultSortBy: 'createdOn',
  defaultOrderDirection: OrderDirection.ASC,
  relations: ['organization'],
  rangeColumn: 'createdOn',
};
