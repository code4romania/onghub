import { OrderDirection } from '../../common/enums/sort-direction.enum';
import { PaginatedEntity } from '../../common/interfaces/paginated-entity.interface';
import { IOrganizationFull } from '../../pages/organization/interfaces/Organization.interface';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const organizationsSlice = (set: any) => ({
  organizations: {
    items: [],
    meta: {
      currentPage: 1,
      itemCount: 0,
      itemsPerPage: 10,
      totalItems: 0,
      totalPages: 1,
      orderByColumn: 'id',
      orderDirection: OrderDirection.ASC,
    },
  },
  setOrganizations: (organizations: PaginatedEntity<IOrganizationFull>) => {
    set({ organizations });
  },
});

export default { organizationsSlice };
