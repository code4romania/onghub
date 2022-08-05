import API from '../API';

export const getOrganization = (id: number): Promise<any> => {
  return API.get(`/organization/${id}`).then((res) => res.data);
};

export const patchOrganization = (id: number, update: any): Promise<any> => {
  return API.patch(`/organization/${id}`, { ...update }).then((res) => res.data);
};

export const createOrganization = (payload: any): Promise<any> => {
  return API.post(`organization`, payload, { headers: { public: true } }).then((res) => res.data);
};
