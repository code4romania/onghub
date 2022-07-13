import { useMutation, useQuery } from 'react-query';
import { IOrganizationFinancial } from '../../pages/organization/interfaces/OrganizationFinancial.interface';
import { IOrganizationGeneral } from '../../pages/organization/interfaces/OrganizationGeneral.interface';
import { useSelectedOrganization } from '../../store/selectors';
import useStore from '../../store/store';
import { getOrganization, patchOrganization } from './Organization.service';

interface OrganizationPayload {
  id: number;
  organization: {
    general?: IOrganizationGeneral;
    financial?: Partial<IOrganizationFinancial>;
  };
}

export const useOrganizationQuery = (id: number) => {
  const { setOrganizationGeneral, setOrganizationFinancial } = useStore();
  return useQuery(['organization', id], () => getOrganization(id), {
    onSuccess: (data: {
      organizationGeneral: IOrganizationGeneral;
      organizationFinancial: IOrganizationFinancial[];
    }) => {
      setOrganizationGeneral(data.organizationGeneral);
      setOrganizationFinancial(data.organizationFinancial);
    },
  });
};

export const useOrganizationMutation = () => {
  const { setOrganizationGeneral, setOrganizationFinancial } = useStore();
  const { organizationFinancial } = useSelectedOrganization();
  return useMutation(
    ({ id, organization }: OrganizationPayload) => patchOrganization(id, organization),
    {
      onSuccess: (
        data: IOrganizationGeneral | IOrganizationFinancial,
        { organization }: OrganizationPayload,
      ) => {
        if (organization.general) {
          setOrganizationGeneral(data as IOrganizationGeneral);
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
