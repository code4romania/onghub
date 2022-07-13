import useStore from '../store';

export const useSelectedOrganization = () => {
  const organizationGeneral = useStore((state) => state.organizationGeneral);
  const organizationFinancial = useStore((state) => state.organizationFinancial);
  const organizationReport = useStore((state) => state.organizationReport);
  return { organizationGeneral, organizationFinancial, organizationReport };
};
