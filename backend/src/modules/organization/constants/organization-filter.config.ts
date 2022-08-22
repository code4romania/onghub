import { OrderDirection } from 'src/common/enums/order-direction.enum';

//TODO: to add organizationGeneral.name to selectColumns, searchableColumns and defaultSortBy
export const ORGANIZATION_FILTERS_CONFIG = {
  selectColumns: ['id', 'createdOn', 'status', 'updatedOn'],
  searchableColumns: [],
  defaultSortBy: 'id', // placeholder
  defaultOrderDirection: OrderDirection.ASC,
  relations: [],
  rangeColumn: 'createdOn',
};
