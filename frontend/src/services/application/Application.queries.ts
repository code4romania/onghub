import { useMutation, useQuery } from 'react-query';
import { OrderDirection } from '../../common/enums/sort-direction.enum';
import { PaginatedEntity } from '../../common/interfaces/paginated-entity.interface';
import { ApplicationTypeEnum } from '../../pages/apps-store/constants/ApplicationType.enum';
import useStore from '../../store/store';
import {
  createApplication,
  getApplicationById,
  getApplications,
  patchApplication,
} from './Application.service';
import { CreateApplicationDto } from './interfaces/Application.dto';
import { Application, ApplicationStatus } from './interfaces/Application.interface';

export const useCreateApplicationMutation = (onSuccess?: any, onError?: any) => {
  return useMutation((applicationDto: CreateApplicationDto) => createApplication(applicationDto), {
    onSuccess,
    onError,
  });
};

export const useApplicationsQuery = (
  limit: number,
  page: number,
  orderBy: string,
  orderDirection: OrderDirection,
  search?: string,
  status?: ApplicationStatus,
  type?: ApplicationTypeEnum,
) => {
  const { setApplications, applications } = useStore();
  return useQuery(
    ['requests', limit, page, orderBy, orderDirection, search, status, type],
    () => getApplications(limit, page, orderBy, orderDirection, search, status, type),
    {
      onSuccess: (data: PaginatedEntity<Application>) => {
        setApplications({ items: data.items, meta: { ...applications.meta, ...data.meta } });
      },
      enabled: !!(limit && page && orderBy && orderDirection),
    },
  );
};

export const useApplication = (applicationId: string) => {
  const { setSelectedApplication } = useStore();
  return useQuery(['application', applicationId], () => getApplicationById(applicationId), {
    enabled: !!applicationId,
    onSuccess: (data: Application) => {
      setSelectedApplication(data);
    },
  });
};

export const useUpdateApplicationMutation = () => {
  return useMutation(
    ({
      applicationId,
      applicationUpdatePayload,
    }: {
      applicationId: string;
      applicationUpdatePayload: Partial<Application>;
    }) => patchApplication(applicationId, applicationUpdatePayload),
  );
};
