import { OrderDirection } from 'src/common/enums/order-direction.enum';

export const ORGANIZATION_FILTERS_CONFIG = {
  selectColumns: {
    id: true,
    status: true,
    createdOn: true,
    updatedOn: true,
    name: true,
    alias: true,
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

export const ORGANIZATION_WITH_PRACTICE_PROGRAM_FILTERS_CONFIG = {
  selectColumns: {
    id: true,
    organizationGeneral: {
      id: true,
      name: true,
      description: true,
      logo: true,
    },
  },
  searchableColumns: ['organizationGeneral.name', 'practicePrograms.title'],
  defaultSortBy: 'id',
  defaultOrderDirection: OrderDirection.ASC,
  relations: {
    organizationGeneral: true,
  },
  rangeColumn: 'createdOn',
};

export const ORGANIZATION_WITH_SERVICES_FILTERS_CONFIG = {
  selectColumns: {
    id: true,
    organizationGeneral: {
      id: true,
      name: true,
      description: true,
      logo: true,
    },
  },
  searchableColumns: ['organizationGeneral.name', 'civicCenterServices.name'],
  defaultSortBy: 'id',
  defaultOrderDirection: OrderDirection.ASC,
  relations: {
    organizationGeneral: true,
  },
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
    organizationId: true,
  },
  searchableColumns: ['organizationName', 'name'],
  defaultSortBy: 'createdOn',
  defaultOrderDirection: OrderDirection.ASC,
  relations: {},
  rangeColumn: 'createdOn',
};
