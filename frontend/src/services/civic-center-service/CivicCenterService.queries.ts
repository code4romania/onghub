import { useMutation, useQuery } from 'react-query';
import { OrderDirection } from '../../common/enums/sort-direction.enum';
import { PaginatedEntity } from '../../common/interfaces/paginated-entity.interface';
import { IFeedback } from '../../pages/civic-center-service/interfaces/Feedback.interface';
import useStore from '../../store/store';
import {
  createCivicCenterService,
  getCivicCenterServiceById,
  getFeedbacks,
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
    },
  );
};
