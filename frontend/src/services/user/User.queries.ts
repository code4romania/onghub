import {
  createUser,
  deleteUser,
  getInvitees,
  getProfile,
  getUserById,
  getUsers,
  removeUserById,
  resendInvite,
  restoreUserAccess,
  restrictUserAccess,
  updateUser,
} from './User.service';
import { useMutation, useQuery } from 'react-query';
import useStore from '../../store/store';
import { IUserPayload } from '../../pages/users/interfaces/UserPayload.interface';
import { IUser } from '../../pages/users/interfaces/User.interface';
import { PaginatedEntity } from '../../common/interfaces/paginated-entity.interface';
import { OrderDirection } from '../../common/enums/sort-direction.enum';
import { UserStatus } from '../../pages/users/enums/UserStatus.enum';
import { IInvite } from '../../pages/users/interfaces/Invite.interface';

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
  search?: string,
  status?: UserStatus,
  interval?: Date[],
) => {
  const { setUsers } = useStore();
  return useQuery(
    ['users', limit, page, orderBy, orderDirection, search, status, interval],
    () => getUsers(limit, page, orderBy, orderDirection, search, status, interval),
    {
      onSuccess: (data: PaginatedEntity<IUser>) => {
        setUsers({
          items: data.items,
          meta: { ...data.meta, orderByColumn: orderBy, orderDirection },
        });
      },
      enabled: !!(limit && page && orderBy && orderDirection),
    },
  );
};

export const useInviteesQuery = (search?: string, interval?: Date[]) => {
  const { setInvites } = useStore();
  return useQuery(['invitees', search, interval], () => getInvitees(search, interval), {
    onSuccess: (data: IInvite[]) => {
      setInvites(data);
    },
  });
};

export const useSelectedUserQuery = (userId: string) => {
  return useQuery(['user', userId], () => getUserById(userId), { enabled: !!userId, cacheTime: 0, staleTime: 0 });
};

export const useCreateUserMutation = () => {
  return useMutation((payload: IUserPayload) => createUser(payload));
};

export const useUpdateUserMutation = () => {
  return useMutation(({ userId, payload }: { userId: string; payload: Partial<IUserPayload> }) =>
    updateUser(userId, payload),
  );
};

export const useRestrictUserMutation = () => {
  return useMutation((ids: number[]) => restrictUserAccess(ids));
};

export const useRestoreUserMutation = () => {
  return useMutation((ids: number[]) => restoreUserAccess(ids));
};

export const useRemoveUserMutation = () => {
  return useMutation((id: number) => removeUserById(id));
};

export const useUserMutation = () => {
  const { setProfile } = useStore();
  return useMutation(() => deleteUser(), {
    onSuccess: () => {
      setProfile(null);
    },
  });
};

export const useResendInviteMutation = () => {
  return useMutation((id: number) => resendInvite(id));
};
