import { ApplicationTypeEnum } from '../enums/ApplicationType.enum';
import { UserOngApplicationStatus } from '../enums/user-ong-application-status.enum';

export interface ApplicationAccess {
  id: number;
  name: string;
  logo: string;
  status: UserOngApplicationStatus;
  type: ApplicationTypeEnum;
}

export interface Access {
  ongApplicationId: number;
  status: UserOngApplicationStatus;
}
