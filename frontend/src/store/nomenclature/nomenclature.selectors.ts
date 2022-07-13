import useStore from '../store';

export const useNomenclature = () => {
  const counties = useStore((state) => state.counties);
  const cities = useStore((state) => state.cities);
  return { counties, cities };
};
