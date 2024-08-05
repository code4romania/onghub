import { BaseEntity } from '../../../common/interfaces/base-entity.interface';
import { UserStatus } from '../enums/UserStatus.enum';

export interface IUser extends BaseEntity {
  cognitoId: string;
  email: string;
  name: string;
  phone: string;
  role: string;
  status: UserStatus;
  organization: BaseEntity;

  availableAppsList?: string;
  availableApps: { id: number; name: string; type: string }[];
}

export interface IUserWithApplications extends BaseEntity {
  name: string;
  email: string;
  phone: string;
  status: UserStatus;
  availableApps: { id: number; name: string; type: string }[];
  availableAppsIDs: number[];
  organizationId: number;
  organizationAlias: string;
}
