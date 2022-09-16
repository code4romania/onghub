import { ApplicationTypeEnum } from '../../../pages/apps-store/constants/ApplicationType.enum';

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
  steps: { item: string }[];
}
