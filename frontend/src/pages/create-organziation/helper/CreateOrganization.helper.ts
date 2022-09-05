import { emptyStringToNull, mapSelectToValue } from '../../../common/helpers/format.helper';
import { CreateOrganizationRequestDTO } from '../../../services/request/interfaces/Request.dto';

export const createRequestDTOMapper = (data: any): CreateOrganizationRequestDTO | any => {
  const dto = {
    admin: { ...emptyStringToNull(data.admin), organizationId: -1 },
    organization: {
      general: {
        ...emptyStringToNull(data.general),
        logo: '',
        countyId: data?.general?.county.id,
        cityId: data?.general?.city.id,
      },
      activity: {
        ...emptyStringToNull(data.activity),
        branches: data?.activity?.branches
          ? [...data.activity.branches.map(mapSelectToValue)]
          : null,
        cities: data?.activity?.cities ? [...data.activity.cities.map(mapSelectToValue)] : null,
        regions: data?.activity?.regions ? [...data.activity.regions.map(mapSelectToValue)] : null,
        coalitions: data?.activity?.coalitions
          ? [...data.activity.coalitions.map(mapSelectToValue)]
          : null,
        federations: data?.activity?.federations
          ? [...data.activity.federations.map(mapSelectToValue)]
          : null,
      },
      legal: emptyStringToNull(data.legal),
    },
  };

  return dto;
};
