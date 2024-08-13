import useStore from '../store';

export const useNomenclature = () => {
  const counties = useStore((state) => state.counties);
  const cities = useStore((state) => state.cities);
  const organizationCities = useStore((state) => state.organizationCities);
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
    organizationCities,
    domains,
    regions,
    federations,
    coalitions,
    skills,
    faculties,
    issuers,
  };
};
