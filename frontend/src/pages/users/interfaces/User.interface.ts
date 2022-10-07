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
}
