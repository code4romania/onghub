import useStore from '../store';

export const useApplications = () => {
  const applications = useStore((state) => state.applications);
  return { applications };
};
