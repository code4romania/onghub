import { ApplicationTypeEnum } from '../../../pages/apps-store/constants/ApplicationType.enum';
import { ApplicationPullingType } from '../../../pages/apps-store/enums/application-pulling-type.enum';
export interface CreateApplicationDto {
  name: string;
  type: ApplicationTypeEnum;
  shortDescription: string;
  description: string;
  videoLink: string | undefined;
  loginLink: string | undefined;
  pullingType?: { label: string; value: ApplicationPullingType };
  website: string | undefined;
  logo: string;
  steps: { item: string }[];
}
