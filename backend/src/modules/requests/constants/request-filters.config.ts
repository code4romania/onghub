import { OrderDirection } from 'src/common/enums/order-direction.enum';

export const REQUEST_FILTER_CONFIG = {
  selectColumns: {
    id: true,
    organization: {
      id: true,
      organizationGeneral: {
        name: true,
      },
    },
    user: { email: true, phone: true, name: true },
    createdOn: true,
    status: true,
  },
  searchableColumns: [
    'organization.organizationGeneral.name',
    'user.email',
    'user.name',
  ],
  defaultSortBy: 'createdOn',
  defaultOrderDirection: OrderDirection.ASC,
  relations: {
    organization: {
      organizationGeneral: true,
    },
    user: true,
  },
  rangeColumn: 'createdOn',
};

export const REQUEST_APP_ACCESS_FILTER_CONFIG = {
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
  searchableColumns: [],
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
