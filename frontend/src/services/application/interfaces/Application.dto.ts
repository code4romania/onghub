import { ApplicationTypeEnum } from '../../../pages/apps-store/constants/ApplicationType.enum';
import { ApplicationPullingType } from '../../../pages/apps-store/enums/application-pulling-type.enum';
export interface CreateApplicationDto {
  name: string;
  type: ApplicationTypeEnum;
  shortDescription: string;
  description: string;
  videoLink: string;
  loginLink: string;
  pullingType?: { label: string; value: ApplicationPullingType };
  website: string;
  logo: string;
  steps: { item: string }[];
  applicationLabel: { label: string; value: string };
}
