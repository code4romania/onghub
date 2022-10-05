import { City } from '../../../common/interfaces/city.interface';
import { County } from '../../../common/interfaces/county.interface';
import { Person } from '../../../common/interfaces/person.interface';
import { OrganizationAreaEnum } from '../../organization/components/OrganizationActivity/OrganizationActivityConfig';
import { OrganizationTypeEnum } from '../../organization/enums/OrganizationType.enum';
import { Contact } from '../../organization/interfaces/Contact.interface';

export interface ICreateOrganizationUser {
  name: string;
  phone: string;
  email: string;
}

export interface ICreateOrganizationPayload {
  admin: ICreateOrganizationUser;
  general: ICreateOrganizationGeneral;
  activity: ICreateOrganizationActivity;
  legal: ICreateOrganizationLegal;
}

export interface ICreateOrganizationGeneral {
  name: string;
  alias: string;
  type: OrganizationTypeEnum;
  email: string;
  phone: string;
  yearCreated: number;
  cui: string;
  rafNumber: string;
  shortDescription: string;
  description: string;
  logo?: string;
  website: string;
  facebook: string;
  instagram: string;
  twitter: string;
  linkedin: string;
  tiktok: string;
  donationWebsite: string;
  redirectLink: string;
  donationSMS: string;
  donationKeyword: string;
  contact: Contact;
  city: City;
  county: County;
  cityId?: number;
  countyId?: number;
}

export interface ICreateOrganizationActivity {
  area: OrganizationAreaEnum;
  isPartOfFederation: boolean;
  federations: { value: number; label: string }[];
  isPartOfCoalition: boolean;
  coalitions: { value: number; label: string }[];
  isPartOfInternationalOrganization: boolean;
  internationalOrganizationName: string;
  isSocialServiceViable: boolean;
  offersGrants: boolean;
  isPublicIntrestOrganization: boolean;
  hasBranches: boolean;
  branches: { value: number; label: string }[];
  domains: number[];
  regions: { value: number; label: string }[];
  cities: { value: number; label: string }[];
}

export interface ICreateOrganizationLegal {
  legalReprezentative: Contact;
  directors: Contact[];
  others: Person[];
}
