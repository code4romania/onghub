import { useMutation, useQuery } from 'react-query';
import { IOrganizationActivity } from '../../pages/organization/interfaces/OrganizationActivity.interface';
import { IOrganizationFinancial } from '../../pages/organization/interfaces/OrganizationFinancial.interface';
import { IOrganizationGeneral } from '../../pages/organization/interfaces/OrganizationGeneral.interface';
import { IOrganizationLegal } from '../../pages/organization/interfaces/OrganizationLegal.interface';
import { IOrganizationReport } from '../../pages/organization/interfaces/OrganizationReport.interface';
import { useSelectedOrganization } from '../../store/selectors';
import useStore from '../../store/store';
import {
  deleteInvestors,
  deletePartners,
  getOrganization,
  patchOrganization,
  uploadInvestors,
  uploadOrganizationFiles,
  uploadPartners,
} from './Organization.service';
import { Contact } from '../../pages/organization/interfaces/Contact.interface';
import { Person } from '../../common/interfaces/person.interface';

interface OrganizationPayload {
  id: number;
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

export const useOrganizationQuery = (id: number) => {
  const {
    setOrganizationGeneral,
    setOrganizationActivity,
    setOrganizationFinancial,
    setOrganizationReport,
    setOrganizationLegal,
  } = useStore();
  return useQuery(['organization', id], () => getOrganization(id), {
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
    ({ id, organization }: OrganizationPayload) => patchOrganization(id, organization),
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
