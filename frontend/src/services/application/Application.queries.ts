import { useMutation, useQuery } from 'react-query';
import { OrderDirection } from '../../common/enums/sort-direction.enum';
import { PaginatedEntity } from '../../common/interfaces/paginated-entity.interface';
import { ApplicationTypeEnum } from '../../pages/apps-store/constants/ApplicationType.enum';
import { UserRole } from '../../pages/users/enums/UserRole.enum';
import useStore from '../../store/store';
import {
  createApplication,
  getApplicationById,
  getApplications,
  getOngApplicationById,
  getOngApplications,
  patchApplication,
} from './Application.service';
import { CreateApplicationDto } from './interfaces/Application.dto';
import {
  Application,
  ApplicationStatus,
  ApplicationWithOngStatus,
  ApplicationWithOngStatusDetails,
} from './interfaces/Application.interface';

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
    ['applications', limit, page, orderBy, orderDirection, search, status, type],
    () => getApplications(limit, page, orderBy, orderDirection, search, status, type),
    {
      onSuccess: (data: PaginatedEntity<Application>) => {
        setApplications({ items: data.items, meta: { ...applications.meta, ...data.meta } });
      },
      enabled: !!(limit && page && orderBy && orderDirection),
    },
  );
};

export const useOngApplicationsQuery = () => {
  const { setOngApplications } = useStore();
  return useQuery(['ongApplications'], () => getOngApplications(), {
    onSuccess: (data: ApplicationWithOngStatus) => {
      setOngApplications(data);
    },
  });
};

export const useApplicationQueryByRole = (applicationId: string, role: UserRole) => {
  if (role === UserRole.SUPER_ADMIN) {
    return useApplicationQuery(applicationId);
  }

  return useOngApplicationQuery(applicationId);
};

export const useOngApplicationQuery = (applicationId: string) => {
  const { setSelectedOngApplication } = useStore();
  return useQuery(['ongApplication', applicationId], () => getOngApplicationById(applicationId), {
    enabled: !!applicationId,
    onSuccess: (data: ApplicationWithOngStatusDetails) => {
      setSelectedOngApplication(data);
    },
  });
};

export const useApplicationQuery = (applicationId: string) => {
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
