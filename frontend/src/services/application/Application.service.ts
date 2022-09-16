import { AxiosResponse } from 'axios';
import { OrderDirection } from '../../common/enums/sort-direction.enum';
import { cleanupPayload } from '../../common/helpers/format.helper';
import { PaginatedEntity } from '../../common/interfaces/paginated-entity.interface';
import { ApplicationTypeEnum } from '../../pages/apps-store/constants/ApplicationType.enum';
import API from '../API';
import { CreateApplicationDto } from './interfaces/Application.dto';
import {
  Application,
  ApplicationAccess,
  ApplicationStatus,
  ApplicationWithOngStatus,
  ApplicationWithOngStatusDetails,
} from './interfaces/Application.interface';

export const createApplication = (
  createApplicationDto: CreateApplicationDto,
  logo: File,
): Promise<Application> => {
  const payload = generateApplicationFormDataPayload(createApplicationDto, logo);
  // send request
  return API.post(`/application`, payload, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then((res: AxiosResponse<Application>) => res.data);
};

export const updateApplication = (
  applicationId: string,
  applicationUpdatePayload: Partial<CreateApplicationDto>,
  logo: File,
): Promise<Application> => {
  const payload = generateApplicationFormDataPayload(applicationUpdatePayload, logo);
  return API.patch(`/application/${applicationId}`, payload, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then((res) => res.data);
};

export const getApplications = async (
  limit: number,
  page: number,
  orderBy: string,
  orderDirection: OrderDirection,
  search?: string,
  status?: ApplicationStatus,
  type?: ApplicationTypeEnum,
): Promise<PaginatedEntity<Application>> => {
  let requestUrl = `/application?limit=${limit}&page=${page}&orderBy=${orderBy}&orderDirection=${orderDirection}`;

  if (search) requestUrl = `${requestUrl}&search=${search}`;

  if (status) requestUrl = `${requestUrl}&status=${status}`;

  if (type) requestUrl = `${requestUrl}&type=${type}`;

  return API.get(requestUrl).then((res) => res.data);
};

// Returns all the applications with ONGApp table entry as status (your ONG relationship with that Application)
export const getOngApplications = async (): Promise<PaginatedEntity<ApplicationWithOngStatus>> => {
  const requestUrl = `/organization/application`;
  return API.get(requestUrl).then((res) => res.data);
};

// Returns all the applications added to your ONG.
export const getMyOngApplications = async (): Promise<
  PaginatedEntity<ApplicationWithOngStatus>
> => {
  const requestUrl = `/organization/application/profile`;
  return API.get(requestUrl).then((res) => res.data);
};

export const getApplicationsForCreateUser = async (): Promise<ApplicationAccess[]> => {
  return API.get('/application/organization').then((res) => res.data);
};

export const getApplicationsForEditUser = async (userId: string): Promise<ApplicationAccess[]> => {
  return API.get(`/application/organization/${userId}`).then((res) => res.data);
};

export const getOngApplicationById = (
  applicationId: string,
): Promise<ApplicationWithOngStatusDetails> => {
  return API.get(`/organization/application/${applicationId}`).then((res) => res.data);
};

export const getApplicationById = (applicationId: string): Promise<Application> => {
  return API.get(`/application/${applicationId}`).then((res) => res.data);
};

const generateApplicationFormDataPayload = (
  applicationDto: Partial<CreateApplicationDto>,
  logo: File,
): FormData => {
  // we remove the logo and steps
  const { steps, ...data } = applicationDto;
  // create form data payload
  const payload = new FormData();
  for (const prop in cleanupPayload(data)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    payload.append(prop, (data as any)[prop] as string);
  }
  // map steps correcly as array
  steps?.forEach((step: { item: string }) => {
    payload.append('steps[]', step.item);
  });

  // check if logo was attached and add file
  if (logo) {
    payload.append('logo', logo);
  }

  return payload;
};
