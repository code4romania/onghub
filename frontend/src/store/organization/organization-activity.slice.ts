// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const organizationActivitySlice = (set: any) => ({
  organizationActivity: null,
  setOrganizationActivity: (organizationActivity: any) => {
    set({ organizationActivity });
  },
});

export default { organizationActivitySlice };
