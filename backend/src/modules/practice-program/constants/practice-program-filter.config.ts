import { OrderDirection } from 'src/common/enums/order-direction.enum';

export const PRACTICE_PROGRAM_FILTER_CONFIG = {
  selectColumns: {
    id: true,
    title: true,
    deadline: true,
    description: true,
    startDate: true,
    endDate: true,
    isPeriodNotDetermined: true,
    minWorkingHours: true,
    maxWorkingHours: true,
    link: true,
    location: {
      id: true,
      name: true,
    },
    faculties: {
      id: true,
      name: true,
    },
    skills: {
      id: true,
      name: true,
    },
    domains: {
      id: true,
      name: true,
    },
    organization: {
      id: true,
      organizationGeneral: {
        id: true,
        name: true,
        description: true,
        phone: true,
        email: true,
        city: {
          id: true,
          name: true,
        },
        county: {
          id: true,
          name: true,
        },
        facebook: true,
        instagram: true,
        twitter: true,
      },
      organizationActivity: {
        id: true,
        domains: {
          id: true,
          name: true,
        },
      },
    },
  },
  searchableColumns: [
    'title',
    'description',
    'organization.organizationGeneral.name',
    'organization.organizationGeneral.description',
  ],
  defaultSortBy: 'startDate',
  defaultOrderDirection: OrderDirection.ASC,
  relations: {
    location: true,
    faculties: true,
    skills: true,
    domains: true,
    organization: {
      organizationGeneral: {
        city: true,
        county: true,
      },
      organizationActivity: {
        domains: true,
      },
    },
  },
  rangeColumn: ['startDate', 'endDate'],
};
