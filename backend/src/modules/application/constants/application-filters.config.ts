import { OrderDirection } from 'src/common/enums/order-direction.enum';

export const APPLICATION_FILTERS_CONFIG = {
  selectColumns: {
    id: true,
    name: true,
    status: true,
    type: true,
    logo: true,
    organizationCount: true,
    userCount: true,
  },
  searchableColumns: ['name'],
  defaultSortBy: 'name',
  defaultOrderDirection: OrderDirection.ASC,
  relations: {},
};

export const APPLICATION_REQUEST_FILTERS_CONFIG = {
  selectColumns: {
    id: true,
    application: {
      id: true,
      name: true,
    },
    organization: {
      id: true,
      organizationGeneral: {
        name: true,
      },
    },
    status: true,
    createdOn: true,
  },
  searchableColumns: ['application.name'],
  defaultSortBy: 'createdOn',
  defaultOrderDirection: OrderDirection.ASC,
  relations: {
    organization: {
      organizationGeneral: true,
    },
    application: true,
  },
  rangeColumn: 'createdOn',
};

export const APPLICATION_ONG_FILTERS_CONFIG = {
  selectColumns: {
    organizationId: true,
    name: true,
    logo: true,
    userCount: true,
    createdOn: true,
    status: true,
  },
  searchableColumns: ['name'],
  defaultSortBy: 'name',
  defaultOrderDirection: OrderDirection.ASC,
  relations: {},
};
