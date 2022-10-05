import useStore from '../store';

export const useAllOrganizationsStatistics = () => {
  const allOrganizationsStatistics = useStore((state) => state.allOrganizationsStatistics);

  return {
    allOrganizationsStatistics,
  };
};
