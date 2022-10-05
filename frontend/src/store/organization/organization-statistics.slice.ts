import { IAllOrganizationsStatistics, IOrganizationStatistics } from "../../pages/organization/interfaces/OrganizationStatistics.interface";

export const organizationStatisticsSlice = (set: any) => ({
  allOrganizationsStatistics: null,
  oneOrganizationStatistics: null,
  setAllOrganizationsStatistics: (allOrganizationsStatistics: IAllOrganizationsStatistics) => {
    set({ allOrganizationsStatistics });
  },
  setOneOrganizationStatistics: (oneOrganizationStatistics: IOrganizationStatistics) => {
    set({ oneOrganizationStatistics });
  },
});

export default { organizationStatisticsSlice };


