import { OrderDirection } from 'src/common/enums/order-direction.enum';

export const FEEDBACK_FILTERS_CONFIG = {
  selectColumns: {
    id: true,
    civicCenterService: {
      name: true,
    },
    rating: true,
    interactionDate: true,
    name: true,
    createdOn: true,
    message: true,
  },
  searchableColumns: [],
  defaultSortBy: 'name',
  defaultOrderDirection: OrderDirection.ASC,
  relations: { civicCenterService: true },
};
