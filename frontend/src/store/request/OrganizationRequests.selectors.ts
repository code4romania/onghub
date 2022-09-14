import useStore from '../store';

export const useOrganizationRequests = () => {
  const organizationRequests = useStore((state) => state.organizationRequests);
  return { organizationRequests };
};
