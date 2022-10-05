import useStore from '../store';

export const useOrganizationStatistics = () => {
  const allOrganizationsStatistics = useStore((state) => state.allOrganizationsStatistics);
  const oneOrganizationStatistics = useStore((state) => state.oneOrganizationStatistics);

  return {
    allOrganizationsStatistics,
    oneOrganizationStatistics
  };
};
