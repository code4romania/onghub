import { BaseEntity } from '../../../common/interfaces/base-entity.interface';
import { City } from '../../../common/interfaces/city.interface';
import { County } from '../../../common/interfaces/county.interface';
import { OrganizationTypeEnum } from '../enums/OrganizationType.enum';
import { Contact } from './Contact.interface';

export interface OrganizationGeneral extends BaseEntity {
  id: number;
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
  logo: string;
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
}
