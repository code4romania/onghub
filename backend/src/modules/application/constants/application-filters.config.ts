import { OrderDirection } from 'src/common/enums/order-direction.enum';

export const APPLICATION_FILTERS_CONFIG = {
  selectColumns: {
    id: true,
    name: true,
    status: true,
    type: true,
    steps: true,
    shortDescription: true,
    description: true,
    website: true,
    loginLink: true,
    videoLink: true,
    logo: true,
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
