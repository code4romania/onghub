import { BaseEntity } from '../../../common/interfaces/base-entity.interface';
import { ApplicationTypeEnum } from '../../../pages/apps-store/constants/ApplicationType.enum';
import {
  OngApplicationStatus,
  UserOngApplicationStatus,
} from '../../../pages/requests/interfaces/OngApplication.interface';

export enum ApplicationStatus {
  ACTIVE = 'active',
  DISABLED = 'disabled',
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
  shortDescription: string;
  loginLink: string;
  status: OngApplicationStatus;
  type: ApplicationTypeEnum;
  website: string;
}

export interface ApplicationAccess {
  id: number;
  name: string;
  logo: string;
  status: UserOngApplicationStatus;
  type: ApplicationTypeEnum;
}

// Full details
export interface ApplicationWithOngStatusDetails extends ApplicationWithOngStatus {
  steps: string[];
  description: string;
  videoLink: string;
  managementUrl?: string;
}
