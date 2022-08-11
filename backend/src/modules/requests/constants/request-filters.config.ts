import { OrderDirection } from 'src/common/enums/order-direction.enum';

export const REQUEST_FILTER_CONFIG = {
  selectColumns: ['id', 'name', 'email', 'phone', 'organization', 'createdOn'],
  searchableColumns: ['name', 'organization.organizationGeneral.name'],
  defaultSortBy: 'createdOn',
  defaultOrderDirection: OrderDirection.ASC,
  relations: ['organization', 'organization.organizationGeneral'],
  rangeColumn: 'createdOn',
};
