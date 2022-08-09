import { createUser, deleteUser, getProfile, getUsers } from './User.service';
import { useMutation, useQuery } from 'react-query';
import useStore from '../../store/store';
import { IUserPayload } from '../../pages/users/interfaces/UserPayload.interface';
import { IUser } from '../../pages/users/interfaces/User.interface';
import { PaginatedEntity } from '../../common/interfaces/paginated-entity.interface';
import { OrderDirection } from '../../common/enums/sort-direction.enum';

export const useProfileQuery = (queryOptions?: any) => {
  const { setProfile, setOrganization } = useStore();
  return useQuery('profile', () => getProfile(), {
    onSuccess: (data: any) => {
      const { organization, ...user } = data;
      setProfile(user);
      setOrganization(organization);
    },
    ...queryOptions,
  });
};

export const useUsersQuery = (
  limit: number,
  page: number,
  orderBy: string,
  orderDirection: OrderDirection,
) => {
  const { setUsers } = useStore();
  return useQuery(
    ['users', limit, page, orderBy, orderDirection],
    () => getUsers(limit, page, orderBy, orderDirection),
    {
      onSuccess: (data: PaginatedEntity<IUser>) => {
        setUsers(data);
      },
    },
  );
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
