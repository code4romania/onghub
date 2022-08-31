import { OrderDirection } from 'src/common/enums/order-direction.enum';

export const ORGANIZATION_FILTERS_CONFIG = {
  selectColumns: {
    id: true,
    status: true,
    createdOn: true,
    updatedOn: true,
    name: true,
    userCount: true,
    completionStatusCount: true,
  },
  searchableColumns: ['name'],
  defaultSortBy: 'id',
  defaultOrderDirection: OrderDirection.ASC,
  relations: {},
  rangeColumn: 'createdOn',
};
