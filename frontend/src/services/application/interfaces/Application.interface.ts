import { BaseEntity } from '../../../common/interfaces/base-entity.interface';
import { ApplicationTypeEnum } from '../../../pages/apps-store/constants/ApplicationType.enum';

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
