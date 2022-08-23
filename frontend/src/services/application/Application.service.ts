import { AxiosResponse } from 'axios';
import API from '../API';
import { CreateApplicationDto } from './interfaces/Application.dto';
import { Application } from './interfaces/Application.interface';

export const createApplication = (
  createApplicationDto: CreateApplicationDto,
): Promise<Application> => {
  return API.post(`/application`, createApplicationDto).then(
    (res: AxiosResponse<Application>) => res.data,
  );
};
