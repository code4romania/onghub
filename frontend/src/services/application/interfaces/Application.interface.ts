import { BaseEntity } from '../../../common/interfaces/base-entity.interface';
import { ApplicationTypeEnum } from '../../../pages/apps-store/constants/ApplicationType.enum';
import { OngApplicationStatus } from '../../../pages/requests/interfaces/OngApplication.interface';

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
  shortdescription: string;
  loginlink: string;
  status: OngApplicationStatus;
  type: ApplicationTypeEnum;
  website: string;
}

// Full details
export interface ApplicationWithOngStatusDetails extends ApplicationWithOngStatus {
  steps: string[];
  description: string;

  videolink: string;
}
