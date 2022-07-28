import { getUser } from './User.service';
import { useQuery } from 'react-query';
import useStore from '../../store/store';

export const useUserQuery = (queryOptions?: any) => {
  const { setUser } = useStore();
  return useQuery('user', () => getUser(), {
    onSuccess: (data: any) => {
      setUser(data);
    },
    ...queryOptions,
  });
};
