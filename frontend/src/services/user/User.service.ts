import { OrderDirection } from '../../common/enums/sort-direction.enum';
import { PaginatedEntity } from '../../common/interfaces/paginated-entity.interface';
import { IUser } from '../../pages/users/interfaces/User.interface';
import { IUserPayload } from '../../pages/users/interfaces/UserPayload.interface';
import API from '../API';

export const createUser = async (payload: IUserPayload): Promise<IUser> => {
  return API.post(`/user`, payload).then((res) => res.data);
};

export const getUsers = async (
  limit: number,
  page: number,
  orderBy: string,
  orderDirection: OrderDirection,
  search?: string,
): Promise<PaginatedEntity<IUser>> => {
  let requestUrl = `/user?limit=${limit}&page=${page}&orderBy=${orderBy}&orderDirection=${orderDirection}`;

  if (search) requestUrl = `${requestUrl}&search=${search}`;

  return API.get(requestUrl).then((res) => res.data);
};

export const getProfile = async (): Promise<IUser> => {
  return API.get(`/profile`).then((res) => res.data);
};

export const deleteUser = async (): Promise<any> => {
  return API.delete(`/user`).then((res) => res.data);
};
