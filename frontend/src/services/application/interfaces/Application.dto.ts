import { ApplicationTypeEnum } from '../../../pages/apps-store/constants/ApplicationType.enum';
import { OngApplicationStatus } from '../../../pages/requests/interfaces/OngApplication.interface';
import { ApplicationStatus } from './Application.interface';

export interface CreateApplicationDto {
  name: string;
  type: ApplicationTypeEnum;
  shortDescription: string;
  description: string;
  videoLink: string;
  loginLink: string;
  managementUrl?: string;
  website: string;
  logo: string;
  status?: ApplicationStatus | OngApplicationStatus;
  steps: { item: string }[];
}
