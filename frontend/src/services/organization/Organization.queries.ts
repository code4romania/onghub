import { useMutation, useQuery } from 'react-query';
import { OrganizationGeneral } from '../../pages/organization/interfaces/OrganizationGeneral.interface';
import useStore from '../../store/store';
import { getOrganization, patchOrganization } from './Organization.service';

export const useOrganizationQuery = (id: number) => {
  const { setOrganizationGeneral } = useStore();
  return useQuery(['organization', id], () => getOrganization(id), {
    onSuccess: (data: { organizationGeneral: OrganizationGeneral }) => {
      setOrganizationGeneral(data.organizationGeneral);
    },
  });
};

export const useOrganizationMutation = () => {
  const { setOrganizationGeneral } = useStore();
  return useMutation(
    ({
      id,
      organization,
    }: {
      id: number;
      organization: {
        general?: OrganizationGeneral;
      };
    }) => patchOrganization(id, organization),
    {
      onSuccess: (data: OrganizationGeneral) => {
        setOrganizationGeneral(data);
      },
    },
  );
};
