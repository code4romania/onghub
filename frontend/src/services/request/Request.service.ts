import { AxiosResponse } from 'axios';
import { formatISO9075 } from 'date-fns';
import { OrderDirection } from '../../common/enums/sort-direction.enum';
import { PaginatedEntity } from '../../common/interfaces/paginated-entity.interface';
import {
  IApplicationRequest,
  IOrganizationRequest,
} from '../../pages/requests/interfaces/Request.interface';
import API from '../API';
import { CreateOrganizationRequestDTO } from './interfaces/Request.dto';
import { Request } from './interfaces/Request.interface';

// Organization
export const createOrganizationRequest = (
  createRequestDTO: CreateOrganizationRequestDTO,
): Promise<Request> => {
  return API.post(`/organization/request`, createRequestDTO).then(
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
  return API.post(`/application/${applicationId}/request`).then(
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
