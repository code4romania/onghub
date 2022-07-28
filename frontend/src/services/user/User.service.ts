import API from '../API';

export const getUser = (): Promise<any> => {
  return API.get(`/user`).then((res) => res.data);
};
