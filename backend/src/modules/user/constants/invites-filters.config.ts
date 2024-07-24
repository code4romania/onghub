import { OrderDirection } from 'src/common/enums/order-direction.enum';

export const INVITE_FILTERS_CONFIG = {
  selectColumns: {
    id: true,
    name: true,
    email: true,
    phone: true,
    createdOn: true,
    role: true,
    organization: {
      id: true,
      organizationGeneral: {
        alias: true,
      },
    },
  },
  searchableColumns: ['name'],
  defaultSortBy: 'name',
  defaultOrderDirection: OrderDirection.ASC,
  relations: {
    organization: {
      organizationGeneral: true,
    },
  },
  rangeColumn: 'createdOn',
};
