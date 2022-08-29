import { OrderDirection } from 'src/common/enums/order-direction.enum';

export const REQUEST_FILTER_CONFIG = {
  selectColumns: [
    'id',
    'organization.organizationGeneral.name',
    // 'user.email',
    // 'user.phone',
    'status',
    'organization',
    'createdOn',
  ],
  searchableColumns: ['organization.organizationGeneral.name'],
  defaultSortBy: 'createdOn',
  defaultOrderDirection: OrderDirection.ASC,
  relations: [
    'organization',
    'organization.organizationGeneral',
    // 'user',
    // 'application',
  ],
  rangeColumn: 'createdOn',
};
