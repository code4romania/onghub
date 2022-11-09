import { AxiosResponse } from 'axios';
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
