import { mapSelectToValue } from '../../../common/helpers/format.helper';
import { ICreateOrganizationPayload } from '../interfaces/CreateOrganization.interface';

export const createOrganizationDTOMapper = (data: any): ICreateOrganizationPayload | any => {
  const dto = {
    user: { ...data.user, organizationId: -1 },
    general: {
      ...data.general,
      logo: '',
      countyId: data?.general?.county.id,
      cityId: data?.general?.city.id,
    },
    activity: {
      ...data.activity,
      branches: data?.activity?.branches ? [...data.activity.branches.map(mapSelectToValue)] : [],
      cities: data?.activity?.cities ? [...data.activity.cities.map(mapSelectToValue)] : [],
      regions: data?.activity?.regions ? [...data.activity.regions.map(mapSelectToValue)] : [],
      coalitions: data?.activity?.coalitions
        ? [...data.activity.coalitions.map(mapSelectToValue)]
        : [],
      federations: data?.activity?.federations
        ? [...data.activity.federations.map(mapSelectToValue)]
        : [],
    },
    legal: data.legal,
  };

  return dto;
};
