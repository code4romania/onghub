import { ApplicationTypeEnum } from '../../../pages/apps-store/constants/ApplicationType.enum';

export interface Application {
  name: string;
  type: ApplicationTypeEnum;
  shortDescription: string;
  description: string;
  videoLink: string;
  loginLink: string;
  logo: string;
  steps: string[];
}
