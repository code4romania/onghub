import { BaseEntity } from '../../../common/interfaces/base-entity.interface';
import { OrganizationStatus } from '../enums/OrganizationStatus.enum';
import { IOrganizationActivity } from './OrganizationActivity.interface';
import { IOrganizationFinancial } from './OrganizationFinancial.interface';
import { IOrganizationGeneral } from './OrganizationGeneral.interface';
import { IOrganizationLegal } from './OrganizationLegal.interface';
import { IOrganizationReport } from './OrganizationReport.interface';

export interface IOrganization extends BaseEntity {
  status: OrganizationStatus;
  syncedOn: Date;
}

export interface IOrganizationFull extends IOrganization {
  organizationGeneral: IOrganizationGeneral;
  organizationActivity: IOrganizationActivity;
  organizationFinancial: IOrganizationFinancial[];
  organizationLegal: IOrganizationLegal;
  organizationReport: IOrganizationReport;
}
