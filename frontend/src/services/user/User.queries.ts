import { getUser } from './User.service';
import { useQuery } from 'react-query';
import useStore from '../../store/store';

export const useUserQuery = (queryOptions?: any) => {
  const { setUser, setOrganization } = useStore();
  return useQuery('user', () => getUser(), {
    onSuccess: (data: any) => {
      const { organization, ...user } = data;
      setUser(user);
      setOrganization(organization);
    },
    ...queryOptions,
  });
};
