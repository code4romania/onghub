import { createUser, deleteUser, getProfile } from './User.service';
import { useMutation, useQuery } from 'react-query';
import useStore from '../../store/store';
import { IUserPayload } from '../../pages/users/interfaces/UserPayload.interface';

export const useUserQuery = (queryOptions?: any) => {
  const { setProfile, setOrganization } = useStore();
  return useQuery('user', () => getProfile(), {
    onSuccess: (data: any) => {
      const { organization, ...user } = data;
      setProfile(user);
      setOrganization(organization);
    },
    ...queryOptions,
  });
};

export const useCreateUserMutation = () => {
  return useMutation((payload: IUserPayload) => createUser(payload));
};

export const useUserMutation = () => {
  const { setProfile } = useStore();
  return useMutation(() => deleteUser(), {
    onSuccess: () => {
      setProfile(null);
    },
  });
};
