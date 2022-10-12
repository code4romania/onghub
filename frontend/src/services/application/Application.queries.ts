import { useMutation, useQuery } from 'react-query';
import { OrderDirection } from '../../common/enums/sort-direction.enum';
import { PaginatedEntity } from '../../common/interfaces/paginated-entity.interface';
import { ApplicationTypeEnum } from '../../pages/apps-store/constants/ApplicationType.enum';
import { OngApplicationStatus } from '../../pages/requests/interfaces/OngApplication.interface';
import useStore from '../../store/store';
import {
  activateApplication,
  createApplication,
  deactivateApplication,
  getApplicationById,
  getApplicationOrganizations,
  getApplications,
  getApplicationsForCreateUser,
  getApplicationsForEditUser,
  getMyOngApplications,
  getOngApplications,
  removeApplication,
  removeOngApplication,
  removeOngApplicationRequest,
  restoreApplication,
  restrictApplication,
  updateApplication,
} from './Application.service';
import { CreateApplicationDto } from './interfaces/Application.dto';
import {
  Application,
  ApplicationOrganization,
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

// As an SuperAdmin get NGO LIST for an organization
export const useApplicationOrganizationQuery = (
  applicationId: string,
  limit: number,
  page: number,
  orderBy: string,
  orderDirection: OrderDirection,
  search?: string,
  status?: OngApplicationStatus,
) => {
  const { setApplicationOrganizations, applicationOrganizations } = useStore();
  return useQuery(
    ['application', applicationId, limit, page, orderBy, orderDirection, search, status],
    () =>
      getApplicationOrganizations(
        applicationId,
        limit,
        page,
        orderBy,
        orderDirection,
        search,
        status,
      ),
    {
      enabled: !!(!!applicationId && limit && page && orderBy && orderDirection),
      onSuccess: (data: PaginatedEntity<ApplicationOrganization>) => {
        setApplicationOrganizations({
          items: data.items,
          meta: { ...applicationOrganizations.meta, ...data.meta },
        });
      },
    },
  );
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

export const useActivateApplication = () => {
  return useMutation(({ applicationId }: { applicationId: string }) =>
    activateApplication(applicationId),
  );
};

export const useDectivateApplication = () => {
  return useMutation(({ applicationId }: { applicationId: string }) =>
    deactivateApplication(applicationId),
  );
};

export const useRestrictApplicationMutation = () => {
  return useMutation(
    ({ applicationId, organizationId }: { applicationId: number; organizationId: string }) =>
      restrictApplication(applicationId, organizationId),
  );
};

export const useRestoreApplicationMutation = () => {
  return useMutation(
    ({ applicationId, organizationId }: { applicationId: number; organizationId: string }) =>
      restoreApplication(applicationId, organizationId),
  );
};

export const useRemovOngApplication = () => {
  return useMutation(
    ({ applicationId, organizationId }: { applicationId: number; organizationId: string }) =>
      removeOngApplication(applicationId, organizationId),
  );
};

export const useRemovOngApplicationRequest = () => {
  return useMutation(({ applicationId }: { applicationId: number }) =>
    removeOngApplicationRequest(applicationId),
  );
};

export const useRemoveApplication = () => {
  return useMutation(({ applicationId }: { applicationId: number }) =>
    removeApplication(applicationId),
  );
};
