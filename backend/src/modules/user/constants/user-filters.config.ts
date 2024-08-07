import { OrderDirection } from 'src/common/enums/order-direction.enum';

export const USER_APPLICATIONS_FILTERS_CONFIG = {
  selectColumns: {
    id: true,
    name: true,
    email: true,
    createdOn: true,
    phone: true,
    status: true,
    availableApps: true,
    availableAppsIDs: true,
    organizationId: true,
    organizationAlias: true,
  },
  searchableColumns: ['name', 'email'],
  defaultSortBy: 'name',
  defaultOrderDirection: OrderDirection.ASC,
  relations: {},
  rangeColumn: 'createdOn',
};
