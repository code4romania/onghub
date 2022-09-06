import { ApplicationTypeEnum } from '../enums/ApplicationType.enum';
import { OngApplicationStatus } from '../enums/ong-application-status.enum';

export interface ApplicationWithOngStatus {
  id: number;
  name: string;
  logo: string;
  shortdescription: string;
  loginlink: string;
  status: OngApplicationStatus;
}

export interface ApplicationWithOngStatusDetails
  extends ApplicationWithOngStatus {
  type: ApplicationTypeEnum;
  steps: string[];
  description: string;
  website: string;
  loginlink: string;
  videolink: string;
}
