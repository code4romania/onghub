import { str2bool } from '../../common/helpers/format.helper';
import { ICreateOrganizationActivity } from '../../pages/create-organziation/interfaces/CreateOrganization.interface';
import { OrganizationAreaEnum } from '../../pages/organization/components/OrganizationActivity/OrganizationActivityConfig';

export const parseOrganizationActivityDataToPayload = (data: any): ICreateOrganizationActivity => {
  const isPartOfFederation = str2bool(data.isPartOfFederation);
  const isPartOfCoalition = str2bool(data.isPartOfCoalition);
  const isPartOfInternationalOrganization = str2bool(data.isPartOfInternationalOrganization);
  const isSocialServiceViable = str2bool(data.isSocialServiceViable);
  const offersGrants = str2bool(data.offersGrants);
  const hasBranches = str2bool(data.hasBranches);
  const isPublicIntrestOrganization = str2bool(data.isPublicIntrestOrganization);

  let payload: any = {
    area: data.area,
    domains: data.domains,
    isPartOfFederation,
    isPartOfCoalition,
    isPartOfInternationalOrganization,
    isSocialServiceViable,
    isPublicIntrestOrganization,
    offersGrants,
    hasBranches,
  };

  if (hasBranches) {
    payload = {
      ...payload,
      branches: data.branches || [],
    };
  }

  if (data.area === OrganizationAreaEnum.LOCAL) {
    payload = {
      ...payload,
      cities: data.cities || [],
    };
  }

  if (data.area === OrganizationAreaEnum.REGIONAL) {
    payload = {
      ...payload,
      regions: data.regions || [],
    };
  }

  if (isPartOfCoalition) {
    payload = {
      ...payload,
      coalitions: data.coalitions || [],
    };
  }

  if (isPartOfFederation) {
    payload = {
      ...payload,
      federations: data.federations || [],
    };
  }

  if (isPartOfInternationalOrganization) {
    payload = {
      ...payload,
      internationalOrganizationName: data.internationalOrganizationName,
    };
  }

  return payload;
};
