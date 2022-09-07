import { AxiosResponse } from 'axios';
import { OrderDirection } from '../../common/enums/sort-direction.enum';
import { PaginatedEntity } from '../../common/interfaces/paginated-entity.interface';
import { ApplicationTypeEnum } from '../../pages/apps-store/constants/ApplicationType.enum';
import API from '../API';
import { CreateApplicationDto } from './interfaces/Application.dto';
import {
  Application,
  ApplicationStatus,
  ApplicationWithOngStatus,
  ApplicationWithOngStatusDetails,
} from './interfaces/Application.interface';

export const createApplication = (
  createApplicationDto: CreateApplicationDto,
): Promise<Application> => {
  return API.post(`/application`, createApplicationDto).then(
    (res: AxiosResponse<Application>) => res.data,
  );
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

export const getOngApplications = async (): Promise<PaginatedEntity<ApplicationWithOngStatus>> => {
  const requestUrl = `/organization/application`;
  return API.get(requestUrl).then((res) => res.data);
};

export const getMyOngApplications = async (): Promise<
  PaginatedEntity<ApplicationWithOngStatus>
> => {
  const requestUrl = `/organization/application/profile`;
  return API.get(requestUrl).then((res) => res.data);
};

export const getOngApplicationById = (
  applicationId: string,
): Promise<ApplicationWithOngStatusDetails> => {
  return API.get(`/organization/application/${applicationId}`).then((res) => res.data);
};

export const getApplicationById = (applicationId: string): Promise<Application> => {
  return API.get(`/application/${applicationId}`).then((res) => res.data);
};

export const patchApplication = (
  applicationId: string,
  applicationUpdatePayload: Partial<Application>,
): Promise<Application> => {
  return API.patch(`/application/${applicationId}`, applicationUpdatePayload).then(
    (res) => res.data,
  );
};
