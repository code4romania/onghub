import { Application } from '../../../services/application/interfaces/Application.interface';
import { IOrganization } from '../../organization/interfaces/Organization.interface';

export enum OngApplicationStatus {
  ACTIVE = 'active',
  PENDING = 'pending',
  RESTRICTED = 'restricted',
}

export interface OngApplication {
  organizationId: number;
  organization: IOrganization;

  applicationId: number;
  application: Application;

  status: OngApplicationStatus;
}
