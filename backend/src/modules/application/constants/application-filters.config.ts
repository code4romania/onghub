import { OrderDirection } from 'src/common/enums/order-direction.enum';

export const APPLICATION_FILTERS_CONFIG = {
  selectColumns: ['id', 'name', 'type', 'status'],
  searchableColumns: ['name'],
  defaultSortBy: 'name',
  defaultOrderDirection: OrderDirection.ASC,
  relations: [],
};
