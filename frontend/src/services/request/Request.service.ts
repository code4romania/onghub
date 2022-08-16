import { AxiosResponse } from 'axios';
import { OrderDirection } from '../../common/enums/sort-direction.enum';
import { PaginatedEntity } from '../../common/interfaces/paginated-entity.interface';
import { IRequest } from '../../pages/requests/interfaces/Request.interface';
import API from '../API';
import { CreateRequestDTO } from './interfaces/Request.dto';
import { Request } from './interfaces/Request.interface';

export const createRequest = (createRequestDTO: CreateRequestDTO): Promise<Request> => {
  return API.post(`/requests`, createRequestDTO).then((res: AxiosResponse<Request>) => res.data);
};

export const getRequests = async (
  limit: number,
  page: number,
  orderBy: string,
  orderDirection: OrderDirection,
): Promise<PaginatedEntity<IRequest>> => {
  return API.get(
    `/requests?limit=${limit}&page=${page}&orderBy=${orderBy}&orderDirection=${orderDirection}`,
  ).then((res) => res.data);
};
