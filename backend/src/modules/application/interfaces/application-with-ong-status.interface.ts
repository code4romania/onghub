import { ApplicationPullingType } from '../enums/application-pulling-type.enum';
import { ApplicationStatus } from '../enums/application-status.enum';
import { ApplicationTypeEnum } from '../enums/ApplicationType.enum';
import { OngApplicationStatus } from '../enums/ong-application-status.enum';
import { UserOngApplicationStatus } from '../enums/user-ong-application-status.enum';

export interface ApplicationWithOngStatus {
  id: number;
  name: string;
  logo: string;
  shortDescription: string;
  loginLink: string;
  website: string;
  createdOn: Date;
  status: ApplicationStatus;
  ongStatus: OngApplicationStatus;
  type: ApplicationTypeEnum;
}

export interface ApplicationWithOngStatusDetails
  extends ApplicationWithOngStatus {
  steps: string[];
  description: string;
  videoLink: string;
  userStatus: UserOngApplicationStatus;
  pullingType: ApplicationPullingType;
}
