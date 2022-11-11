import { useMutation, useQuery } from 'react-query';
import { OrderDirection } from '../../common/enums/sort-direction.enum';
import { PaginatedEntity } from '../../common/interfaces/paginated-entity.interface';
import { IFeedback } from '../../pages/civic-center-service/interfaces/Feedback.interface';
import useStore from '../../store/store';
import {
  createCivicCenterService,
  deleteCCService,
  disableCCService,
  enableCCService,
  getCivicCenterServiceById,
  getCivicCenterServices,
  getFeedbacks,
  removeFeedback,
  updateCivicCenterService,
} from './CivicCenterService.service';
import { CivicCenterServicePayload } from './interfaces/civic-center-service-payload.interface';

export const useCivicCenterServicesQuery = () => {
  return useQuery(['civic-center-services'], () => getCivicCenterServices(), { retry: 0 });
};

export const useGetCivicCenterServiceQuery = (civicCenterServiceId: string) => {
  return useQuery(
    ['civic-center-service', civicCenterServiceId],
    () => getCivicCenterServiceById(civicCenterServiceId),
    {
      enabled: !!civicCenterServiceId,
      retry: 0,
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

export const useEnableCCServiceMutation = () => {
  return useMutation((id: number) => enableCCService(id));
};

export const useDisableCCServiceMutation = () => {
  return useMutation((id: number) => disableCCService(id));
};

export const useDeleteCCServiceMutation = () => {
  return useMutation((id: number) => deleteCCService(id));
};

export const useFeedbackQuerry = (
  limit: number,
  page: number,
  orderBy: string,
  orderDirection: OrderDirection,
) => {
  const { setFeedbacks } = useStore();

  return useQuery(
    ['civic-center/feedback', limit, page, orderBy, orderDirection],
    () => getFeedbacks(limit, page, orderBy, orderDirection),
    {
      onSuccess: (data: PaginatedEntity<IFeedback>) => {
        setFeedbacks({
          items: data.items,
          meta: { ...data.meta, orderByColumn: orderBy, orderDirection },
        });
      },
      enabled: !!(limit && page && orderBy && orderDirection),
      retry: 0,
    },
  );
};

export const useRemoveFeedbackMutation = () => {
  return useMutation((id: number) => removeFeedback(id));
};
