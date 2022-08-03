import { IOrganization } from '../../pages/organization/interfaces/Organization.interface';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const organizationSlice = (set: any) => ({
  organization: null,
  setOrganization: (organization: IOrganization) => {
    set({ organization });
  },
});

export default { organizationSlice };
