import { ApplicationTypeEnum } from '../../../pages/apps-store/constants/ApplicationType.enum';
import {
  OngApplicationStatus,
  UserOngApplicationStatus,
} from '../../../pages/requests/interfaces/OngApplication.interface';

export enum ApplicationStatus {
  ACTIVE = 'active',
  DISABLED = 'disabled',
}

export interface Application {
  id: number;
  name: string;
  type: ApplicationTypeEnum;
  status: ApplicationStatus;
  logo: string;
  organizationCount: number;
  userCount: number;
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
  createdOn: Date;
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

export interface ApplicationOrganization {
  applicationId: number;
  organizationId: number;
  name: string;
  logo: string;
  userCount: number;
  createdOn: Date;
  status: OngApplicationStatus;
}

export interface OrganizationApplicationRequest {
  id: number;
  name: string;
  logo: string;
  createdOn: Date;
}
