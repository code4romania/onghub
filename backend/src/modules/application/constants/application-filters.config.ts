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
