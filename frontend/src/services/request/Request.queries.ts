import { useMutation, useQuery } from 'react-query';
import { OrderDirection } from '../../common/enums/sort-direction.enum';
import { PaginatedEntity } from '../../common/interfaces/paginated-entity.interface';
import { IRequest } from '../../pages/requests/interfaces/Request.interface';
import useStore from '../../store/store';
import { CreateRequestDTO } from './interfaces/Request.dto';
import { createRequest, getRequests } from './Request.service';

export const useCreateRequestMutation = (onSuccess?: any, onError?: any) => {
  return useMutation((request: CreateRequestDTO) => createRequest(request), { onSuccess, onError });
};

export const useRequestsQuery = (
  limit: number,
  page: number,
  orderBy: string,
  orderDirection: OrderDirection,
) => {
  const { setRequests } = useStore();
  return useQuery(
    ['requests', limit, page, orderBy, orderDirection],
    () => getRequests(limit, page, orderBy, orderDirection),
    {
      onSuccess: (data: PaginatedEntity<IRequest>) => {
        setRequests(data);
      },
      enabled: !!(limit && page && orderBy && orderDirection),
    },
  );
};
