import { AxiosResponse } from 'axios';
import { formatISO9075 } from 'date-fns';
import { OrderDirection } from '../../common/enums/sort-direction.enum';
import { PaginatedEntity } from '../../common/interfaces/paginated-entity.interface';
import { IRequest } from '../../pages/requests/interfaces/Request.interface';
import API from '../API';
import { CreateRequestDTO } from './interfaces/Request.dto';
import { Request } from './interfaces/Request.interface';

export const createRequest = (createRequestDTO: CreateRequestDTO): Promise<Request> => {
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

export const approveRequest = (requestId: string) => {
  return API.patch(`/requests/${requestId}/approve`);
};

export const rejectRequest = (requestId: string) => {
  return API.patch(`/requests/${requestId}/reject`);
};

export const getRequestById = (requestId: string) => {
  return API.get(`/requests/${requestId}`).then((res) => res.data);
};
