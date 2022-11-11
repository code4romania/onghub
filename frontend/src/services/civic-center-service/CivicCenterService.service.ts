import { AxiosResponse } from 'axios';
import { OrderDirection } from '../../common/enums/sort-direction.enum';
import { PaginatedEntity } from '../../common/interfaces/paginated-entity.interface';
import { IFeedback } from '../../pages/civic-center-service/interfaces/Feedback.interface';
import API from '../API';
import { parseCivicServiceFormDataToPaylod } from './CivicCenterService.helper';
import { CivicCenterServicePayload } from './interfaces/civic-center-service-payload.interface';
import { CivicCenterService } from './interfaces/civic-center-service.interface';

export const createCivicCenterService = (
  civicCenterServicePayload: CivicCenterServicePayload,
): Promise<CivicCenterService> => {
  return API.post(
    `/civic-center/services`,
    parseCivicServiceFormDataToPaylod(civicCenterServicePayload),
  ).then((res: AxiosResponse<CivicCenterService>) => res.data);
};

export const updateCivicCenterService = (
  id: string,
  civicCenterPayload: Partial<CivicCenterServicePayload>,
): Promise<CivicCenterService> => {
  return API.patch(
    `/civic-center/services/${id}`,
    parseCivicServiceFormDataToPaylod(civicCenterPayload),
  ).then((res: AxiosResponse<CivicCenterService>) => res.data);
};

export const getCivicCenterServiceById = (id: string): Promise<CivicCenterService> => {
  return API.get(`/civic-center/services/${id}`).then(
    (res: AxiosResponse<CivicCenterService>) => res.data,
  );
};

export const getCivicCenterServices = (): Promise<CivicCenterService[]> => {
  return API.get('civic-center/services').then(
    (res: AxiosResponse<CivicCenterService[]>) => res.data,
  );
};

export const getFeedbacks = async (
  limit: number,
  page: number,
  orderBy: string,
  orderDirection: OrderDirection,
): Promise<PaginatedEntity<IFeedback>> => {
  const requestUrl = `/civic-center/feedback?limit=${limit}&page=${page}&orderBy=${orderBy}&orderDirection=${orderDirection}`;

  return API.get(requestUrl).then((res: AxiosResponse<PaginatedEntity<IFeedback>>) => res.data);
};

export const removeFeedback = async (id: number): Promise<void> => {
  return API.delete(`/civic-center/feedback/${id}`).then((res: AxiosResponse<void>) => res.data);
};
