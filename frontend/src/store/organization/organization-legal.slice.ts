import { IOrganizationLegal } from '../../pages/organization/interfaces/OrganizationLegal.interface';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const organizationLegalSlice = (set: any) => ({
  organizationLegal: null,
  setOrganizationLegal: (organizationLegal: IOrganizationLegal) => {
    set({ organizationLegal });
  },
});

export default { organizationLegalSlice };
