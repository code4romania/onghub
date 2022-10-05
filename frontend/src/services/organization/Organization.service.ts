import formatISO9075 from 'date-fns/formatISO9075';
import { OrderDirection } from '../../common/enums/sort-direction.enum';
import { PaginatedEntity } from '../../common/interfaces/paginated-entity.interface';
import { IOrganizationFull } from '../../pages/organization/interfaces/Organization.interface';
import API from '../API';
import {
  ApplicationWithOngStatus,
  OrganizationApplicationRequest,
} from '../application/interfaces/Application.interface';

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
export const getOrganizations = async (
  limit: number,
  page: number,
  orderBy: string,
  orderDirection: OrderDirection,
  search?: string,
  status?: number,
  interval?: Date[],
  userCount?: string,
): Promise<PaginatedEntity<IOrganizationFull>> => {
  let requestUrl = `/organization?limit=${limit}&page=${page}&orderBy=${orderBy}&orderDirection=${orderDirection}`;

  if (search) requestUrl = `${requestUrl}&search=${search}`;

  if (status !== null && status !== undefined)
    requestUrl = `${requestUrl}&completionStatusCount=${status}`;

  if (interval && interval.length === 2)
    requestUrl = `${requestUrl}&start=${formatISO9075(interval[0])}&end=${formatISO9075(
      interval[1],
    )}`;

  if (userCount) {
    requestUrl = `${requestUrl}&userCount=${userCount}`;
  }

  return API.get(requestUrl).then((res) => res.data);
};

export const getOrganization = (id: string): Promise<any> => {
  return API.get(`/organization/${id}`).then((res) => res.data);
};

export const getOrganizationApplications = (id: string): Promise<ApplicationWithOngStatus[]> => {
  return API.get(`/application/organization/${id}`).then((res) => res.data);
};

export const getOrganizationApplicationRequests = (
  id: string,
): Promise<OrganizationApplicationRequest[]> => {
  return API.get(`/application/request/organization/${id}`).then((res) => res.data);
};

export const patchOrganization = (id: number, update: any): Promise<any> => {
  return API.patch(`/organization/${id}`, { ...update }).then((res) => res.data);
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
