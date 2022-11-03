import { OrderDirection } from 'src/common/enums/order-direction.enum';

export const CIVIC_SERVICE_FILTERS_CONFIG = {
  selectColumns: {
    id: true,
    location: {
      id: true,
      name: true,
    },
    name: true,
    shortDescription: true,
    startDate: true,
    endDate: true,
    hasOnlineAccess: true,
    hasEmailPhoneAccess: true,
    hasPhysicalAccess: true,
  },
  searchableColumns: [
    'name',
    'shortDescription',
    'longDescription',
    'organization.organizationGeneral.name',
    'organization.organizationGeneral.description',
  ],
  defaultSortBy: 'startDate',
  defaultOrderDirection: OrderDirection.ASC,
  rangeColumn: ['startDate', 'endDate'] as [string, string],
  relations: {
    location: true,
  },
};
