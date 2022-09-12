import useStore from '../store';

export const useApplications = () => {
  const applications = useStore((state) => state.applications);
  return { applications };
};

export const useSelectedApplication = () => {
  const selectedApplication = useStore((state) => state.selectedApplication);
  return { selectedApplication };
};
