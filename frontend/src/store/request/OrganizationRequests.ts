import { OrderDirection } from '../../common/enums/sort-direction.enum';
import { PaginatedEntity } from '../../common/interfaces/paginated-entity.interface';
import { IOrganizationRequest } from '../../pages/requests/interfaces/Request.interface';

export const organizationRequestsSlice = (set: any) => ({
  organizationRequests: {
    items: [],
    meta: {
      currentPage: 1,
      itemCount: 0,
      itemsPerPage: 10,
      totalItems: 0,
      totalPages: 1,
      orderByColumn: 'createdOn',
      orderDirection: OrderDirection.ASC,
    },
  },
  setOrganizationRequests: (organizationRequests: PaginatedEntity<IOrganizationRequest>) => {
    set({ organizationRequests });
  },
});

export default { organizationRequestsSlice };
