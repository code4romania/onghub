import useStore from '../store';

export const useRequests = () => {
  const requests = useStore((state) => state.requests);
  return { requests };
};
