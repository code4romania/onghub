import { OrderDirection } from '../../common/enums/sort-direction.enum';
import { PaginatedEntity } from '../../common/interfaces/paginated-entity.interface';
import {
  Application,
  ApplicationOrganization,
  ApplicationWithOngStatusDetails,
} from '../../services/application/interfaces/Application.interface';

export const applicationsSlice = (set: any) => ({
  applications: {
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
  applicationOrganizations: {
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
  selectedApplication: null,

  setApplications: (applications: PaginatedEntity<Application>) => {
    set({ applications });
  },
  setSelectedApplication: (selectedApplication: ApplicationWithOngStatusDetails) => {
    set({ selectedApplication });
  },
  setApplicationOrganizations: (
    applicationOrganizations: PaginatedEntity<ApplicationOrganization>,
  ) => {
    set({ applicationOrganizations });
  },
});

export default { applicationsSlice };
