import useStore from '../store';

export const useSelectedOrganization = () => {
  const organizationGeneral = useStore((state) => state.organizationGeneral);
  const organizationFinancial = useStore((state) => state.organizationFinancial);
  const organizationActivity = useStore((state) => state.organizationActivity);
  const organizationReport = useStore((state) => state.organizationReport);
  const organizationLegal = useStore((state) => state.organizationLegal);
  const organizationApplications = useStore((state) => state.organizationApplications);
  const organizationApplicationRequests = useStore(
    (state) => state.organizationApplicationRequests,
  );
  const organization = useStore((state) => state.organization);

  return {
    organization,
    organizationGeneral,
    organizationActivity,
    organizationFinancial,
    organizationReport,
    organizationLegal,
    organizationApplications,
    organizationApplicationRequests,
  };
};

export const useOrganizations = () => {
  const organizations = useStore((state) => state.organizations);
  return {
    organizations,
  };
};
