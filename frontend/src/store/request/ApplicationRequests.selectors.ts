import useStore from '../store';

export const useApplicationRequests = () => {
  const applicationRequests = useStore((state) => state.applicationRequests);
  return { applicationRequests };
};
