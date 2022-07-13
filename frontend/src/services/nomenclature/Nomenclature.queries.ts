import { useQuery } from 'react-query';
import { City } from '../../common/interfaces/city.interface';
import { County } from '../../common/interfaces/county.interface';
import useStore from '../../store/store';
import { getCities, getCounties } from './Nomenclatures.service';

export const useCitiesQuery = (countyId: number) => {
  const { setCities } = useStore();
  return useQuery(['cities', countyId], () => getCities(countyId), {
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
