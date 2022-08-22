import API from '../API';

/**EMPLOYEE && ADMIN */
export const getOrganizationByProfile = (): Promise<any> => {
  return API.get(`/organization-profile`).then((res) => res.data);
};

export const patchOrganizationByProfile = (update: any): Promise<any> => {
  return API.patch(`/organization-profile`, { ...update }).then((res) => res.data);
};

export const uploadOrganizationFilesByProfile = (files: FormData): Promise<any> => {
  return API.post(`/organization-profile/upload`, files, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then((res) => res.data);
};

export const uploadPartnersByProfile = (partnerId: number, files: FormData): Promise<any> => {
  return API.post(`/organization-profile/partners/${partnerId}`, files, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then((res) => res.data);
};

export const uploadInvestorsByProfile = (investorId: number, files: FormData): Promise<any> => {
  return API.post(`/organization-profile/investors/${investorId}`, files, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then((res) => res.data);
};

export const deletePartnersByProfile = (partnerId: number): Promise<any> => {
  return API.delete(`/organization-profile/partners/${partnerId}`).then((res) => res.data);
};

export const deleteInvestorsByProfile = (investorId: number): Promise<any> => {
  return API.delete(`/organization-profile/investors/${investorId}`).then((res) => res.data);
};

/**
 * SUPER ADMIN
 */
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
