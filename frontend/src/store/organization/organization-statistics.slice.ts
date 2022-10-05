export const organizationStatisticsSlice = (set: any) => ({
  allOrganizationsStatistics: null,
  setAllOrganizationsStatistics: (allOrganizationsStatistics: any) => {
    set({ allOrganizationsStatistics });
  },
});

export default { organizationStatisticsSlice };


