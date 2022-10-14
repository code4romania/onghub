import { OrderDirection } from 'src/common/enums/order-direction.enum';

export const ORGANIZATION_FILTERS_CONFIG = {
  selectColumns: {
    id: true,
    status: true,
    createdOn: true,
    updatedOn: true,
    name: true,
    userCount: true,
    completionStatus: true,
    logo: true,
  },
  searchableColumns: ['name'],
  defaultSortBy: 'id',
  defaultOrderDirection: OrderDirection.ASC,
  relations: {},
  rangeColumn: 'createdOn',
};

export const ORGANIZATION_REQUEST_FILTER_CONFIG = {
  selectColumns: {
    id: true,
    organizationName: true,
    email: true,
    phone: true,
    name: true,
    createdOn: true,
    status: true,
  },
  searchableColumns: ['organizationName', 'name'],
  defaultSortBy: 'createdOn',
  defaultOrderDirection: OrderDirection.ASC,
  relations: {},
  rangeColumn: 'createdOn',
};
