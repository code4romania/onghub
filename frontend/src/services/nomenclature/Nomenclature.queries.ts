import { useQuery } from 'react-query';
import { City } from '../../common/interfaces/city.interface';
import { County } from '../../common/interfaces/county.interface';
import { Domain } from '../../common/interfaces/domain.interface';
import { Region } from '../../common/interfaces/region.interface';
import useStore from '../../store/store';
import {
  getCities,
  getCounties,
  getDomains,
  getRegions,
  getFederations,
  getCoalitions,
  getSkills,
  getFaculties,
  getPracticeDomains,
  getServiceDomains,
  getBeneficiaries,
  getIssuers,
} from './Nomenclatures.service';
import { Coalition } from '../../common/interfaces/coalitions.interface';
import { Federation } from '../../common/interfaces/federations.interface';
import { Skill } from '../../common/interfaces/skill.interface';
import { Faculty } from '../../common/interfaces/faculty.interface';
import { alphabeticallySort } from '../../common/helpers/utils.helper';
import { Issuer } from '../../common/interfaces/issuer.interface';

export const useCitiesQuery = (countyId: number) => {
  const { setCities } = useStore();
  return useQuery(['cities', countyId], () => getCities('', countyId), {
    onSuccess: (data: City[]) => {
      setCities(data);
    },
    enabled: !!countyId,
  });
};

export const useOrganizationCitiesQuery = (countyId: number) => {
  const { setOrganizationCities } = useStore();
  return useQuery(['cities', countyId], () => getCities('', countyId), {
    onSuccess: (data: City[]) => {
      setOrganizationCities(data);
    },
    enabled: !!countyId,
  });
};

export const useCountiesQuery = () => {
  const { setCounties } = useStore();
  return useQuery('counties', () => getCounties(), {
    onSuccess: (data: County[]) => {
      setCounties(data);
    },
  });
};

export const useIssuersQuery = () => {
  const { setIssuers } = useStore();
  return useQuery(['issuers'], () => getIssuers(), {
    cacheTime: 1000 * 60 * 60,
    staleTime: 1000 * 60 * 60,
    onSuccess: (data: Issuer[]) => {
      setIssuers(data);
    },
  });
};

export const useDomainsQuery = () => {
  const { setDomains } = useStore();
  return useQuery('domains', () => getDomains(), {
    onSuccess: (data: Domain[]) => {
      setDomains(data);
    },
  });
};

export const usePracticeDomainsQuery = () => {
  return useQuery(['practice-domains'], () => getPracticeDomains(), {
    cacheTime: 1000 * 60 * 60,
    staleTime: 1000 * 60 * 60,
  });
};

export const useServiceDomainsQuery = () => {
  return useQuery(['service-domains'], () => getServiceDomains(), {
    cacheTime: 1000 * 60 * 60,
    staleTime: 1000 * 60 * 60,
  });
};

export const useBeneficiariesQuery = () => {
  return useQuery(['beneficiaries'], () => getBeneficiaries(), {
    cacheTime: 1000 * 60 * 60,
    staleTime: 1000 * 60 * 60,
  });
};

export const useRegionsQuery = () => {
  const { setRegions } = useStore();
  return useQuery('regions', () => getRegions(), {
    onSuccess: (data: Region[]) => {
      setRegions(data);
    },
  });
};

export const useFederationsQuery = () => {
  const { setFederations } = useStore();
  return useQuery('federations', () => getFederations(), {
    onSuccess: (data: Federation[]) => {
      setFederations(data.sort(alphabeticallySort));
    },
  });
};

export const useCoalitionsQuery = () => {
  const { setCoalitions } = useStore();
  return useQuery('coalitions', () => getCoalitions(), {
    onSuccess: (data: Coalition[]) => {
      setCoalitions(data.sort(alphabeticallySort));
    },
  });
};

export const useSkillsQuery = () => {
  const { setSkills } = useStore();
  return useQuery('skills', () => getSkills(), {
    onSuccess: (data: Skill[]) => {
      setSkills(data);
    },
  });
};

export const useFacultiesQuery = () => {
  const { setFaculties } = useStore();
  return useQuery('faculties', () => getFaculties(), {
    onSuccess: (data: Faculty[]) => {
      setFaculties(data);
    },
  });
};
