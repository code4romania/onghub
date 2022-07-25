import useStore from '../store';

export const useSelectedOrganization = () => {
  const organizationGeneral = useStore((state) => state.organizationGeneral);
  const organizationFinancial = useStore((state) => state.organizationFinancial);
  const organizationActivity = useStore((state) => state.organizationActivity);
  const organizationReport = useStore((state) => state.organizationReport);
  const organizationLegal = useStore((state) => state.organizationLegal);
  return {
    organizationGeneral,
    organizationActivity,
    organizationFinancial,
    organizationReport,
    organizationLegal,
  };
};
