import API from '../API';

export const getOrganization = (id: number): Promise<any> => {
  return API.get(`http://localhost:3001/organization/${id}`).then((res) => res.data);
};

export const patchOrganization = (id: number, update: any): Promise<any> => {
  return API.patch(`http://localhost:3001/organization/${id}`, { ...update }).then(
    (res) => res.data,
  );
};
