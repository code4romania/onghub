import { useMutation, useQuery } from 'react-query';
import {
  createCivicCenterService,
  getCivicCenterServiceById,
  updateCivicCenterService,
} from './CivicCenterService.service';
import { CivicCenterServicePayload } from './interfaces/civic-center-service-payload.interface';

export const useGetCivicCenterServiceQuery = (civicCenterServiceId: string) => {
  return useQuery(
    ['civic-center-service', civicCenterServiceId],
    () => getCivicCenterServiceById(civicCenterServiceId),
    {
      enabled: !!civicCenterServiceId,
    },
  );
};

export const useCreateCivicCenterServiceMutation = () => {
  return useMutation((createCivicCenterPayload: CivicCenterServicePayload) =>
    createCivicCenterService(createCivicCenterPayload),
  );
};

export const useEditCivicCenterServiceMutation = () => {
  return useMutation(({ id, data }: { id: string; data: Partial<CivicCenterServicePayload> }) =>
    updateCivicCenterService(id, data),
  );
};
