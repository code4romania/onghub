import { ApplicationWithOngStatus } from '../../services/application/interfaces/Application.interface';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const organizationApplications = (set: any) => ({
  organizationApplications: [],
  setOrganizationApplications: (organizationApplications: ApplicationWithOngStatus[]) => {
    set({ organizationApplications });
  },
});

export default { organizationApplications };
