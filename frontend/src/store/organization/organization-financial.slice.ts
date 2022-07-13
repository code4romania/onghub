import { IOrganizationFinancial } from '../../pages/organization/interfaces/OrganizationFinancial.interface';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const organizationFinancialSlice = (set: any) => ({
  organizationFinancial: [],
  setOrganizationFinancial: (organizationFinancial: IOrganizationFinancial[]) => {
    set({ organizationFinancial });
  },
});

export default { organizationFinancialSlice };
