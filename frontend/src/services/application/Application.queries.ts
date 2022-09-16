import { useMutation, useQuery } from 'react-query';
import { OrderDirection } from '../../common/enums/sort-direction.enum';
import { PaginatedEntity } from '../../common/interfaces/paginated-entity.interface';
import { ApplicationTypeEnum } from '../../pages/apps-store/constants/ApplicationType.enum';
import useStore from '../../store/store';
import {
  createApplication,
  getApplicationById,
  getApplications,
  getApplicationsForCreateUser,
  getApplicationsForEditUser,
  getMyOngApplications,
  getOngApplications,
  updateApplication,
} from './Application.service';
import { CreateApplicationDto } from './interfaces/Application.dto';
import {
  Application,
  ApplicationStatus,
  ApplicationWithOngStatus,
  ApplicationWithOngStatusDetails,
} from './interfaces/Application.interface';

export const useCreateApplicationMutation = () => {
  return useMutation(({ application, logo }: { application: CreateApplicationDto; logo: File }) =>
    createApplication(application, logo),
  );
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

// As an Admin you will receive all the Applications + Status (your relationship with that application -> ONGApp table entry).
export const useOngApplicationsQuery = () => {
  const { setOngApplications } = useStore();
  return useQuery(['ongApplications'], () => getOngApplications(), {
    onSuccess: (data: ApplicationWithOngStatus[]) => {
      setOngApplications(data);
    },
  });
};

// As an Admin you will receive your Applications (the ones added in your organization)
export const useMyOngApplicationsQuery = () => {
  const { setOngApplications } = useStore();
  return useQuery(['myOngApplications'], () => getMyOngApplications(), {
    onSuccess: (data: ApplicationWithOngStatus[]) => {
      setOngApplications(data);
    },
  });
};

// As an SuperAdmin you will receive all the Applications (regardless of any status).
export const useApplicationQuery = (applicationId: string) => {
  const { setSelectedApplication } = useStore();
  return useQuery(['application', applicationId], () => getApplicationById(applicationId), {
    enabled: !!applicationId,
    onSuccess: (data: ApplicationWithOngStatusDetails) => {
      setSelectedApplication(data);
    },
  });
};

export const userApplicationsForCreateUser = () => {
  return useQuery(['application'], () => getApplicationsForCreateUser());
};

export const useApplicationsForEditUserQuery = (userId: string) => {
  return useQuery(['application', userId], () => getApplicationsForEditUser(userId), {
    enabled: !!userId,
  });
};

export const useUpdateApplicationMutation = () => {
  return useMutation(
    ({
      applicationId,
      applicationUpdatePayload,
      logo,
    }: {
      applicationId: string;
      applicationUpdatePayload: Partial<CreateApplicationDto>;
      logo?: File;
    }) => updateApplication(applicationId, applicationUpdatePayload, logo),
  );
};
