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
} from './Nomenclatures.service';
import { Coalition } from '../../common/interfaces/coalitions.interface';
import { Federation } from '../../common/interfaces/federations.interface';
import { Skill } from '../../common/interfaces/skill.interface';
import { Faculty } from '../../common/interfaces/faculty.interface';
import { alphabeticallySort } from '../../common/helpers/utils.helper';

export const useCitiesQuery = (countyId: number) => {
  const { setCities } = useStore();
  return useQuery(['cities', countyId], () => getCities('', countyId), {
    onSuccess: (data: City[]) => {
      setCities(data);
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

export const useDomainsQuery = () => {
  const { setDomains } = useStore();
  return useQuery('domains', () => getDomains(), {
    onSuccess: (data: Domain[]) => {
      setDomains(data);
    },
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
