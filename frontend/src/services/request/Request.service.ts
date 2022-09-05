import { AxiosResponse } from 'axios';
import { formatISO9075 } from 'date-fns';
import { OrderDirection } from '../../common/enums/sort-direction.enum';
import { PaginatedEntity } from '../../common/interfaces/paginated-entity.interface';
import { IRequest } from '../../pages/requests/interfaces/Request.interface';
import API from '../API';
import {
  CreateApplicationRequestDTO,
  CreateOrganizationRequestDTO,
} from './interfaces/Request.dto';
import { Request } from './interfaces/Request.interface';

// Organization
export const createOrganizationRequest = (
  createRequestDTO: CreateOrganizationRequestDTO,
): Promise<Request> => {
  return API.post(`/requests/organization`, createRequestDTO).then(
    (res: AxiosResponse<Request>) => res.data,
  );
};

export const getRequests = async (
  limit: number,
  page: number,
  orderBy: string,
  orderDirection: OrderDirection,
  search?: string,
  interval?: Date[],
): Promise<PaginatedEntity<IRequest>> => {
  let requestUrl = `/requests?limit=${limit}&page=${page}&orderBy=${orderBy}&orderDirection=${orderDirection}`;

  if (search) requestUrl = `${requestUrl}&search=${search}`;

  if (interval && interval.length === 2)
    requestUrl = `${requestUrl}&start=${formatISO9075(interval[0])}&end=${formatISO9075(
      interval[1],
    )}`;

  return API.get(requestUrl).then((res) => res.data);
};

export const approveOrganizationRequest = (requestId: string) => {
  return API.patch(`/requests/organization/${requestId}/approve`);
};

export const rejectOrganizationRequest = (requestId: string) => {
  return API.patch(`/requests/organization/${requestId}/reject`);
};

export const getOrganizationRequestById = (requestId: string): Promise<Request> => {
  return API.get(`/requests/organization/${requestId}`).then((res) => res.data);
};

// Application

export const createApplicationRequest = (
  createRequestDTO: CreateApplicationRequestDTO,
): Promise<Request> => {
  return API.post(`/requests/application`, createRequestDTO).then(
    (res: AxiosResponse<Request>) => res.data,
  );
};

export const approveApplicationnRequest = (requestId: string) => {
  return API.patch(`/requests/application/${requestId}/approve`);
};

export const rejectApplicationnRequest = (requestId: string) => {
  return API.patch(`/requests/application/${requestId}/reject`);
};

export const getApplicationRequestById = (requestId: string) => {
  return API.get(`/requests/application/${requestId}`).then((res) => res.data);
};

export const getApplicationRequests = async (
  limit: number,
  page: number,
  orderBy: string,
  orderDirection: OrderDirection,
  search?: string,
  interval?: Date[],
): Promise<PaginatedEntity<IRequest>> => {
  let requestUrl = `/requests/application?limit=${limit}&page=${page}&orderBy=${orderBy}&orderDirection=${orderDirection}`;

  if (search) requestUrl = `${requestUrl}&search=${search}`;

  if (interval && interval.length === 2)
    requestUrl = `${requestUrl}&start=${formatISO9075(interval[0])}&end=${formatISO9075(
      interval[1],
    )}`;

  return API.get(requestUrl).then((res) => res.data);
};
