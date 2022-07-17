import { IOrganizationReport } from '../../pages/organization/interfaces/OrganizationReport.interface';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const organizationReportsSlice = (set: any) => ({
  organizationReport: null,
  setOrganizationReport: (organizationReport: IOrganizationReport) => {
    set({ organizationReport });
  },
});

export default { organizationReportsSlice };
