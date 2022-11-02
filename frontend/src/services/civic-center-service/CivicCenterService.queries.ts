import { useMutation, useQuery } from 'react-query';
import { OrderDirection } from '../../common/enums/sort-direction.enum';
import { PaginatedEntity } from '../../common/interfaces/paginated-entity.interface';
import { IFeedback } from '../../pages/civic-center-service/interfaces/Feedback.interface';
import useStore from '../../store/store';
import { getFeedbacks, removeFeedback } from './CivicCenterService.service';

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

export const useRemoveFeedbackMutation = () => {
  return useMutation((id: number) => removeFeedback(id));
};
