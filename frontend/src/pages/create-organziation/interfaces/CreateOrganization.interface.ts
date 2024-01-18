import { City } from '../../../common/interfaces/city.interface';
import { County } from '../../../common/interfaces/county.interface';
import { Person } from '../../../common/interfaces/person.interface';
import { OrganizationAreaEnum } from '../../organization/components/OrganizationActivity/OrganizationActivityConfig';
import { OrganizationTypeEnum } from '../../organization/enums/OrganizationType.enum';
import { Contact } from '../../organization/interfaces/Contact.interface';
import { ContactPerson } from '../../organization/interfaces/ContactPerson.interface';

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
  contact: ContactPerson;
  city: City;
  county: County;
  cityId?: number;
  countyId?: number;
  organizationCity?: City;
  organizationCounty?: County;
  organizationCityId?: number;
  organizationCountyId?: number;
}

export interface ICreateOrganizationActivity {
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
  newFederations?: string[];
  newCoalitions?: string[];
}

export interface ICreateOrganizationLegal {
  legalReprezentative: Contact;
  directors: Contact[];
  others: Person[];
}
