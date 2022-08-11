import { AxiosResponse } from 'axios';
import API from '../API';
import { CreateRequestDTO } from './interfaces/Request.dto';
import { Request } from './interfaces/Request.interface';

export const createRequest = (createRequestDTO: CreateRequestDTO): Promise<Request> => {
  return API.post(`/requests`, createRequestDTO).then((res: AxiosResponse<Request>) => res.data);
};
