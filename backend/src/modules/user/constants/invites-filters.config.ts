import { OrderDirection } from 'src/common/enums/order-direction.enum';

export const INVITE_FILTERS_CONFIG = {
  selectColumns: {
    id: true,
    name: true,
    email: true,
    phone: true,
    createdOn: true,
  },
  searchableColumns: ['name', 'email'],
  defaultSortBy: 'name',
  defaultOrderDirection: OrderDirection.ASC,
  relations: {},
  rangeColumn: 'createdOn',
};
