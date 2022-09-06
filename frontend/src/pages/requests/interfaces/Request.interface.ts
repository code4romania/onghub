import { BaseEntity } from '../../../common/interfaces/base-entity.interface';
import { IOrganizationFull } from '../../organization/interfaces/Organization.interface';
import { IUser } from '../../users/interfaces/User.interface';
import { RequestStatus } from '../enum/RequestStatus.enum';
import { OngApplication } from './OngApplication.interface';

export interface IOrganizationRequest extends BaseEntity {
  status: RequestStatus;
  user: IUser;
  organization: IOrganizationFull;
}

export interface IApplicationRequest extends BaseEntity {
  status: RequestStatus;
  organizationId: number;
  organization: Partial<IOrganizationFull>;

  ongApplicationId: number;
  ongApplication: OngApplication;
}
