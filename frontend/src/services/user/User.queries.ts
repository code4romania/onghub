import { createUser, deleteUser, getUser } from './User.service';
import { useMutation, useQuery } from 'react-query';
import useStore from '../../store/store';
import { IUserPayload } from '../../pages/users/interfaces/UserPayload.interface';

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

export const useCreateUserMutation = () => {
  return useMutation((payload: IUserPayload) => createUser(payload));
};

export const useUserMutation = () => {
  const { setUser } = useStore();
  return useMutation(() => deleteUser(), {
    onSuccess: () => {
      setUser(null);
    },
  });
};
