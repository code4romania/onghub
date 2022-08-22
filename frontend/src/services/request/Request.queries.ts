import { useMutation, useQuery } from 'react-query';
import { OrderDirection } from '../../common/enums/sort-direction.enum';
import { PaginatedEntity } from '../../common/interfaces/paginated-entity.interface';
import { IRequest } from '../../pages/requests/interfaces/Request.interface';
import useStore from '../../store/store';
import { CreateRequestDTO } from './interfaces/Request.dto';
import {
  approveRequest,
  createRequest,
  getRequestById,
  getRequests,
  rejectRequest,
} from './Request.service';

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
  const { setRequests, requests } = useStore();
  return useQuery(
    ['users', limit, page, orderBy, orderDirection, search, interval],
    () => getRequests(limit, page, orderBy, orderDirection, search, interval),
    {
      onSuccess: (data: PaginatedEntity<IRequest>) => {
        setRequests({ items: data.items, meta: { ...requests.meta, ...data.meta } });
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

export const useRequest = (requestId: string) => {
  const {
    setOrganizationGeneral,
    setOrganizationActivity,
    setOrganizationFinancial,
    setOrganizationReport,
    setOrganizationLegal,
    setOrganization,
  } = useStore();
  return useQuery(['request', requestId], () => getRequestById(requestId), {
    onSuccess: (data: IRequest) => {
      const {
        organizationGeneral,
        organizationActivity,
        organizationFinancial,
        organizationLegal,
        organizationReport,
        ...organization
      } = data.organization;

      setOrganization(organization);
      setOrganizationGeneral(organizationGeneral);
      setOrganizationActivity(organizationActivity);
      setOrganizationFinancial(organizationFinancial);
      setOrganizationLegal(organizationLegal);
      setOrganizationReport(organizationReport);
    },
  });
};
