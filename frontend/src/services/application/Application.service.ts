import { AxiosResponse } from 'axios';
import { OrderDirection } from '../../common/enums/sort-direction.enum';
import { PaginatedEntity } from '../../common/interfaces/paginated-entity.interface';
import { ApplicationTypeEnum } from '../../pages/apps-store/constants/ApplicationType.enum';
import API from '../API';
import { CreateApplicationDto } from './interfaces/Application.dto';
import {
  Application,
  ApplicationResponse,
  ApplicationStatus,
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

export const getApplicationById = (applicationId: string): Promise<ApplicationResponse> => {
  return API.get(`/application/ong/${applicationId}`).then((res) => {
    // TEMPORARY
    if (res.data.organizationId) {
      return res.data;
    } else {
      return { application: res.data, status: null };
    }
  });
};

export const patchApplication = (
  applicationId: string,
  applicationUpdatePayload: Partial<Application>,
): Promise<Application> => {
  return API.patch(`/application/${applicationId}`, applicationUpdatePayload).then(
    (res) => res.data,
  );
};

// Temporary
// export const adaptApp = (application: Application): ApplicationResponse => {
//   return {
//     application,
//     // status: ApplicationPermission.RESTRICTED,
//     // status: ApplicationPermission.ACTIVE,
//   };
// };
