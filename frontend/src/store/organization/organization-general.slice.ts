import { IOrganizationGeneral } from '../../pages/organization/interfaces/OrganizationGeneral.interface';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const organizationGeneralSlice = (set: any) => ({
  organizationGeneral: null,
  setOrganizationGeneral: (organizationGeneral: IOrganizationGeneral) => {
    set({ organizationGeneral });
  },
});

export default { organizationGeneralSlice };
