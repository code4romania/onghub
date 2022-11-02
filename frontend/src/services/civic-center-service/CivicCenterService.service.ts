import { OrderDirection } from '../../common/enums/sort-direction.enum';
import { PaginatedEntity } from '../../common/interfaces/paginated-entity.interface';
import { IFeedback } from '../../pages/civic-center-service/interfaces/Feedback.interface';
import API from '../API';
import { AxiosResponse } from 'axios';

export const getFeedbacks = async (
  limit: number,
  page: number,
  orderBy: string,
  orderDirection: OrderDirection,
): Promise<PaginatedEntity<IFeedback>> => {
  const requestUrl = `/civic-center/feedback?limit=${limit}&page=${page}&orderBy=${orderBy}&orderDirection=${orderDirection}`;

  return API.get(requestUrl).then((res: AxiosResponse<PaginatedEntity<IFeedback>>) => res.data);
};

export const removeFeedback = async (id: number): Promise<any> => {
  return API.delete(`/civic-center/feedback/${id}`).then((res: AxiosResponse<void>) => res.data);
};
