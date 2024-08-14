import useStore from '../store';

export const useNomenclature = () => {
  const counties = useStore((state) => state.counties);
  const cities = useStore((state) => state.cities);
  const domains = useStore((state) => state.domains);
  const regions = useStore((state) => state.regions);
  const federations = useStore((state) => state.federations);
  const coalitions = useStore((state) => state.coalitions);
  const skills = useStore((state) => state.skills);
  const faculties = useStore((state) => state.faculties);
  const issuers = useStore((state) => state.issuers);
  return {
    counties,
    cities,
    domains,
    regions,
    federations,
    coalitions,
    skills,
    faculties,
    issuers,
  };
};
