import { useMutation, useQuery } from 'react-query';
import { IOrganizationActivity } from '../../pages/organization/interfaces/OrganizationActivity.interface';
import { IOrganizationFinancial } from '../../pages/organization/interfaces/OrganizationFinancial.interface';
import { IOrganizationGeneral } from '../../pages/organization/interfaces/OrganizationGeneral.interface';
import { IOrganizationLegal } from '../../pages/organization/interfaces/OrganizationLegal.interface';
import { IOrganizationReport } from '../../pages/organization/interfaces/OrganizationReport.interface';
import { useSelectedOrganization } from '../../store/selectors';
import useStore from '../../store/store';
import {
  activateOrganization,
  deleteInvestors,
  deleteInvestorsByProfile,
  deletePartners,
  deletePartnersByProfile,
  getOneOrganizationStatistics,
  getOrganization,
  getOrganizationApplicationRequests,
  getOrganizationApplications,
  getOrganizationByProfile,
  getOrganizations,
  getOrganizationsStatistics,
  patchOrganization,
  patchOrganizationByProfile,
  restrictOrganization,
  restrictOrganizationRequest,
  uploadInvestors,
  uploadInvestorsByProfile,
  uploadOrganizationFiles,
  uploadOrganizationFilesByProfile,
  uploadPartners,
  uploadPartnersByProfile,
} from './Organization.service';
import { Contact } from '../../pages/organization/interfaces/Contact.interface';
import { Person } from '../../common/interfaces/person.interface';
import { IOrganizationFull } from '../../pages/organization/interfaces/Organization.interface';
import { OrderDirection } from '../../common/enums/sort-direction.enum';
import { PaginatedEntity } from '../../common/interfaces/paginated-entity.interface';

interface OrganizationPayload {
  id?: number;
  organization: {
    general?: IOrganizationGeneral;
    activity?: Partial<IOrganizationActivity>;
    financial?: Partial<IOrganizationFinancial>;
    legal?: {
      legalReprezentative?: Partial<Contact>;
      directors?: Partial<Contact>[];
      directorsDeleted?: number[];
      others?: Partial<Person>[];
      organizationStatute?: string | null;
    };
    report?: {
      reportId: number;
      numberOfVolunteers?: number;
      numberOfContractors?: number;
      report?: string;
    };
  };
}

/**SUPER ADMIN */
export const useOrganizationsQuery = (
  limit: number,
  page: number,
  orderBy: string,
  orderDirection: OrderDirection,
  search?: string,
  status?: number,
  interval?: Date[],
  userCount?: string,
) => {
  const { setOrganizations } = useStore();
  return useQuery(
    ['organizations', limit, page, orderBy, orderDirection, search, status, interval, userCount],
    () =>
      getOrganizations(limit, page, orderBy, orderDirection, search, status, interval, userCount),
    {
      onSuccess: (data: PaginatedEntity<IOrganizationFull>) => {
        setOrganizations({
          items: data.items,
          meta: { ...data.meta, orderByColumn: orderBy, orderDirection },
        });
      },
      enabled: !!(limit && page && orderBy && orderDirection),
    },
  );
};

export const useOrganizationApplicationsQuery = (organizationId: string) => {
  return useQuery(
    ['applications', organizationId],
    () => getOrganizationApplications(organizationId),
    {
      enabled: !!organizationId,
    },
  );
};

export const useOrganizationApplicationRequestsQuery = (organizationId: string) => {
  return useQuery(
    ['requests', organizationId],
    () => getOrganizationApplicationRequests(organizationId),
    {
      enabled: !!organizationId,
    },
  );
};

export const useOrganizationQuery = (id: string) => {
  const {
    setOrganizationGeneral,
    setOrganizationActivity,
    setOrganizationFinancial,
    setOrganizationReport,
    setOrganizationLegal,
    setOrganization,
  } = useStore();
  return useQuery(['organization', id], () => getOrganization(id), {
    onSuccess: (data: IOrganizationFull) => {
      const {
        organizationGeneral,
        organizationActivity,
        organizationFinancial,
        organizationLegal,
        organizationReport,
        ...organization
      } = data;

      setOrganization(organization);
      setOrganizationGeneral(organizationGeneral);
      setOrganizationActivity(organizationActivity);
      setOrganizationFinancial(organizationFinancial);
      setOrganizationLegal(organizationLegal);
      setOrganizationReport(organizationReport);
    },
    enabled: !!id,
  });
};

