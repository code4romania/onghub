import { useMutation, useQuery } from 'react-query';
import { OrderDirection } from '../../common/enums/sort-direction.enum';
import { PaginatedEntity } from '../../common/interfaces/paginated-entity.interface';
import { IRequest } from '../../pages/requests/interfaces/Request.interface';
import useStore from '../../store/store';
import { CreateRequestDTO } from './interfaces/Request.dto';
import { approveRequest, createRequest, getRequests, rejectRequest } from './Request.service';

export const useCreateRequestMutation = (onSuccess?: any, onError?: any) => {
  return useMutation((request: CreateRequestDTO) => createRequest(request), { onSuccess, onError });
};

export const useRequestsQuery = (
  limit: number,
  page: number,
  orderBy: string,
  orderDirection: OrderDirection,
  search?: string,
  interval?: Date[],
) => {
  const { setRequests } = useStore();
  return useQuery(
    ['users', limit, page, orderBy, orderDirection, search, interval],
    () => getRequests(limit, page, orderBy, orderDirection, search, interval),
    {
      onSuccess: (data: PaginatedEntity<IRequest>) => {
        setRequests(data);
      },
      enabled: !!(limit && page && orderBy && orderDirection),
    },
  );
};

export const useApproveRequestMutation = () => {
  return useMutation((requestId: string) => approveRequest(requestId));
};

export const useRejectRequestMutation = () => {
  return useMutation((requestId: string) => rejectRequest(requestId));
};
