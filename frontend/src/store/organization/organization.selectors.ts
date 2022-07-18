import useStore from '../store';

export const useSelectedOrganization = () => {
  const organizationGeneral = useStore((state) => state.organizationGeneral);
  const organizationFinancial = useStore((state) => state.organizationFinancial);
  const organizationActivity = useStore((state) => state.organizationActivity);
  return { organizationGeneral, organizationFinancial, organizationActivity };
};