export const useOrganizationMutation = () => {
  const {
    setOrganizationGeneral,
    setOrganizationFinancial,
    setOrganizationLegal,
    setOrganizationActivity,
    setOrganizationReport,
  } = useStore();
  const { organizationFinancial } = useSelectedOrganization();
  return useMutation(
    ({ id, organization }: OrganizationPayload) => patchOrganization(id as number, organization),
    {
      onSuccess: (
        data:
          | IOrganizationGeneral
          | IOrganizationActivity
          | IOrganizationFinancial
          | IOrganizationLegal
          | IOrganizationReport,
        { organization }: OrganizationPayload,
      ) => {
        if (organization.general) {
          setOrganizationGeneral(data as IOrganizationGeneral);
        }
        if (organization.activity) {
          setOrganizationActivity(data as IOrganizationActivity);
        }
        if (organization.legal) {
          setOrganizationLegal(data as IOrganizationLegal);
        }
        if (organization.financial) {
          setOrganizationFinancial([
            ...organizationFinancial.filter((org) => org.id !== data.id),
            data as IOrganizationFinancial,
          ]);
        }
        if (organization.report) {
          setOrganizationReport(data as IOrganizationReport);
        }
      },
    },
  );
};

export const useUploadOrganizationFilesMutation = () => {
  const { setOrganizationGeneral, setOrganizationLegal, organizationGeneral, organizationLegal } =
    useStore();
  return useMutation(
    ({ id, data }: { id: number; data: FormData }) => uploadOrganizationFiles(id, data),
    {
      onSuccess: (data: {
        organizationGeneral: IOrganizationGeneral;
        organizationLegal: IOrganizationLegal;
      }) => {
        if (organizationGeneral) {
          setOrganizationGeneral({ ...organizationGeneral, logo: data.organizationGeneral.logo });
        }

        if (organizationLegal) {
          setOrganizationLegal({
            ...organizationLegal,
            organizationStatute: data.organizationLegal?.organizationStatute,
          });
        }
      },
    },
  );
};

export const useUploadPartnersList = () => {
  const { setOrganizationReport } = useStore();
  return useMutation(
    ({ id, partnerId, data }: { id: number; partnerId: number; data: FormData }) =>
      uploadPartners(id, partnerId, data),
    {
      onSuccess: (data: IOrganizationReport) => setOrganizationReport(data),
    },
  );
};

export const useUploadInvestorsList = () => {
  const { setOrganizationReport } = useStore();
  return useMutation(
    ({ id, investorId, data }: { id: number; investorId: number; data: FormData }) =>
      uploadInvestors(id, investorId, data),
    {
      onSuccess: (data: IOrganizationReport) => setOrganizationReport(data),
    },
  );
};

export const useDeletePartnerMutation = () => {
  const { setOrganizationReport } = useStore();
  return useMutation(
    ({ id, partnerId }: { id: number; partnerId: number }) => deletePartners(id, partnerId),
    {
      onSuccess: (data: IOrganizationReport) => setOrganizationReport(data),
    },
  );
};

export const useDeleteInvestorMutation = () => {
  const { setOrganizationReport } = useStore();
  return useMutation(
    ({ id, investorId }: { id: number; investorId: number }) => deleteInvestors(id, investorId),
    {
      onSuccess: (data: IOrganizationReport) => setOrganizationReport(data),
    },
  );
};

export const useRestrictOrganizationMutation = () => {
  return useMutation((id: number) => restrictOrganization(id));
};

export const useActivateOrganizationMutation = () => {
  return useMutation((id: number) => activateOrganization(id));
};

/**EMPLOYEE & ADMIN */

export const useOrganizationByProfileQuery = () => {
  const {
    setOrganizationGeneral,
    setOrganizationActivity,
    setOrganizationFinancial,
    setOrganizationReport,
    setOrganizationLegal,
  } = useStore();
  return useQuery(['organization'], () => getOrganizationByProfile(), {
    onSuccess: (data: {
      organizationGeneral: IOrganizationGeneral;
      organizationActivity: IOrganizationActivity;
      organizationFinancial: IOrganizationFinancial[];
      organizationReport: IOrganizationReport;
      organizationLegal: IOrganizationLegal;
    }) => {
      setOrganizationGeneral(data.organizationGeneral);
      setOrganizationActivity(data.organizationActivity);
      setOrganizationFinancial(data.organizationFinancial);
      setOrganizationLegal(data.organizationLegal);
      setOrganizationReport(data.organizationReport);
    },
  });
};

