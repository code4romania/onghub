import { OrderDirection } from '../../common/enums/sort-direction.enum';
import { PaginatedEntity } from '../../common/interfaces/paginated-entity.interface';
import { IRequest } from '../../pages/requests/interfaces/Request.interface';

export const requestsSlice = (set: any) => ({
  requests: {
    items: [],
    meta: {
      currentPage: 1,
      itemCount: 0,
      itemsPerPage: 10,
      totalItems: 0,
      totalPages: 1,
      orderByColumn: 'name',
      orderDirection: OrderDirection.ASC,
    },
  },
  setRequests: (requests: PaginatedEntity<IRequest>) => {
    set({ requests });
  },
});

export default { requestsSlice };
