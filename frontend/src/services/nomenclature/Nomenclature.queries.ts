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
} from './Nomenclatures.service';
import { Coalition } from '../../common/interfaces/coalitions.interface';
import { Federation } from '../../common/interfaces/federations.interface';

export const useCitiesQuery = (countyId: number) => {
  console.log(countyId);
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
      setFederations(data);
    },
  });
};

export const useCoalitionsQuery = () => {
  const { setCoalitions } = useStore();
  return useQuery('coalitions', () => getCoalitions(), {
    onSuccess: (data: Coalition[]) => {
      setCoalitions(data);
    },
  });
};
