import { useMutation, useQuery } from 'react-query';
import { OrderDirection } from '../../common/enums/sort-direction.enum';
import { PaginatedEntity } from '../../common/interfaces/paginated-entity.interface';
import { Person } from '../../common/interfaces/person.interface';
import { ApplicationTypeEnum } from '../../pages/apps-store/constants/ApplicationType.enum';
import { CompletionStatus } from '../../pages/organization/enums/CompletionStatus.enum';
import { Contact } from '../../pages/organization/interfaces/Contact.interface';
import { Expense } from '../../pages/organization/interfaces/Expense.interface';
import { Income } from '../../pages/organization/interfaces/Income.interface';
import {
  IOrganizationFull,
  IOrganizationView,
} from '../../pages/organization/interfaces/Organization.interface';
import { IOrganizationActivity } from '../../pages/organization/interfaces/OrganizationActivity.interface';
import { IOrganizationFinancial } from '../../pages/organization/interfaces/OrganizationFinancial.interface';
import { IOrganizationGeneral } from '../../pages/organization/interfaces/OrganizationGeneral.interface';
import { IOrganizationLegal } from '../../pages/organization/interfaces/OrganizationLegal.interface';
import { IOrganizationReport } from '../../pages/organization/interfaces/OrganizationReport.interface';
import { useSelectedOrganization } from '../../store/selectors';
import useStore from '../../store/store';
import {
  activateOrganization,
  deleteBalanceSheetFile,
  deleteInvestors,
  deleteInvestorsByProfile,
  deleteNonPolicalAffiliationFile,
  deleteOrganizationStatute,
  deletePartners,
  deletePartnersByProfile,
  getOrganization,
  getOrganizationApplicationRequests,
  getOrganizationApplications,
  getOrganizationByProfile,
  getOrganizations,
  patchOrganization,
  patchOrganizationByProfile,
  restrictOrganization,
  restrictOrganizationRequest,
  retryAnafReports,
  uploadInvestors,
  uploadInvestorsByProfile,
  uploadPartners,
  uploadPartnersByProfile,
} from './Organization.service';

interface OrganizationPayload {
  id?: number;
  organization: {
    general?: IOrganizationGeneral;
    activity?: Partial<IOrganizationActivity>;
    financial?: { id: number; data: Partial<Income | Expense> };
    legal?: {
      legalReprezentative?: Partial<Contact>;
      directors?: Partial<Contact>[];
      directorsDeleted?: number[];
      others?: Partial<Person>[];
    };
    report?: {
      reportId: number;
      numberOfVolunteers?: number;
      numberOfContractors?: number;
      report?: string;
    };
  };
  logo?: File | null;
  organizationStatute?: File | null;
  nonPoliticalAffiliationFile?: File | null;
  balanceSheetFile?: File | null;
}

/**SUPER ADMIN */
export const useOrganizationsQuery = (
  limit: number,
  page: number,
  orderBy: string,
  orderDirection: OrderDirection,
  search?: string,
  status?: CompletionStatus,
  interval?: Date[],
  userCount?: string,
) => {
  const { setOrganizations } = useStore();
  return useQuery(
    ['organizations', limit, page, orderBy, orderDirection, search, status, interval, userCount],
    () =>
      getOrganizations(limit, page, orderBy, orderDirection, search, status, interval, userCount),
    {
      onSuccess: (data: PaginatedEntity<IOrganizationView>) => {
        setOrganizations({
          items: data.items,
          meta: { ...data.meta, orderByColumn: orderBy, orderDirection },
        });
      },
      enabled: !!(limit && page && orderBy && orderDirection),
    },
  );
};

export const useOrganizationApplicationsQuery = (
  organizationId: string,
  search?: string,
  type?: ApplicationTypeEnum,
) => {
  return useQuery(
    ['applications', organizationId, search, type],
    () => getOrganizationApplications(organizationId, search, type),
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
    ({
      id,
      organization,
      logo,
      organizationStatute,
      nonPoliticalAffiliationFile,
      balanceSheetFile,
    }: OrganizationPayload) =>
      patchOrganization(
        id as number,
        organization,
        logo,
        organizationStatute,
        nonPoliticalAffiliationFile,
        balanceSheetFile,
      ),
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

export const useUploadPartnersList = () => {
  const { setOrganizationReport } = useStore();
  return useMutation(
    ({ id, partnerId, data }: { id: string; partnerId: number; data: FormData }) =>
      uploadPartners(id, partnerId, data),
    {
      onSuccess: (data: IOrganizationReport) => setOrganizationReport(data),
    },
  );
};

export const useUploadInvestorsList = () => {
  const { setOrganizationReport } = useStore();
  return useMutation(
    ({ id, investorId, data }: { id: string; investorId: number; data: FormData }) =>
      uploadInvestors(id, investorId, data),
    {
      onSuccess: (data: IOrganizationReport) => setOrganizationReport(data),
    },
  );
};

export const useDeletePartnerMutation = () => {
  const { setOrganizationReport } = useStore();
  return useMutation(
    ({ id, partnerId }: { id: string; partnerId: number }) => deletePartners(id, partnerId),
    {
      onSuccess: (data: IOrganizationReport) => setOrganizationReport(data),
    },
  );
};

export const useDeleteInvestorMutation = () => {
  const { setOrganizationReport } = useStore();
  return useMutation(
    ({ id, investorId }: { id: string; investorId: number }) => deleteInvestors(id, investorId),
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
    ({
      organization,
      logo,
      organizationStatute,
      nonPoliticalAffiliationFile,
      balanceSheetFile,
    }: OrganizationPayload) =>
      patchOrganizationByProfile(
        organization,
        logo,
        organizationStatute,
        nonPoliticalAffiliationFile,
        balanceSheetFile,
      ),
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

export const useRestrictOrganizationRequestMutation = () => {
  return useMutation(() => restrictOrganizationRequest());
};

export const useDeleteOrganizationStatuteMutation = () => {
  const { setOrganizationLegal, organizationLegal } = useStore();
  return useMutation(
    ({ organizationId }: { organizationId: number }) => deleteOrganizationStatute(organizationId),
    {
      onSuccess: () => {
        // the request returns only success (200) then we remove the statute s3 path from the store
        setOrganizationLegal({
          ...(organizationLegal as IOrganizationLegal),
          organizationStatute: undefined,
        });
      },
    },
  );
};

export const useDeleteNonPoliticalAffiliationFileMutation = () => {
  const { setOrganizationLegal, organizationLegal } = useStore();
  return useMutation(
    ({ organizationId }: { organizationId: number }) =>
      deleteNonPolicalAffiliationFile(organizationId),
    {
      onSuccess: () => {
        setOrganizationLegal({
          ...(organizationLegal as IOrganizationLegal),
          nonPoliticalAffiliationFile: undefined,
        });
      },
    },
  );
};

export const useDeleteBalanceSheetFileMutation = () => {
  const { setOrganizationLegal, organizationLegal } = useStore();
  return useMutation(
    ({ organizationId }: { organizationId: number }) => deleteBalanceSheetFile(organizationId),
    {
      onSuccess: () => {
        setOrganizationLegal({
          ...(organizationLegal as IOrganizationLegal),
          balanceSheetFile: undefined,
        });
      },
    },
  );
};

export const useRetryAnafFinancialMutation = () => {
  const { setOrganizationFinancial } = useStore();
  return useMutation(
    ({ organizationId, cui }: { organizationId: number; cui: string }) =>
      retryAnafReports(organizationId, cui),
    {
      onSuccess: (data: IOrganizationFinancial[]) => setOrganizationFinancial(data),
    },
  );
};
