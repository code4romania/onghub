import { formatISO9075 } from 'date-fns';
import { OrderDirection } from '../../common/enums/sort-direction.enum';
import { PaginatedEntity } from '../../common/interfaces/paginated-entity.interface';
import { ApplicationTypeEnum } from '../../pages/apps-store/constants/ApplicationType.enum';
import { CompletionStatus } from '../../pages/organization/enums/CompletionStatus.enum';
import { IOrganizationFull } from '../../pages/organization/interfaces/Organization.interface';
import API from '../API';
import {
  ApplicationWithOngStatus,
  OrganizationApplicationRequest,
} from '../application/interfaces/Application.interface';
import {
  mapEntityToFormData,
  mapOrganizationActivityToFormData,
  mapOrganizationFinancialToFormData,
  mapOrganizationGeneralToFormData,
  mapOrganizationLegalToFormData,
} from './OrganizationFormDataMapper.service';
import { IOrganizationFinancial } from '../../pages/organization/interfaces/OrganizationFinancial.interface';

/**EMPLOYEE && ADMIN */
export const getOrganizationByProfile = (): Promise<any> => {
  return API.get(`/organization-profile`).then((res) => res.data);
};

export const patchOrganizationByProfile = (
  update: any,
  logo?: File | null,
  organizationStatute?: File | null,
  nonPoliticalAffiliationFile?: File | null,
  balanceSheetFile?: File | null,
): Promise<any> => {
  const payload = generateOrganizationFormDataPayload(
    update,
    logo,
    organizationStatute,
    nonPoliticalAffiliationFile,
    balanceSheetFile,
  );
  return API.patch(`/organization-profile`, payload, {
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

export const restrictOrganizationRequest = (): Promise<any> => {
  return API.post(`/organization-profile/close`).then((res) => res.data);
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
  status?: CompletionStatus,
  interval?: Date[],
  userCount?: string,
): Promise<PaginatedEntity<IOrganizationFull>> => {
  let requestUrl = `/organization?limit=${limit}&page=${page}&orderBy=${orderBy}&orderDirection=${orderDirection}`;

  if (search) requestUrl = `${requestUrl}&search=${search}`;

  if (status !== null && status !== undefined)
    requestUrl = `${requestUrl}&completionStatus=${status}`;

  if (interval && interval.length === 2)
    requestUrl = `${requestUrl}&start=${formatISO9075(interval[0])}&end=${formatISO9075(
      interval[1],
    )}`;

  if (userCount) {
    requestUrl = `${requestUrl}&userCount=${userCount}`;
  }

  return API.get(requestUrl).then((res) => res.data);
};

export const downloadOrganizations = async (): Promise<any> => {
  return API.get(`/organization/download`, { responseType: 'arraybuffer' }).then((res) => {
    return { data: res.data, headers: res.headers };
  });
};

export const retryAnafReports = (id: number, cui: string): Promise<IOrganizationFinancial[]> => {
  return API.post(`/organization/${id}/report-entries-retry/`, { cui }).then((res) => res.data);
};

export const getOrganization = (id: string): Promise<any> => {
  return API.get(`/organization/${id}`).then((res) => res.data);
};

export const getOrganizationApplications = (
  id: string,
  search?: string,
  type?: ApplicationTypeEnum,
): Promise<ApplicationWithOngStatus[]> => {
  return API.get(`/application/organization/${id}`, {
    params: {
      search,
      type,
    },
  }).then((res) => res.data);
};

export const getOrganizationApplicationRequests = (
  id: string,
): Promise<OrganizationApplicationRequest[]> => {
  return API.get(`/application/request/organization/${id}`).then((res) => res.data);
};

export const patchOrganization = (
  id: number,
  update: any,
  logo?: File | null,
  organizationStatute?: File | null,
  nonPoliticalAffiliationFile?: File | null,
  balanceSheetFile?: File | null,
): Promise<any> => {
  const payload = generateOrganizationFormDataPayload(
    update,
    logo,
    organizationStatute,
    nonPoliticalAffiliationFile,
    balanceSheetFile,
  );
  return API.patch(`/organization/${id}`, payload, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then((res) => res.data);
};

export const uploadPartners = (id: string, partnerId: number, files: FormData): Promise<any> => {
  return API.post(`/organization/${id}/partners/${partnerId}`, files, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then((res) => res.data);
};

export const uploadInvestors = (id: string, investorId: number, files: FormData): Promise<any> => {
  return API.post(`/organization/${id}/investors/${investorId}`, files, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then((res) => res.data);
};

export const deletePartners = (id: string, partnerId: number): Promise<any> => {
  return API.delete(`/organization/${id}/partners/${partnerId}`).then((res) => res.data);
};

export const deleteInvestors = (id: string, investorId: number): Promise<any> => {
  return API.delete(`/organization/${id}/investors/${investorId}`).then((res) => res.data);
};

export const restrictOrganization = (id: number): Promise<any> => {
  return API.patch(`/organization/${id}/restrict`).then((res) => res.data);
};

export const activateOrganization = (id: number): Promise<any> => {
  return API.patch(`organization/${id}/activate`).then((res) => res.data);
};

export const deleteOrganizationStatute = (organizationId: number) => {
  return API.delete(`organization/${organizationId}/statute`).then((res) => res.data);
};

export const deleteNonPolicalAffiliationFile = (organizationId: number) => {
  return API.delete(`organization/${organizationId}/non-political-affiliation`).then(
    (res) => res.data,
  );
};

export const deleteBalanceSheetFile = (organizationId: number) => {
  return API.delete(`organization/${organizationId}/balance-sheet`).then((res) => res.data);
};

const generateOrganizationFormDataPayload = (
  update: any,
  logo?: File | null,
  organizationStatute?: File | null,
  nonPoliticalAffiliationFile?: File | null,
  balanceSheetFile?: File | null,
) => {
  let payload = new FormData();

  if (update.general) {
    payload = mapOrganizationGeneralToFormData(payload, update.general, 'general');
  }

  if (update.activity) {
    payload = mapOrganizationActivityToFormData(payload, update.activity, 'activity');
  }

  if (update.legal) {
    payload = mapOrganizationLegalToFormData(payload, update.legal, 'legal');
  }

  if (update.financial) {
    payload = mapOrganizationFinancialToFormData(payload, update.financial, 'financial');
  }

  if (update.report) {
    payload = mapEntityToFormData(payload, 'report', update.report);
  }

  // attach files
  if (logo) {
    payload.append('logo', logo);
  }

  if (organizationStatute) {
    payload.append('organizationStatute', organizationStatute);
  }

  if (nonPoliticalAffiliationFile) {
    payload.append('nonPoliticalAffiliationFile', nonPoliticalAffiliationFile);
  }

  if (balanceSheetFile) {
    payload.append('balanceSheetFile', balanceSheetFile);
  }

  return payload;
};
