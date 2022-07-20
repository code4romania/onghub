import { API_URL } from './../API';
import API from '../API';

export const getOrganization = (id: number): Promise<any> => {
  return API.get(`${API_URL}/organization/${id}`).then((res) => res.data);
};

export const patchOrganization = (id: number, update: any): Promise<any> => {
  return API.patch(`${API_URL}/organization/${id}`, { ...update }).then((res) => res.data);
};
