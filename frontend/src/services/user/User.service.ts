import { IUser } from '../../pages/users/interfaces/User.interface';
import { IUserPayload } from '../../pages/users/interfaces/UserPayload.interface';
import API from '../API';

export const createUser = async (payload: IUserPayload): Promise<IUser> => {
  return API.post(`/user`, payload).then((res) => res.data);
};

export const getUser = async (): Promise<IUser> => {
  return API.get(`/user`).then((res) => res.data);
};

export const deleteUser = async (): Promise<any> => {
  return API.delete(`/user`).then((res) => res.data);
};
