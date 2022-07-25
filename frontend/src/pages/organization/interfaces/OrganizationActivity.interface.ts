import { OrganizationAreaEnum } from './../components/OrganizationActivity/OrganizationActivityConfig';
import { BaseEntity } from '../../../common/interfaces/base-entity.interface';

export interface IOrganizationActivity extends BaseEntity {
  area: OrganizationAreaEnum;
  isPartOfFederation: boolean;
  federations: number[];
  isPartOfCoalition: boolean;
  coalitions: number[];
  isPartOfInternationalOrganization: boolean;
  internationalOrganizationName: string;
  isSocialServiceViable: boolean;
  offersGrants: boolean;
  isPublicIntrestOrganization: boolean;
  hasBranches: boolean;
  branches: number[];
  domains: number[];
  regions: number[];
  cities: number[];
}
