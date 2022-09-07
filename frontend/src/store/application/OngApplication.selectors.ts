import useStore from '../store';

export const useOngApplications = () => {
  const ongApplications = useStore((state) => state.ongApplications);
  return { ongApplications };
};

export const useSelectedOngApplication = () => {
  const selectedOngApplication = useStore((state) => state.selectedOngApplication);
  return { selectedOngApplication };
};
