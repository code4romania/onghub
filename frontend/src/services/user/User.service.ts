import API from '../API';

export const getUser = (): Promise<any> => {
  return API.get(`/user`).then((res) => res.data);
};

export const deleteUser = (): Promise<any> => {
  return API.delete(`/user`).then((res) => res.data);
};
