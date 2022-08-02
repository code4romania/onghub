import API from '../API';

export const getOrganization = (id: number): Promise<any> => {
  return API.get(`/organization/${id}`).then((res) => res.data);
};

export const patchOrganization = (id: number, update: any): Promise<any> => {
  return API.patch(`/organization/${id}`, { ...update }).then((res) => res.data);
};

export const uploadOrganizationFiles = (id: number, files: FormData): Promise<any> => {
  return API.post(`/organization/${id}/upload`, files, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then((res) => res.data);
};

export const uploadPartners = (id: number, partnerId: number, files: FormData): Promise<any> => {
  return API.post(`/organization/${id}/partners/${partnerId}`, files, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then((res) => res.data);
};

export const uploadInvestors = (id: number, investorId: number, files: FormData): Promise<any> => {
  return API.post(`/organization/${id}/investors/${investorId}`, files, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then((res) => res.data);
};

export const deletePartners = (id: number, partnerId: number): Promise<any> => {
  return API.delete(`/organization/${id}/partners/${partnerId}`).then((res) => res.data);
};

export const deleteInvestors = (id: number, investorId: number): Promise<any> => {
  return API.delete(`/organization/${id}/investors/${investorId}`).then((res) => res.data);
};
