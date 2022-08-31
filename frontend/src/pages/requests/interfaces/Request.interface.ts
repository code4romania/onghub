import { BaseEntity } from '../../../common/interfaces/base-entity.interface';
import { IOrganizationFull } from '../../organization/interfaces/Organization.interface';
import { IUser } from '../../users/interfaces/User.interface';
import { RequestStatus } from '../enum/RequestStatus.enum';

export interface IRequest extends BaseEntity {
  status: RequestStatus;
  user: IUser;
  organization: IOrganizationFull;
  createdOn: string;
}
