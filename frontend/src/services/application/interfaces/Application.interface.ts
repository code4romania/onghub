import { BaseEntity } from '../../../common/interfaces/base-entity.interface';
import { ApplicationTypeEnum } from '../../../pages/apps-store/constants/ApplicationType.enum';
import { IOrganization } from '../../../pages/organization/interfaces/Organization.interface';
import { OngApplicationStatus } from '../../../pages/requests/interfaces/OngApplication.interface';

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

// For Cards List
export interface ApplicationWithOngStatus {
  id: number;
  name: string;
  logo: string;
  shortdescription: string;
  status: OngApplicationStatus;
}

// Full details
export interface ApplicationWithOngStatusDetails extends ApplicationWithOngStatus {
  type: ApplicationTypeEnum;
  steps: string[];
  description: string;
  website: string;
  loginlink: string;
  videolink: string;
}
