import { useMutation, useQuery } from 'react-query';
import { OrderDirection } from '../../common/enums/sort-direction.enum';
import { PaginatedEntity } from '../../common/interfaces/paginated-entity.interface';
import {
  IApplicationRequest,
  IOrganizationRequest,
} from '../../pages/requests/interfaces/Request.interface';
import useStore from '../../store/store';
import { CreateOrganizationRequestDTO } from './interfaces/Request.dto';
import {
  abandonApplicationnRequest,
  approveApplicationnRequest,
  approveOrganizationRequest,
  createApplicationRequest,
  createOrganizationRequest,
  getApplicationRequests,
  getOrganizationRequestById,
  getRequests,
  rejectApplicationnRequest,
  rejectOrganizationRequest,
  restrictOrganizationRequest,
} from './Request.service';

// Organization
export const useCreateOrganizationRequestMutation = (onSuccess?: any, onError?: any) => {
  return useMutation(
    (request: CreateOrganizationRequestDTO) => createOrganizationRequest(request),
    {
      onSuccess,
      onError,
    },
  );
};

export const useRequestsQuery = (
  limit: number,
  page: number,
  orderBy: string,
  orderDirection: OrderDirection,
  search?: string,
  interval?: Date[],
) => {
  const { setOrganizationRequests } = useStore();
  return useQuery(
    ['requests', limit, page, orderBy, orderDirection, search, interval],
    () => getRequests(limit, page, orderBy, orderDirection, search, interval),
    {
      onSuccess: (data: PaginatedEntity<IOrganizationRequest>) => {
        setOrganizationRequests({
          items: data.items,
          meta: { ...data.meta, orderByColumn: orderBy, orderDirection },
        });
      },
      enabled: !!(limit && page && orderBy && orderDirection),
    },
  );
};

export const useApproveOrganizationRequestMutation = () => {
  return useMutation((requestId: string) => approveOrganizationRequest(requestId));
};

export const useRejectOrganizationRequestMutation = () => {
  return useMutation((requestId: string) => rejectOrganizationRequest(requestId));
};

export const useOrganizationRequest = (requestId: string) => {
  const {
    setOrganizationGeneral,
    setOrganizationActivity,
    setOrganizationFinancial,
    setOrganizationReport,
    setOrganizationLegal,
    setOrganization,
  } = useStore();
  return useQuery(['request', requestId], () => getOrganizationRequestById(requestId), {
    onSuccess: (data: IOrganizationRequest) => {
      if (data.organization) {
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
      }
    },
  });
};

export const useRestrictOrganizationRequestMutation = () => {
  return useMutation((organizationId: number) => restrictOrganizationRequest(organizationId));
};

// Application
export const useCreateApplicationRequestMutation = (onSuccess?: any, onError?: any) => {
  return useMutation((applicationId: number) => createApplicationRequest(applicationId), {
    onSuccess,
    onError,
  });
};

export const useApplicationRequestsQuery = (
  limit: number,
  page: number,
  orderBy: string,
  orderDirection: OrderDirection,
  search?: string,
  interval?: Date[],
) => {
  const { setApplicationRequests } = useStore();
  return useQuery(
    ['applications/requests', limit, page, orderBy, orderDirection, search, interval],
    () => getApplicationRequests(limit, page, orderBy, orderDirection, search, interval),
    {
      onSuccess: (data: PaginatedEntity<IApplicationRequest>) => {
        setApplicationRequests({
          items: data.items,
          meta: { ...data.meta, orderByColumn: orderBy, orderDirection },
        });
      },
      enabled: !!(limit && page && orderBy && orderDirection),
    },
  );
};

export const useApproveApplicationRequestMutation = () => {
  return useMutation((requestId: string) => approveApplicationnRequest(requestId));
};

export const useRejectApplicationRequestMutation = () => {
  return useMutation((requestId: string) => rejectApplicationnRequest(requestId));
};

export const useAbandonApplicationRequestMutation = () => {
  return useMutation((requestId: string) => abandonApplicationnRequest(requestId));
};