export const useOrganizationByProfileMutation = () => {
  const {
    setOrganizationGeneral,
    setOrganizationFinancial,
    setOrganizationLegal,
    setOrganizationActivity,
    setOrganizationReport,
  } = useStore();
  const { organizationFinancial } = useSelectedOrganization();
  return useMutation(
    ({ organization }: OrganizationPayload) => patchOrganizationByProfile(organization),
    {
      onSuccess: (
        data:
          | IOrganizationGeneral
          | IOrganizationActivity
          | IOrganizationFinancial
          | IOrganizationLegal
          | IOrganizationReport,
        { organization }: OrganizationPayload,
      ) => {
        if (organization.general) {
          setOrganizationGeneral(data as IOrganizationGeneral);
        }
        if (organization.activity) {
          setOrganizationActivity(data as IOrganizationActivity);
        }
        if (organization.legal) {
          setOrganizationLegal(data as IOrganizationLegal);
        }
        if (organization.financial) {
          setOrganizationFinancial([
            ...organizationFinancial.filter((org) => org.id !== data.id),
            data as IOrganizationFinancial,
          ]);
        }
        if (organization.report) {
          setOrganizationReport(data as IOrganizationReport);
        }
      },
    },
  );
};

export const useUploadOrganizationFilesByProfileMutation = () => {
  const { setOrganizationGeneral, setOrganizationLegal, organizationGeneral, organizationLegal } =
    useStore();
  return useMutation(({ data }: { data: FormData }) => uploadOrganizationFilesByProfile(data), {
    onSuccess: (data: {
      organizationGeneral: IOrganizationGeneral;
      organizationLegal: IOrganizationLegal;
    }) => {
      if (organizationGeneral) {
        setOrganizationGeneral({ ...organizationGeneral, logo: data.organizationGeneral.logo });
      }

      if (organizationLegal) {
        setOrganizationLegal({
          ...organizationLegal,
          organizationStatute: data.organizationLegal?.organizationStatute,
        });
      }
    },
  });
};

export const useUploadPartnersListByProfile = () => {
  const { setOrganizationReport } = useStore();
  return useMutation(
    ({ partnerId, data }: { partnerId: number; data: FormData }) =>
      uploadPartnersByProfile(partnerId, data),
    {
      onSuccess: (data: IOrganizationReport) => setOrganizationReport(data),
    },
  );
};

export const useUploadInvestorsByProfileList = () => {
  const { setOrganizationReport } = useStore();
  return useMutation(
    ({ investorId, data }: { investorId: number; data: FormData }) =>
      uploadInvestorsByProfile(investorId, data),
    {
      onSuccess: (data: IOrganizationReport) => setOrganizationReport(data),
    },
  );
};

export const useDeletePartnerByProfileMutation = () => {
  const { setOrganizationReport } = useStore();
  return useMutation(({ partnerId }: { partnerId: number }) => deletePartnersByProfile(partnerId), {
    onSuccess: (data: IOrganizationReport) => setOrganizationReport(data),
  });
};

export const useDeleteInvestorByProfileMutation = () => {
  const { setOrganizationReport } = useStore();
  return useMutation(
    ({ investorId }: { investorId: number }) => deleteInvestorsByProfile(investorId),
    {
      onSuccess: (data: IOrganizationReport) => setOrganizationReport(data),
    },
  );
};


// Statistics

export const useAllOrganizationsStatisticsQuery = () => {
  const { setAllOrganizationsStatistics } = useStore();
  return useQuery(
    ['all-organizations-statistics'],
    () => getOrganizationsStatistics(),
    {
      onSuccess: (data: any) => setAllOrganizationsStatistics(data),
    },
  );
};

export const useOneOrganizationStatisticsQuery = (organizationId: number) => {
  const { setOneOrganizationStatistics } = useStore();
  return useQuery(
    ['orgranization-statistics', organizationId],
    () => getOneOrganizationStatistics(+organizationId),
    {
      enabled: !!organizationId,
      onSuccess: (data: any) => setOneOrganizationStatistics(data)
    },

  );
};

export const useRestrictOrganizationRequestMutation = () => {
  return useMutation(() => restrictOrganizationRequest());
};
