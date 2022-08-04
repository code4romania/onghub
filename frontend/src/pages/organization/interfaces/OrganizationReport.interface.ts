import { BaseEntity } from '../../../common/interfaces/base-entity.interface';
import { Investor } from './Investor.interface';
import { Partner } from './Partner.interface';
import { Report } from './Report.interface';

export interface IOrganizationReport extends BaseEntity {
  reports: Report[];
  partners: Partner[];
  investors: Investor[];
}
