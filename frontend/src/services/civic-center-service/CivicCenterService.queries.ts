import { useMutation } from 'react-query';
import { createCivicCenterService } from './CivicCenterService.service';
import { CivicCenterServicePayload } from './interfaces/civic-center-service-payload.interface';

export const useCreateCivicCenterServiceMutation = () => {
  return useMutation((createCivicCenterPayload: CivicCenterServicePayload) =>
    createCivicCenterService(createCivicCenterPayload),
  );
};
