import { ApplicationTypeEnum } from '../enums/ApplicationType.enum';
import { OngApplicationStatus } from '../enums/ong-application-status.enum';

export interface ApplicationWithOngStatus {
  id: number;
  name: string;
  logo: string;
  shortdescription: string;
  loginlink: string;
  website: string;
  status: OngApplicationStatus;
  type: ApplicationTypeEnum;
}

export interface ApplicationWithOngStatusDetails
  extends ApplicationWithOngStatus {
  steps: string[];
  description: string;
  loginlink: string;
  videolink: string;
}
