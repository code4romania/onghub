import {
  ApplicationWithOngStatus,
  OrganizationApplicationRequest,
} from '../../services/application/interfaces/Application.interface';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const organizationApplications = (set: any) => ({
  organizationApplications: [],
  organizationApplicationRequests: [],
  setOrganizationApplications: (organizationApplications: ApplicationWithOngStatus[]) => {
    set({ organizationApplications });
  },
  setOrganizationApplicationRequests: (
    organizationApplicationRequests: OrganizationApplicationRequest[],
  ) => {
    set({ organizationApplicationRequests });
  },
});

export default { organizationApplications };
