import { useMutation, useQuery } from 'react-query';
import { IOrganizationActivity } from '../../pages/organization/interfaces/OrganizationActivity.interface';
import { CompletionStatus } from '../../pages/organization/enums/CompletionStatus.enum';
import { IOrganizationFinancial } from '../../pages/organization/interfaces/OrganizationFinancial.interface';
import { IOrganizationGeneral } from '../../pages/organization/interfaces/OrganizationGeneral.interface';
import { IOrganizationLegal } from '../../pages/organization/interfaces/OrganizationLegal.interface';
import { IOrganizationReport } from '../../pages/organization/interfaces/OrganizationReport.interface';
import { useSelectedOrganization } from '../../store/selectors';
import useStore from '../../store/store';
import { getOrganization, patchOrganization } from './Organization.service';
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
      setOrganizationReport({
        id: 1,
        reports: [
          {
            id: 1,
            numberOfContractors: 10,
            numberOfVolunteers: 20,
            report: 'https://www.clickdimensions.com/links/TestPDFfile.pdf',
            year: 2022,
            status: CompletionStatus.COMPLETED,
            updatedOn: new Date().toISOString(),
          },
          {
            id: 2,
            numberOfContractors: null,
            numberOfVolunteers: null,
            report: null,
            year: 2021,
            status: CompletionStatus.NOT_COMPLETED,
            updatedOn: new Date().toISOString(),
          },
        ],
        partners: [
          {
            id: 1,
            numberOfPartners: 12,
            updatedOn: new Date().toISOString(),
            year: 2022,
            status: CompletionStatus.NOT_COMPLETED,
          },
          {
            id: 2,
            numberOfPartners: 21,
            updatedOn: new Date().toISOString(),
            year: 2021,
            status: CompletionStatus.COMPLETED,
          },
        ],
        inverstors: [
          {
            id: 1,
            numberOfInvestors: 12,
            updatedOn: new Date().toISOString(),
            year: 2022,
            status: CompletionStatus.NOT_COMPLETED,
          },
          {
            id: 2,
            numberOfInvestors: 21,
            updatedOn: new Date().toISOString(),
            year: 2021,
            status: CompletionStatus.COMPLETED,
          },
        ],
      });
    },
  });
};

export const useOrganizationMutation = () => {
  const {
    setOrganizationGeneral,
    setOrganizationFinancial,
    setOrganizationLegal,
    setOrganizationActivity,
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
          | IOrganizationLegal,
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
      },
    },
  );
};
