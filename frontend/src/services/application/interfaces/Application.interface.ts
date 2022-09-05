import { BaseEntity } from '../../../common/interfaces/base-entity.interface';
import { ApplicationTypeEnum } from '../../../pages/apps-store/constants/ApplicationType.enum';
import { IOrganization } from '../../../pages/organization/interfaces/Organization.interface';

export enum ApplicationStatus {
  ACTIVE = 'active',
  DISABLED = 'disabled',
}

export enum ApplicationPermission {
  ACTIVE = 'active',
  PENDING = 'pending',
  RESTRICTED = 'restricted',
}

export interface Application extends BaseEntity {
  name: string;
  type: ApplicationTypeEnum;
  status: ApplicationStatus;
  shortDescription: string;
  description: string;
  videoLink: string;
  loginLink: string;
  website: string;
  logo: string;
  steps: string[];
}

export interface ApplicationResponse {
  organization: IOrganization;
  application: Application;
  status: ApplicationPermission | null;
}
