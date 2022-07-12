import { OrganizationGeneral } from '../pages/organization/interfaces/OrganizationGeneral.interface';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const organizationGeneralSlice = (set: any) => ({
  organizationGeneral: null,
  setOrganizationGeneral: (organizationGeneral: OrganizationGeneral) => {
    set({ organizationGeneral });
  },
});

export default { organizationGeneralSlice };
