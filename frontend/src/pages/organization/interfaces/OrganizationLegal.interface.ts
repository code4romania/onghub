import { BaseEntity } from '../../../common/interfaces/base-entity.interface';
import { Person } from '../../../common/interfaces/person.interface';
import { Contact } from './Contact.interface';

export interface IOrganizationLegal extends BaseEntity {
  legalReprezentative: Contact;
  directors: Contact[];
  others: Person[];
  organizationStatute?: string;
  nonPoliticalAffiliationFile?: string;
  balanceSheetFile?: string;
}
