import { AxiosResponse } from 'axios';
import { formatISO9075 } from 'date-fns';
import { OrderDirection } from '../../common/enums/sort-direction.enum';
import { cleanupPayload } from '../../common/helpers/format.helper';
import { PaginatedEntity } from '../../common/interfaces/paginated-entity.interface';
import { Person } from '../../common/interfaces/person.interface';
import {
  ICreateOrganizationActivity,
  ICreateOrganizationGeneral,
  ICreateOrganizationLegal,
  ICreateOrganizationPayload,
  ICreateOrganizationUser,
} from '../../pages/create-organziation/interfaces/CreateOrganization.interface';
import { Contact } from '../../pages/organization/interfaces/Contact.interface';
import {
  IApplicationRequest,
  IOrganizationRequest,
} from '../../pages/requests/interfaces/Request.interface';
import API from '../API';
import { ValidateCreateOrganizationRequest } from './interfaces/Request.dto';
import { Request } from './interfaces/Request.interface';

// Organization
export const createOrganizationRequest = (
  createRequestDTO: ICreateOrganizationPayload,
  logo?: File | null,
  organizationStatute?: File | null,
): Promise<Request> => {
  // create form data payload
  let payload = new FormData();
  payload = mapAdminToFormData(payload, createRequestDTO.admin);
  payload = mapOrganizationGeneralToFormDara(payload, createRequestDTO.general);
  payload = mapOrganizationActivityToFormData(payload, createRequestDTO.activity);
  payload = mapOrganizationLegalToFormData(payload, createRequestDTO.legal);

  // attach files
  if (logo) {
    payload.append('logo', logo);
  }

  if (organizationStatute) {
    payload.append('organizationStatute', organizationStatute);
  }

  return API.post(`/organization/request`, payload, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then((res: AxiosResponse<Request>) => res.data);
};

export const validateOrganizationRequest = async (
  createOrganizationRequestDTO: Partial<ValidateCreateOrganizationRequest>,
) => {
  return API.post('organization/request/validate', createOrganizationRequestDTO).then(
    (res) => res.data,
  );
};

export const getRequests = async (
  limit: number,
  page: number,
  orderBy: string,
  orderDirection: OrderDirection,
  search?: string,
  interval?: Date[],
): Promise<PaginatedEntity<IOrganizationRequest>> => {
  let requestUrl = `/organization/request?limit=${limit}&page=${page}&orderBy=${orderBy}&orderDirection=${orderDirection}`;

  if (search) requestUrl = `${requestUrl}&search=${search}`;

  if (interval && interval.length === 2)
    requestUrl = `${requestUrl}&start=${formatISO9075(interval[0])}&end=${formatISO9075(
      interval[1],
    )}`;

  return API.get(requestUrl).then((res) => res.data);
};

export const approveOrganizationRequest = (requestId: string) => {
  return API.patch(`/organization/request/${requestId}/approve`);
};

export const rejectOrganizationRequest = (requestId: string) => {
  return API.patch(`/organization/request/${requestId}/reject`);
};

export const getOrganizationRequestById = (requestId: string): Promise<Request> => {
  return API.get(`/organization/request/${requestId}`).then((res) => res.data);
};

// Application
export const createApplicationRequest = (applicationId: number): Promise<Request> => {
  return API.post(`organization/application/${applicationId}/request`).then(
    (res: AxiosResponse<Request>) => res.data,
  );
};

export const abandonApplicationnRequest = (applicationId: string) => {
  return API.delete(`/organization/application/${applicationId}/request`);
};

export const approveApplicationnRequest = (requestId: string) => {
  return API.patch(`/application/request/${requestId}/approve`);
};

export const rejectApplicationnRequest = (requestId: string) => {
  return API.patch(`/application/request/${requestId}/reject`);
};

export const getApplicationRequestById = (requestId: string) => {
  return API.get(`/application/request/${requestId}`).then((res) => res.data);
};

export const getApplicationRequests = async (
  limit: number,
  page: number,
  orderBy: string,
  orderDirection: OrderDirection,
  search?: string,
  interval?: Date[],
): Promise<PaginatedEntity<IApplicationRequest>> => {
  let requestUrl = `/application/request?limit=${limit}&page=${page}&orderBy=${orderBy}&orderDirection=${orderDirection}`;

  if (search) requestUrl = `${requestUrl}&search=${search}`;

  if (interval && interval.length === 2)
    requestUrl = `${requestUrl}&start=${formatISO9075(interval[0])}&end=${formatISO9075(
      interval[1],
    )}`;

  return API.get(requestUrl).then((res) => res.data);
};

const mapAdminToFormData = (payload: FormData, admin: ICreateOrganizationUser): FormData => {
  return mapEntityToFormData(payload, 'admin', admin);
};

const mapOrganizationGeneralToFormDara = (
  payload: FormData,
  general: ICreateOrganizationGeneral,
): FormData => {
  const { contact, city, county, ...organizationGeneral } = general;

  const organizationGeneralKey = 'organization[general]';

  // map basic organization general fields
  const organizationGeneralPayload = mapEntityToFormData(
    payload,
    organizationGeneralKey,
    organizationGeneral,
  );

  // mapt county id and city id
  organizationGeneralPayload.append(`${organizationGeneralKey}[countyId]`, county?.id.toString());
  organizationGeneralPayload.append(`${organizationGeneralKey}[cityId]`, city?.id.toString());

  // map contact
  const organizationWithContactPayload = mapEntityToFormData(
    organizationGeneralPayload,
    `${organizationGeneralKey}[contact]`,
    contact,
  );

  return organizationWithContactPayload;
};

const mapOrganizationActivityToFormData = (
  payload: FormData,
  activity: ICreateOrganizationActivity,
): FormData => {
  const { domains, federations, coalitions, branches, cities, regions, ...organizationActivity } =
    activity;

  const organizationActivityKey = 'organization[activity]';

  // map all arays first
  branches?.forEach((branch: { label: string; value: number }) => {
    payload.append(`${organizationActivityKey}[branches][]`, branch.value.toString());
  });

  cities?.forEach((city: { label: string; value: number }) => {
    payload.append(`${organizationActivityKey}[cities][]`, city.value.toString());
  });

  coalitions?.forEach((coalition: { label: string; value: number }) => {
    payload.append(`${organizationActivityKey}[coalitions][]`, coalition.value.toString());
  });

  federations?.forEach((federation: { label: string; value: number }) => {
    payload.append(`${organizationActivityKey}[federations][]`, federation.value.toString());
  });

  regions?.forEach((region: { label: string; value: number }) => {
    payload.append(`${organizationActivityKey}[regions][]`, region.value.toString());
  });

  domains?.forEach((domain: number) => {
    payload.append(`${organizationActivityKey}[domains][]`, domain.toString());
  });

  return mapEntityToFormData(payload, organizationActivityKey, organizationActivity);
};

const mapOrganizationLegalToFormData = (payload: FormData, legal: ICreateOrganizationLegal) => {
  const { directors, legalReprezentative, others } = legal;

  const organizationActivityKey = 'organization[legal]';

  let organizationLegalUpdated = mapEntityToFormData(
    payload,
    `${organizationActivityKey}[legalReprezentative]`,
    legalReprezentative,
  );

  directors.forEach((director: Contact, index: number) => {
    organizationLegalUpdated = mapEntityToFormData(
      organizationLegalUpdated,
      `${organizationActivityKey}[directors][${index}]`,
      director,
    );
  });

  others.forEach((other: Person, index: number) => {
    organizationLegalUpdated = mapEntityToFormData(
      organizationLegalUpdated,
      `${organizationActivityKey}[others][${index}]`,
      other,
    );
  });

  return organizationLegalUpdated;
};

const mapEntityToFormData = (payload: FormData, formdDataKey: string, data: any): FormData => {
  for (const prop in cleanupPayload(data)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    payload.append(`${formdDataKey}[${prop}]`, (data as any)[prop] as string);
  }
  return payload;
};
